const { Server } = require("socket.io");

let io;

const initSocketServer = (server) => {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on("joinServer", ({ serverId }) => {
        socket.join(`server_${serverId}`);
        console.log(`User joined server room: server_${serverId}`);
      });

      socket.on("leaveServer", ({ serverId }) => {
        socket.leave(`server_${serverId}`);
        console.log(`User left server room: server_${serverId}`);
      });

      socket.on("joinChannel", ({ channelId }) => {
        socket.join(`channel_${channelId}`);
        console.log(`User joined channel room: channel_${channelId}`);
      });

      socket.on("leaveChannel", ({ channelId }) => {
        socket.leave(`channel_${channelId}`);
        console.log(`User left channel room: channel_${channelId}`);
      });

      socket.on("sendMessage", (message) => {
        const { channelId } = message;
        io.to(`channel_${channelId}`).emit("receiveMessage", message);
      });

      socket.on("sendServerMessage", (message) => {
        const { serverId, channelId } = message;
        io.to(`server_${serverId}`).emit("receiveServerMessage", {
          ...message,
          channelId,
        });
      });

      // New event: joinChat
      socket.on("joinMessage", ({ messageId }) => {
        socket.join(`message_${messageId}`);
        console.log(`User joined message room: message_${messageId}`);
      });

      // New event: leaveMessage
      socket.on("leaveMessage", ({ messageId }) => {
        socket.leave(`message_${messageId}`);
        console.log(`User left message room: message_${messageId}`);
      });
      // New event: sendUserMessage
      socket.on("sendUserMessage", (message) => {
        const { messageId, otherUserId } = message;
        io.to(`message_${messageId}`).emit("receiveUserMessage", {
          ...message,
          otherUserId,
        });
      });

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }
  return io;
};

module.exports = initSocketServer;
