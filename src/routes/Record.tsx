import { FC, useState } from "react";

import ChatHistory, {
  ChatHistoryProps
} from "@/Components/Recording/Chat";
import AudioRecorder from "@/Components/Recording/AudioRecorder";

const Record: FC = () => {
  const [messages, setMessages] = useState<ChatHistoryProps>({ messages: [] });

  return (
    <main className="max-md:p-8">
      <div className="min-h-[480px] relative flex flex-col gap-16 justify-center items-center pb-16 ">
        <div className="relative">
          <AudioRecorder setHistory={setMessages} history={messages} />
        </div>

        <h1 className="heading font-semibold text-xl">Vanii</h1>
        <h2 className="captions" id="captions"></h2>
      </div>
      <ChatHistory messages={messages.messages} />
    </main>
  );
};

export default Record;
