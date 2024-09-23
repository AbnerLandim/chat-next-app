/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO } from "socket.io-client";

import useSessionStorage from "@/hooks/useSessionStorage";

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
  const [socket, setSocket] = useState<any>(null);
  const [room, setRoom] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const { setValue } = useSessionStorage();

  useEffect(() => {
    const socketInstance = new (ClientIO as any)(
      process.env.NEXT_PUBLIC_SITE_URL!,
      {
        path: "/api/socket/io",
        addTrailingSlash: false,
        query: {
          roomId: room,
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

    socketInstance.on("message", (data: any) => {
      setValue(Date.now().toString(), data);
      window.dispatchEvent(new Event("sessionStorage"));
    });

    socketInstance.on("joined", (clientId: string) => {
      if (socket?.id !== clientId) alert(`${clientId} joined`);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from socketInstance server");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, room, setRoom }}>
      {children}
    </SocketContext.Provider>
  );
};
