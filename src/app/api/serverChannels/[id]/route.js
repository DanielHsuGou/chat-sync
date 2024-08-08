import connectMongoDB from "../../../../../libs/mongodb";
import ServerChannel from "../../../../../models/serverChannel";
import { pusher } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

// GET request handler
export async function GET(req, { params }) {
  const { id } = params;
  await connectMongoDB();
  const serverChannel = await ServerChannel.findOne({ _id: id });
  return new Response(JSON.stringify({ serverChannel }), { status: 200 });
}

// PUT request handler
export async function PUT(req, { params }) {
  const { id } = params;
  const { newChannelName, newMessage, deleteUnreadFor } = await req.json();

  await connectMongoDB();

  const serverChannel = await ServerChannel.findById(id);

  // Update the channelName if provided
  if (newChannelName) {
    serverChannel.channelName = newChannelName;
  }

  // Add the new message to the channelMsgs array
  let addedMessage = null;
  if (newMessage) {
    addedMessage = {
      msgFrom: newMessage.msgFrom,
      msgIcon: newMessage.msgIcon,
      msgTime: newMessage.msgTime,
      msgText: newMessage.msgText,
      msgAttach: newMessage.msgAttach,
      msgUnread: newMessage.msgUnread,
      userId: newMessage.userId,
    };

    await pusher.trigger(
      toPusherKey(`channel:${id}:incoming_channel_msgs`),
      "incoming_channel_msgs",
      newMessage
    );

    serverChannel.channelMsgs.push(addedMessage);
    await serverChannel.save();
    addedMessage._id =
      serverChannel.channelMsgs[serverChannel.channelMsgs.length - 1]._id;
  }

  // Delete unread messages for the specified users
  // console.log("deleteUnreadFor", deleteUnreadFor);
  // console.log("serverChannel.channelMsgs", serverChannel.channelMsgs);
  if (deleteUnreadFor) {
    serverChannel.channelMsgs.forEach((msg) => {
      msg.msgUnread = msg.msgUnread.filter(
        (user) => !deleteUnreadFor.includes(user)
      );
    });
  }

  await serverChannel.save();

  return new Response(JSON.stringify(addedMessage), {
    status: 200,
  });
}

// Items could be put
// 1. channelName
// 2. add new message
// 3. delete unread users
// {
//     "newChannelName": "General Chat",
//     "newMessage": {
//       "msgFrom": "User4",
//       "msgIcon": "https://example.com/user4.png",
//       "msgTime": "2023-07-29T12:00:00Z",
//       "msgText": "Hey, what's up?",
//       "msgUnread": ["User1", "User2", "User3"]
//     }
//     "deleteUnreadFor": ["User1", "User2"]
// }

// Example in frontend
// body: JSON.stringify({
//     deleteUnreadFor: ["User1", "User2"],
// })
