import { VOICE_OPTIONS } from "./constant";

export class AudioHandler {
  private static instance: AudioHandler | null = null;
  private voice: VOICE_OPTIONS;
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

  public async pcmToWav(
    pcmData: ArrayBuffer,
    sampleRate: number,
    numChannels: number = 1
  ): Promise<Blob> {
    const byteRate = sampleRate * numChannels * 2; // 16-bit audio, so 2 bytes per sample
    const blockAlign = numChannels * 2; // 2 bytes per sample for each channel

    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);

    // RIFF chunk descriptor
    view.setUint32(0, 0x52494646, false); // "RIFF" in ASCII
    view.setUint32(4, 36 + pcmData.byteLength, true); // file size minus first 8 bytes
    view.setUint32(8, 0x57415645, false); // "WAVE" in ASCII

    // fmt subchunk
    view.setUint32(12, 0x666d7420, false); // "fmt " in ASCII
    view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
    view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
    view.setUint16(22, numChannels, true); // Number of channels
    view.setUint32(24, sampleRate, true); // Sample rate
    view.setUint32(28, byteRate, true); // Byte rate
    view.setUint16(32, blockAlign, true); // Block align
    view.setUint16(34, 16, true); // Bits per sample (16-bit)

    // data subchunk
    view.setUint32(36, 0x64617461, false); // "data" in ASCII
    view.setUint32(40, pcmData.byteLength, true); // Subchunk2Size (data size)

    // Create a Uint8Array combining the header and the PCM data
    const wavBuffer = new Uint8Array(wavHeader.byteLength + pcmData.byteLength);
    wavBuffer.set(new Uint8Array(wavHeader), 0);
    wavBuffer.set(new Uint8Array(pcmData), wavHeader.byteLength);

    // Return the Blob object containing the WAV file
    return new Blob([wavBuffer], { type: "audio/wav" });
  }
  public async playSound(audioBinary: ArrayBuffer) {
    switch (this.voice) {
      case "Deepgram": {
        const audioBlob = new Blob([audioBinary], { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(audioBlob);
        this.audio.pause();
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

        break;
      }
      case "Cartesia": {
        this.audioContext.resume();

        this.audio.pause()

        const float32Array = new Float32Array(audioBinary);
        const toPlayFile = await this.pcmToWav(float32Array, 44100, 1);
        const audioUrl = URL.createObjectURL(toPlayFile);
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
        break;
      }
    }
  }

  public async pauseAudio() {
    switch (this.voice) {
      case "Deepgram":
        this.audio.pause();
        break;
      case "Cartesia":
        await this.audioContext.suspend();
        break;
    }
  }
  // Add additional methods as needed
}
