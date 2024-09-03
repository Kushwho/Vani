import { FC, useRef, useState } from "react";

import ChatHistory, { ChatHistoryProps } from "@/Components/Recording/Chat";
import AudioRecorder, { RefProps } from "@/Components/Recording/AudioRecorder";
import FeedbackModal from "@/Components/Recording/FeebackModal";
import { useAxiosContext } from "@/Hooks/useAxiosContext";
import ApiResponse from "@/types/ApiResponse";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const Record: FC = () => {
  const [messages, setMessages] = useState<ChatHistoryProps>({ messages: [] });

  const ref = useRef<RefProps>(null);
  const axios = useAxiosContext();
  const navigate = useNavigate();
  const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false);

  return (
    <main className="">
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onSubmit={async () => {
          const resp = await axios.post<ApiResponse<any>>(
            "https://backend.vanii.ai/auth/api/v1/user/post-review"
          );
          console.log(resp);

          if (resp.data.success) {
            ref.current?.onClickEndSession();
            toast("Thanks for using");
            setTimeout(() => {
              navigate("");
            });
          } else {
            toast("Error Sending response");
          }
        }}
      />
      <div className="min-h-[480px] relative flex flex-col gap-14 justify-center items-center pb-16 max-w-7xl">
        <div className="relative max-md:p-8">
          <AudioRecorder
            setHistory={setMessages}
            history={messages}
            ref={ref}
          />
        </div>

        <h1 className="heading font-semibold text-xl">Vanii</h1>
        <h2 className="captions" id="captions"></h2>
        <button
          className="absolute top-6 right-0 max-xl:right-20 bg-red-600 text-gray-100 p-2 px-4 rounded-md "
          onClick={() => {
            ref.current?.onClickEndSession();
            setFeedbackModalOpen(true);
          }}
        >
          End Session
        </button>
      </div>
      <ChatHistory messages={messages.messages} />
    </main>
  );
};

export default Record;
