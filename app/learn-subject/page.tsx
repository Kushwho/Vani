"use client"


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RoomWrapper from "../shared/RoomInteractions/roomWrapper";
import { LiveKitMetadata } from "@/types/livekit";




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
      setStoredData(parsedData);
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
