import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
  msgFrom: String,
  msgIcon: String,
  msgTime: String,
  msgText: String,
  msgAttach: [String], // Array of urls
  msgUnread: [String], // Array of user IDs
  userId: String,
});

const serverChannelSchema = new Schema(
  {
    channelName: String,
    channelMsgs: [messageSchema], // Array of msgs
  },
  {
    timestamps: true,
  }
);

const ServerChannel =
  mongoose.models.ServerChannel ||
  mongoose.model("ServerChannel", serverChannelSchema);

export default ServerChannel;
