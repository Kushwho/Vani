import { FC, useState } from "react";
import { useSocketConnect } from "@/Hooks/useSocketConnect";
import { useSocketUpdate } from "@/Hooks/useSocketUpdate";

import RecordBtn from "@/Components/Recording/RecordButton";
import ChatHistory, {
  ChatHistoryProps,
  Message,
} from "@/Components/Recording/Chat";
import AudioRecorder from "@/Components/Recording/AudioRecorder";

const Record: FC = () => {
  const { isConnected } = useSocketConnect();
  const [messages, setMessages] = useState<ChatHistoryProps>({ messages: [] });

  return (
    <main className="">
      <div className="h-screen relative flex flex-col gap-8 justify-center items-center pb-16">
        <div className="relative">
          <AudioRecorder setHistory= {setMessages} history={messages}/>
        </div>

        <h1 className="heading">Captions by Vanii</h1>
        <h2 className="captions" id="captions"></h2>
      </div>
      <ChatHistory messages={messages.messages} />
    </main>
  );
};

export default Record;
