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
    maxHttpBufferSize: 1e8,
    // @ts-ignore
    addTrailingSlash: false,
  });

  io.on("connection", (socket) => {
    const roomId: string = socket.handshake.query?.roomId as string;
    const clientId = socket.id;
    console.log(`Room: ${roomId} => client connected. ID: ${clientId}`);
    socket.broadcast.emit(`joined:${roomId}}`, clientId);

    socket.on(roomId, (textMessage) => {
      console.log(`Room: ${roomId} => Client ${socket.id} said:`, textMessage);
      io.emit(roomId, textMessage);
    });

    socket.on(`${roomId}:audioStream`, (audioBuffer) => {
      console.log(
        `Room: ${roomId} => Client ${socket.id} sent an audio clip:`,
        audioBuffer
      );
      io.emit(`${roomId}:audioStream`, audioBuffer);
    });

    socket.on(`${roomId}:img`, (imageBuffer) => {
      console.log(
        `Room: ${roomId} => Client ${socket.id} sent an image:`,
        imageBuffer
      );
      io.emit(`${roomId}:img`, imageBuffer);
    });

    socket.on("disconnect", () => {
      console.log(`client ${socket.id} disconnected.`);
      socket.broadcast.emit(`left:${roomId}`, socket.id);
    });
  });

  (global as any).io = io;
  res.socket.server.io = io;

  res.end();
};

export default ioHandler;
