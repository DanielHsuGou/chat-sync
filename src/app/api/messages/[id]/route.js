import connectMongoDB from "../../../../../libs/mongodb";
import Messages from "../../../../../models/messages";
import { pusher } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

// GET request handler
export async function GET(req, { params }) {
  const { id } = params;
  await connectMongoDB();
  const messages = await Messages.findOne({ _id: id });
  return new Response(JSON.stringify({ messages }), { status: 200 });
}

// PUT request handler
export async function PUT(req, { params }) {
  const { id } = params;
  const { newMessage, deleteUnreadFor } = await req.json();

  await connectMongoDB();

  const messages = await Messages.findById(id);

  // Add the new message to the msgs array
  if (newMessage) {
    messages.msgs.push({
      msgFrom: newMessage.msgFrom,
      msgIcon: newMessage.msgIcon,
      msgTime: newMessage.msgTime,
      msgText: newMessage.msgText,
      msgAttach: newMessage.msgAttach,
      msgUnread: newMessage.msgUnread,
      userId: newMessage.userId,
    });

    try {
      await pusher.trigger(
        toPusherKey(`dm:${id}:incoming_dm_msgs`),
        "incoming_dm_msgs",
        newMessage
      );
      console.log("Pusher event triggered successfully");
    } catch (error) {
      console.error("Error triggering Pusher event:", error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  // Delete unread messages for the specified users
  if (deleteUnreadFor) {
    messages.msgs.forEach((msg) => {
      msg.msgUnread = msg.msgUnread.filter(
        (user) => !deleteUnreadFor.includes(user)
      );
    });
  }

  await messages.save();

  return new Response(JSON.stringify({ message: "Messages Updated" }), {
    status: 200,
  });
}

// Items could be put
// 1. add new message
// 2. delete unread users
// {
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
