import { Socket } from "socket.io-client";

export async function playAudio(
  audioBuffer: ArrayBuffer
): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    const audioContext = new AudioContext();
    audioContext.decodeAudioData(
      audioBuffer,
      (decodedData) => {
        const audioSource = audioContext.createBufferSource();
        audioSource.buffer = decodedData;
        audioSource.connect(audioContext.destination);

        const audioElement = new Audio();
        audioElement.src = URL.createObjectURL(
          new Blob([audioBuffer], { type: "audio/wav" })
        );
        audioElement
          .play()
          .then(() => {
            audioSource.start(0);
            resolve(audioElement);
          })
          .catch(reject);
      },
      reject
    );
  });
}


export async function getMicrophone(): Promise<MediaRecorder> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return new MediaRecorder(stream, { mimeType: "audio/webm" });
  } catch (error) {
    console.error("Error accessing microphone:", error);
    throw error;
  }
}

export async function openMicrophone(
  microphone: MediaRecorder,
  socket: Socket
): Promise<void> {
  return new Promise((resolve) => {
    microphone.onstart = () => {
      console.log("Client: Microphone opened");
      document.body.classList.add("recording");
      resolve();
    };

    microphone.ondataavailable = async (event: BlobEvent) => {
      console.log("Client: Microphone data received");
      if (event.data.size > 0) {
        socket.emit("audio_stream", { data: event.data, sessionId: "2" });
      }
    };

    microphone.start(1000);
  });
}
