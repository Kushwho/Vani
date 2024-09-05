import { FC, useMemo, useRef, useState } from "react";

import ChatHistory, { ChatHistoryProps } from "@/Components/Recording/Chat";
import AudioRecorder, { RefProps } from "@/Components/Recording/AudioRecorder";
import FeedbackModal from "@/Components/Recording/FeebackModal";
import { useAxiosContext } from "@/Hooks/useAxiosContext";
import ApiResponse from "@/types/ApiResponse";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import useWindowDimensions from "@/Hooks/useWindowDimensions";

/**
 * The Record component is the entry point for the recording feature.
 * It renders the audio recorder, chat history and a button to end the session.
 * When the end session button is clicked, it opens a feedback modal.
 * Once the feedback form is submitted, it sends a POST request to the backend with the user's feedback.
 * If the request is successful, it displays a success toast and navigates the user back to the home page.
 * If the request fails, it displays an error toast.
 */

const Record: FC = () => {
  const [messages, setMessages] = useState<ChatHistoryProps>({ messages: [] });

  const ref = useRef<RefProps>(null);
  const axios = useAxiosContext();
  const navigate = useNavigate();
  const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false);

  const { dimensions } = useWindowDimensions();
  const isMobile = useMemo(() => dimensions.width < 768, [dimensions.width]);

  return (
    <main className=" flex flex-col items-center w-full">
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onSubmit={async (data) => {
          const toFed = { ...data, aiUnderstanding: data.personalisation };
          delete toFed.personalisation;
          const resp = await axios.post<ApiResponse<any>>(
            "https://backend.vanii.ai/auth/api/v1/user/post-review",
            toFed
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
      <div className="min-h-[480px] relative flex flex-col gap-6 justify-center items-center pb-16 max-w-6xl w-full">
        <button
          className={`${
            !isMobile ? "absolute top-6 right-0" : "mt-6"
          } max-xl:right-20 bg-red-600 text-gray-100 p-2 px-4 rounded-md `}
          onClick={() => {
            ref.current?.onClickEndSession();
            setFeedbackModalOpen(true);
          }}
        >
          End Session
        </button>
        <div className="relative max-md:p-8">
          <AudioRecorder
            setHistory={setMessages}
            history={messages}
            ref={ref}
          />
        </div>

        <h1 className="heading font-semibold text-xl">Vanii</h1>
        <h2 className="captions" id="captions"></h2>
      </div>
      <ChatHistory messages={messages.messages} />
    </main>
  );
};

export default Record;
