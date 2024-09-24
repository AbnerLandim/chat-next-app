/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIo } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const path = "/api/socket/io";
  const httpServer: NetServer = res.socket.server as any;
  const io = new ServerIO(httpServer, {
    path,
    // @ts-ignore
    addTrailingSlash: false,
  });

  io.on("connection", (socket) => {
    const roomId: string = socket.handshake.query?.roomId as string;
    const clientId = socket.id;
    console.log(`Room: ${roomId} => client connected. ID: ${clientId}`);
    socket.broadcast.emit(`joined:${roomId}}`, clientId);

    socket.on("message", (data) => {
      console.log(`Room: message => Client ${socket.id} said:`, data);
      io.emit("message", data);
    });

    socket.on(roomId, (data) => {
      console.log(`Room: ${roomId} => Client ${socket.id} said:`, data);
      io.emit(roomId, data);
    });

    socket.on("disconnect", () => {
      console.log("client disconnected.");
    });
  });

  (global as any).io = io;
  res.socket.server.io = io;

  res.end();
};

export default ioHandler;
