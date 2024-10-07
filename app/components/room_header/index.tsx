import React from "react";

import { useSocket } from "@/providers/socket-provider";

type RoomHeaderProps = {
  roomId: string;
};
function RoomHeader({ roomId }: RoomHeaderProps) {
  const { isConnected } = useSocket();
  return (
    <section className="bg-gray-600/20 rounded-lg mb-1 p-2">
      <h2 className="text-xl pb-1 font-mono text-gray-800">{roomId}</h2>
      <div className="flex align-center justify-start gap-2">
        <div
          className={`rounded-lg ${
            isConnected ? "bg-emerald-400/50" : "bg-rose-400/50"
          }  ${
            isConnected ? "text-emerald-700" : "text-red-700"
          }  py-0.5 px-1 my-auto`}
        >
          <span className="text-sm font-semibold font-mono">
            {isConnected ? "connected" : "disconnected"}
          </span>
        </div>
      </div>
    </section>
  );
}

export default RoomHeader;
