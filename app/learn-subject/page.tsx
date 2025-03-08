"use client"


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RoomWrapper from "../shared/RoomInteractions/roomWrapper";
import { LiveKitMetadata } from "@/types/livekit";


const isLiveKitMetadata = (data: any): data is LiveKitMetadata => {
  return (
    data &&
    typeof data === "object" &&
    typeof data.standard === "number" &&
    typeof data.subject === "string" &&
    typeof data.chapter === "string"
  );
};

const Page: React.FC = () => {
  const router = useRouter();
  const [storedData, setStoredData] = useState<LiveKitMetadata | null>(null);

  useEffect(() => {
    const rawData = sessionStorage.getItem("learnSubjectData");
    if (!rawData) {
      router.replace("/");
      return;
    }

    try {
      const parsedData = JSON.parse(rawData);
      if (isLiveKitMetadata(parsedData)) {
        setStoredData(parsedData);
      } else {
        console.error("Invalid LiveKitMetadata format:", parsedData);
        router.replace("/");
      }
    } catch (error) {
      console.error("Error parsing sessionStorage data:", error);
      router.replace("/");
    }
  }, [router]);

  return storedData ? (
    <RoomWrapper showChat={true} studyRoom={true} data={storedData} />
  ) : null;
};

export default Page;
