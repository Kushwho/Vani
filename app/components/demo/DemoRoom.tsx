import RoomWrapper from '@/app/shared/RoomInteractions/roomWrapper';

import { useToast } from '@/hooks/use-toast';
import { Room } from 'livekit-client';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { useTimerStore } from './TimerStore';

type DemoRoomProps = object;

const DemoRoom: React.FC<DemoRoomProps> = () => {

   const {isVisible} = useTimerStore()
   


  return (
    <>
       {isVisible && <RoomWrapper showChat= {false}/>}
    </>
  );
};

export default DemoRoom;