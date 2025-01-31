import RoomWrapper from '@/app/shared/RoomInteractions/roomWrapper';

import React from 'react';
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