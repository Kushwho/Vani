"use client"

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RoomWrapper from "../shared/RoomInteractions/roomWrapper";
import { LiveKitMetadata } from "@/types/livekit";
import { GetSessionById } from "@/lib/apis/sessions/session-apis";
import useAxiosContext from "@/hooks/custom/useAxiosContext";
import useAuthContext from "@/hooks/custom/useAuthContext";
import { toast } from "@/hooks/use-toast";

// Force dynamic rendering to avoid SSR issues with useSearchParams
export const dynamic = 'force-dynamic';

const LearnSubjectContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const axios = useAxiosContext();
  const auth = useAuthContext();
  const [storedData, setStoredData] = useState<LiveKitMetadata | null>(null);

  const previousSessionId = searchParams.get('previousSessionId');

  useEffect(() => {
    if (previousSessionId) {
      // For continuing completed class sessions, get metadata from previous session
      GetSessionById({
        axios,
        sessionId: previousSessionId,
        onSuccess: (response) => {
          const session = response.data;
          if (session.sessionType === 'class' && session.standard && session.subject && session.chapter) {
            const classData: LiveKitMetadata = {
              userId: auth.config.id,
              standard: session.standard,
              subject: session.subject,
              chapter: session.chapter
            };
            setStoredData(classData);
            toast({
              title: "Previous Session Context Loaded",
              description: `Continuing ${session.subject} - ${session.chapter} from previous session`,
            });
          } else {
            toast({
              title: "Error",
              description: "Invalid class session data. Redirecting to home.",
              variant: "destructive",
            });
            router.replace("/");
          }
        },
        onError: (error) => {
          console.error('Error loading previous session:', error);
          toast({
            title: "Error",
            description: "Failed to load previous session data.",
            variant: "destructive",
          });
          router.replace("/");
        },
      });
    } else {
      // For new class sessions, get data from sessionStorage
      const rawData = sessionStorage.getItem("learnSubjectData");
      if (!rawData) {
        router.replace("/");
        return;
      }

      try {
        const parsedData = JSON.parse(rawData);
        setStoredData(parsedData);
      } catch (error) {
        console.error("Error parsing sessionStorage data:", error);
        router.replace("/");
      }
    }
  }, [router, previousSessionId, axios, auth.config.id]);

  return storedData ? (
    <RoomWrapper showChat={true} studyRoom={true} data={storedData} />
  ) : null;
};

const Page: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LearnSubjectContent />
    </Suspense>
  );
};

export default Page;
