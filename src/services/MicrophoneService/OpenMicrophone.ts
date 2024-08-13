export default async (
  microphone: MediaRecorder,
  onStart: Function,
  onDataAvailable: (event: BlobEvent) => void
) => {
  return new Promise<void>((resolve) => {
    microphone.onstart = () => {
      onStart();
      resolve();
    };
    microphone.ondataavailable = (event) => {
      if (event.data.size > 0) {
        onDataAvailable(event);
      }
    };
    microphone.start(1000);
  });
};
