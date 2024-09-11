export class AudioFilter {
    private static instance: AudioFilter | null = null;
    private audioContext: AudioContext;
    private workletNode: AudioWorkletNode;
    private microphoneStream: MediaStreamAudioSourceNode | null = null;
    private onProcessedAudioCallback: ((processedAudio: Float32Array) => void) | null = null;
  
    private constructor(audioContext: AudioContext, workletNode: AudioWorkletNode) {
      this.audioContext = audioContext;
      this.workletNode = workletNode;
      this.workletNode.port.onmessage = (event) => {
        const { aboveThreshold, level, processedAudio } = event.data;
        console.log(`Audio level: ${level.toFixed(2)} dB, Above threshold: ${aboveThreshold}`);
        
        if (this.onProcessedAudioCallback && processedAudio) {
          this.onProcessedAudioCallback(processedAudio);
        }
      };
    }
  
    public static async getInstance(): Promise<AudioFilter> {
      if (!AudioFilter.instance) {
        const audioContext = new AudioContext();
        await audioContext.audioWorklet.addModule('volume-processor.js');
        const workletNode = new AudioWorkletNode(audioContext, 'volume-processor');
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
        this.workletNode.connect(this.audioContext.destination);
        console.log("Connected to destination");
      
    }
  
    public stopMicrophoneProcessing(): void {
      if (this.microphoneStream) {
        this.microphoneStream.disconnect();
        this.microphoneStream = null;
      }
      this.workletNode.disconnect();
    }
  
    public setProcessedAudioCallback(callback: (processedAudio: Float32Array) => void): void {
      this.onProcessedAudioCallback = callback;
    }
  }
  
  