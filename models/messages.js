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

const messagesSchema = new Schema(
  {
    userIds: [String],
    msgs: [messageSchema], // Array of msgs
  },
  {
    timestamps: true,
  }
);

const Messages =
  mongoose.models.Messages || mongoose.model("Messages", messagesSchema);

export default Messages;
