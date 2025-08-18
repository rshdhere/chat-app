import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
}

// eslint-disable-next-line
let allSockets: User[] = [];

wss.on("connection", (socket) => {







    
  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message.toString());

    if (parsedMessage.type === "join") {
      allSockets.push({
        socket,
        room: parsedMessage.payload.roomId,
      });
    }

    if (parsedMessage.type === "chat") {
      const currentUserRoom = allSockets.find(
        (user) => user.socket === socket,
      )?.room;

      allSockets.forEach((user) => {
        if (user.room === currentUserRoom) {
          user.socket.send(
            JSON.stringify({
              type: "chat",
              payload: {
                message: parsedMessage.payload.message,
              },
            }),
          );
        }
      });
    }
  });
});
