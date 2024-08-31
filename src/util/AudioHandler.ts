import { VOICE_OPTIONS } from "./constant";

export class AudioHandler {
  private static instance: AudioHandler | null = null;
  public voice: VOICE_OPTIONS;
  private audioContext: AudioContext;
  private audio: HTMLAudioElement;

  private constructor(voice: VOICE_OPTIONS) {
    this.voice = voice;

    this.audioContext = new window.AudioContext();
    this.audioContext.audioWorklet.addModule("my-audio-processor.js");
    this.audio = new Audio();
  }

  public static getInstance(voice: VOICE_OPTIONS): AudioHandler {
    if (!AudioHandler.instance) {
      AudioHandler.instance = new AudioHandler(voice);
    }
    return AudioHandler.instance;
  }

  private async pcmFloatToWavBlob(
    pcmData: Float32Array,
    sampleRate: number
  ): Promise<Blob> {
    const numChannels = 1; // Mono
    const bitDepth = 32;
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = pcmData.length * bytesPerSample;
    const bufferSize = 44 + dataSize;
    const buffer = new ArrayBuffer(bufferSize);
    const view = new DataView(buffer);

    // Write WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    view.setUint32(4, bufferSize - 8, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 3, true); // AudioFormat 3 for IEEE float
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, "data");
    view.setUint32(40, dataSize, true);

    // Write PCM data
    for (let i = 0; i < pcmData.length; i++) {
      view.setFloat32(44 + i * bytesPerSample, pcmData[i], true);
    }

    return new Blob([buffer], { type: "audio/wav" });
  }
  public async playSound(audioBinary: ArrayBuffer) {
    let audioUrl: string;

    this.audio.pause();
    switch (this.voice) {
      case "Cartesia": {
        const float32Array = new Float32Array(audioBinary);
        const toPlayFile = await this.pcmFloatToWavBlob(float32Array, 44100);
        audioUrl = URL.createObjectURL(toPlayFile);
        break;
      }
      default: {
        // Default is set to Deepgram
        const audioBlob = new Blob([audioBinary], { type: "audio/mpeg" });
        audioUrl = URL.createObjectURL(audioBlob);
        this.audio.pause();
        break;
      }
    }
    this.audio.src = audioUrl;

    this.audio.onpause = () => {
      URL.revokeObjectURL(audioUrl);
    };
    this.audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
    this.audio.oncancel = () => {
      URL.revokeObjectURL(audioUrl);
    };
    try {
      await this.audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }

  public async pauseAudio() {
    this.audio.pause();
  }
  // Add additional methods as needed
}
