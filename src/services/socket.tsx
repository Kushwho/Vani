import { io, Socket } from "socket.io-client";

// Define the socket port type as a constant

export class MySocket {
  private static instance: MySocket;
  private socket: Socket;

  private constructor() {
    console.log("Instance Created");
    this.socket = io("ws://localhost:5001");
  }

  // Method to get the singleton instance
  public static getInstance(): MySocket {
    if (!MySocket.instance) {
      MySocket.instance = new MySocket();
    }
    return MySocket.instance;
  }

  // Method to get the Socket instance
  public getSocket(): Socket {
    return this.socket;
  }

  // Emit an event
  public emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  // Listen for the 'connect' event
  public onConnect(fxnToBeExecuted: () => void): void {
    this.socket.on("connect", () => {
      fxnToBeExecuted();
    });
  }

  // Listen for the 'transcription_update' event
  public onTranscriptionUpdate(fxnToBeExecuted: Function): void {
    console.log("Hi");
    
    this.socket.on("transcription_update", (data) => {
      console.log("Transcription being updated");

      fxnToBeExecuted(data);
    });
  }

  public onDeepGramConnectionOpen(fxnToBeExecuted: Function): void {
    this.socket.on("deepgram_connection_opened", () => {
      fxnToBeExecuted();
    });
  }

  // Stop listening to an event
  public off(event: string): void {
    this.socket.off(event);
  }

  // Get the socket ID
  public getId(): string | undefined {
    return this.socket.id;
  }
}
