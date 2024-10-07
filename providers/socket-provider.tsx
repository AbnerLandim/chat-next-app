/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO } from "socket.io-client";

import useSessionStorage from "@/hooks/useSessionStorage";
import { JOINED_PREFIX, LEFT_PREFIX } from "@/app/constants";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
  room: string;
  setRoom: any;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  room: "default",
  setRoom: () => {},
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const getRoomId = () => {
    if (
      typeof window !== "undefined" &&
      window?.location?.pathname?.includes("/room/")
    )
      return window.location.pathname.replace("/room/", "");
    return "";
  };

  const [socket, setSocket] = useState<any>(null);
  const [room, setRoom] = useState(getRoomId());
  const [isConnected, setIsConnected] = useState(false);
  const { setValue } = useSessionStorage();

  function storeMessage(message: string) {
    setValue(Date.now().toString(), message);
    window.dispatchEvent(new Event("sessionStorage"));
  }

  useEffect(() => {
    setRoom(getRoomId());
  });

  useEffect(() => {
    const socketInstance = new (ClientIO as any)(
      process.env.NEXT_PUBLIC_SITE_URL!,
      {
        path: "/api/socket/io",
        addTrailingSlash: false,
        query: {
          roomId: room, //not used for the moment
        },
      }
    );

    socketInstance.on("connect_error", async (err: any) => {
      // the reason of the error, for example "xhr poll error"
      console.log(err.message);

      // some additional description, for example the status code of the initial HTTP response
      console.log(err.description);

      // some additional context, for example the XMLHttpRequest object
      console.log(err.context);

      await fetch("/api/socket/io");
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to socketInstance server");
    });

    socketInstance.on(room, (data: any) => {
      storeMessage(data);
    });

    socketInstance.on(`${room}:audioStream`, (audioData: Array<any>) => {
      const url = window.URL.createObjectURL(new Blob([audioData[0]]));
      storeMessage(`${audioData[1]}:audio:${url}`);
    });

    socketInstance.on(`${room}:img`, (data: Array<any>) => {
      const imgBlobUrl = window.URL.createObjectURL(new Blob([data[0]]));
      storeMessage(`${data[1]}:${imgBlobUrl}`);
    });

    socketInstance.on(`joined:${room}}`, (clientId: string) => {
      storeMessage(`${String(JOINED_PREFIX)}:${clientId}`);
    });

    socketInstance.on("disconnect", (clientId: string) => {
      console.log("🚀 ~ disconnecting clientId:", clientId);
      setIsConnected(false);
      storeMessage(`${String(LEFT_PREFIX)}:${clientId}`);
    });

    setSocket(socketInstance);

    return () => {
      // storeMessage(`${String(LEFT_PREFIX)}:${socketInstance.id}`);
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, room, setRoom }}>
      {children}
    </SocketContext.Provider>
  );
};
