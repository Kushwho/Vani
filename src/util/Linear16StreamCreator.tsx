export function createLinear16Stream(duration: number): Uint8Array {
  function writeString(view: DataView, offset: number, string: string): void {
    for (let i: number = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
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
  writeString(view, 0, "RIFF"); // ChunkID
  view.setUint32(4, fileSize - 8, true); // ChunkSize
  writeString(view, 8, "WAVE"); // Format
  writeString(view, 12, "fmt "); // Subchunk1ID
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true); // ByteRate
  view.setUint16(32, numChannels * bytesPerSample, true); // BlockAlign
  view.setUint16(34, 8 * bytesPerSample, true); // BitsPerSample
  writeString(view, 36, "data"); // Subchunk2ID
  view.setUint32(40, dataSize, true); // Subchunk2Size

  // Write zero-filled payload (silence)
  for (let i: number = 44; i < fileSize; i++) {
    view.setUint8(i, 0);
  }

  return new Uint8Array(buffer);
}
