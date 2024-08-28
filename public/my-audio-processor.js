class MyAudioProcessor extends AudioWorkletProcessor {
  process(inputs, outputs) {
    const input = inputs[0];
    const output = outputs[0];

    if (input.length > 0) {
      const inputChannel = input[0]; // Mono channel
      const outputChannel = output[0]; // Mono channel

      for (let i = 0; i < inputChannel.length; i++) {
        // Simple processing: for example, amplifying the signal
        outputChannel[i] = inputChannel[i] * 1.5; // Amplify the signal by 1.5x
      }
    }

    return true; // Keep the processor alive
  }
}

registerProcessor("my-audio-processor", MyAudioProcessor);
