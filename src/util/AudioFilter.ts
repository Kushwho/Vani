export class AudioFilter {
  private static instance: AudioFilter | null = null;
  private audioContext: AudioContext;
  private workletNode: AudioWorkletNode;
  private microphoneStream: MediaStreamAudioSourceNode | null = null;
  private onProcessedAudioCallback: ((processedAudio: Blob) => void) | null =
    null;

  private linear16Stream: Uint8Array;
  private constructor(
    audioContext: AudioContext,
    workletNode: AudioWorkletNode
  ) {
    this.audioContext = audioContext;
    this.workletNode = workletNode;
    this.workletNode.disconnect();
    this.linear16Stream = this.createLinear16Stream(100);
    this.workletNode.port.onmessage = (event) => {
      const { aboveThreshold, level, processedAudio } = event.data;
      console.log("DB Level", level);

      let blob: Blob;
      let byteArray: ArrayBufferLike;

      if (aboveThreshold) {
        byteArray = new Float32Array(processedAudio).buffer;
        blob = new Blob([byteArray], { type: "audio/wav" });
      } else {
        byteArray = this.linear16Stream;
        blob = new Blob([byteArray], { type: "audio/wav" });
      }
      if (this.onProcessedAudioCallback) {
        this.onProcessedAudioCallback(blob);
      }
    };
  }

  public static async getInstance(): Promise<AudioFilter> {
    if (!AudioFilter.instance) {
      const audioContext = new AudioContext();
      await audioContext.audioWorklet.addModule("/volume-processor.js");
      const workletNode = new AudioWorkletNode(
        audioContext,
        "volume-processor"
      );

      AudioFilter.instance = new AudioFilter(audioContext, workletNode);
    }
    return AudioFilter.instance;
  }

  public async startMicrophoneProcessing(): Promise<void> {
    console.log("Starting microphone processing");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("Got media stream");
    this.microphoneStream = this.audioContext.createMediaStreamSource(stream);
    console.log("Created media stream source");
    this.microphoneStream.connect(this.workletNode);
    console.log("Connected to worklet node");
  }

  public stopMicrophoneProcessing(): void {
    if (this.microphoneStream) {
      this.microphoneStream.disconnect();
      this.microphoneStream = null;
    }
    this.workletNode.disconnect();
  }

  public setProcessedAudioCallback(
    callback: (processedAudio: Blob) => void
  ): void {
    this.onProcessedAudioCallback = callback;
  }

  private createLinear16Stream(duration: number): Uint8Array {
    const sampleRate: number = 44100; // Standard sample rate (Hz)
    const numChannels: number = 1; // Mono
    const bytesPerSample: number = 2; // 16-bit = 2 bytes

    const numSamples: number = Math.floor(sampleRate * duration);
    const dataSize: number = numSamples * numChannels * bytesPerSample;
    const fileSize: number = 44 + dataSize; // 44 bytes for header + data size

    // Create a buffer for the entire file
    const buffer: ArrayBuffer = new ArrayBuffer(fileSize);
    const view: DataView = new DataView(buffer);

    // Write WAV header
    this.writeString(view, 0, "RIFF"); // ChunkID
    view.setUint32(4, fileSize - 8, true); // ChunkSize
    this.writeString(view, 8, "WAVE"); // Format
    this.writeString(view, 12, "fmt "); // Subchunk1ID
    view.setUint32(16, 16, true); // Subchunk1Size
    view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
    view.setUint16(22, numChannels, true); // NumChannels
    view.setUint32(24, sampleRate, true); // SampleRate
    view.setUint32(28, sampleRate * numChannels * bytesPerSample, true); // ByteRate
    view.setUint16(32, numChannels * bytesPerSample, true); // BlockAlign
    view.setUint16(34, 8 * bytesPerSample, true); // BitsPerSample
    this.writeString(view, 36, "data"); // Subchunk2ID
    view.setUint32(40, dataSize, true); // Subchunk2Size

    // Write zero-filled payload (silence)
    for (let i: number = 44; i < fileSize; i++) {
      view.setUint8(i, 0);
    }

    return new Uint8Array(buffer);
  }

  private writeString(view: DataView, offset: number, string: string): void {
    for (let i: number = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  public getLinear16Stream(): Uint8Array {
    return this.linear16Stream;
  }
}
