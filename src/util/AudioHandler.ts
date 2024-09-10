import { Dispatch, SetStateAction } from "react";
import { VOICE_OPTIONS } from "./constant";

export class AudioHandler {
  private static instance: AudioHandler | null = null;
  public voice: VOICE_OPTIONS;

  private audio: HTMLAudioElement;
  private audioUrl: string = "";

  public audioStatus: boolean = false;
  public setAudioStatus!: Dispatch<SetStateAction<boolean>>;

  private constructor(voice: VOICE_OPTIONS) {
    this.voice = voice;
    this.audio = new Audio();
  }

  public static getInstance(
    voice: VOICE_OPTIONS,
    audioStatus: boolean,
    setAudioStatus: Dispatch<SetStateAction<boolean>>
  ): AudioHandler {
    if (!AudioHandler.instance) {
      AudioHandler.instance = new AudioHandler(voice);
      AudioHandler.instance.audioStatus = audioStatus;
      AudioHandler.instance.setAudioStatus = setAudioStatus;
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
    this.audio.pause();
    switch (this.voice) {
      case "Cartesia": {
        const float32Array = new Float32Array(audioBinary);
        const toPlayFile = await this.pcmFloatToWavBlob(float32Array, 44100);
        this.audioUrl = URL.createObjectURL(toPlayFile);
        break;
      }
      default: {
        // Default is set to Deepgram
        const audioBlob = new Blob([audioBinary], { type: "audio/mpeg" });
        this.audioUrl = URL.createObjectURL(audioBlob);
        this.audio.pause();
        break;
      }
    }
    this.audio.src = this.audioUrl;

    this.audio.onplay = () =>{
      this.setAudioStatus(true);
      this.audioStatus = true;
    }
    this.audio.onpause = () => {
      this.setAudioStatus(false)
      this.audioStatus = false;
      URL.revokeObjectURL(this.audioUrl);
    };
    this.audio.onended = () => {
      this.setAudioStatus(false)
      this.audioStatus = false;
      URL.revokeObjectURL(this.audioUrl);
    };
    this.audio.oncancel = () => {
      this.setAudioStatus(false)
      this.audioStatus = false;
      URL.revokeObjectURL(this.audioUrl);
    };

    this.audio.onerror = () => {
      this.setAudioStatus(false)
      this.audioStatus = false;
      URL.revokeObjectURL(this.audioUrl);
    }
    try {
      await this.audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }

  public async pauseAudio() {
    this.audio.pause();
    
  }

  public async resumeAudio() {
    this.audio.play()
  }

  public async replayAudio(){
    this.audio.currentTime = 0;

    this.resumeAudio();
  }
  // Add additional methods as needed
}
