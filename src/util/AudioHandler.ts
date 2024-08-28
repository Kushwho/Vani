import { VOICE_OPTIONS } from "./constant";

export class AudioHandler {
  private static instance: AudioHandler | null = null;
  private voice: VOICE_OPTIONS;
  private audioContext: AudioContext;
  private audio: HTMLAudioElement;

  private constructor(voice: VOICE_OPTIONS) {
    this.voice = voice;

    this.audioContext = new window.AudioContext();
    this.audioContext.audioWorklet.addModule('my-audio-processor.js')
    this.audio = new Audio();
  }

  public static getInstance(voice: VOICE_OPTIONS): AudioHandler {
    if (!AudioHandler.instance) {
      AudioHandler.instance = new AudioHandler(voice);
    }
    return AudioHandler.instance;
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


        const float32Array = new Float32Array(audioBinary);
        const audioBuffer = this.audioContext.createBuffer(
          1,
          float32Array.length,
          44100
        );
        audioBuffer.copyToChannel(float32Array, 0);

        const bufferSource = this.audioContext.createBufferSource();
        bufferSource.buffer = audioBuffer;
        bufferSource.connect(this.audioContext.destination);

        bufferSource.start();
        bufferSource.onended = () => {
          this.audioContext.suspend();
        };
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
