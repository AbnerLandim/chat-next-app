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
    const clientId = socket.id;
    console.log(`client connected. ID: ${clientId}`);

    socket.on("message", (data) => {
      console.log(`Received message From Client ${socket.id}:`, data);
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
