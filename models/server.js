import mongoose, { Schema } from "mongoose";

const serverSchema = new Schema(
  {
    serverName: String,
    serverCategory: String,
    // serverAdmin: String,
    serverIcon: String,
    // serverPrivacy: String,
    members: [String],
    onlineMembers: [String],
    serverChannels: [String],
  },
  {
    timestamps: true,
  }
);

const Server = mongoose.models.Server || mongoose.model("Server", serverSchema);

export default Server;
