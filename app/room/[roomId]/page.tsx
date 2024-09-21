"use client";
// import { useEffect, useState } from "react";

import { useSocket } from "@/components/providers/socket-provider";

function Room({ params }: { params: { roomId: string } }) {
  const { isConnected, socket } = useSocket();

  function handleSocketConnect() {
    console.log(`bla bla from ${socket.id}`);
    socket.emit("message", `bla bla from ${socket.id}`);
  }

  return (
    <div>
      <button className="border-2" onClick={handleSocketConnect}>
        Send socket message
      </button>
      <div>Room Id: {params.roomId}</div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      {/* <p>Transport: {transport}</p> */}
    </div>
  );
}

export default Room;
