'use client';

import RoomWrapper from "../shared/RoomInteractions/roomWrapper";
import { Suspense } from "react";

const Page: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RoomWrapper showChat={true} />
    </Suspense>
  );
};

export default Page;
