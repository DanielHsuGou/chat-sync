// src/app/api/servers/route.js
import connectMongoDB from "../../../../libs/mongodb";
import ServerChannel from "../../../../models/serverChannel";

// GET request handler
export async function GET() {
  await connectMongoDB();
  const serverChannels = await ServerChannel.find();
  return new Response(JSON.stringify({ serverChannels }), { status: 200 });
}

// POST request handler
export async function POST(req) {
  const { channelName, channelMsgs } = await req.json();

  await connectMongoDB();

  const newChannelMsgs = channelMsgs.map(
    ({ msgFrom, msgIcon, msgTime, msgText, msgAttach, msgUnread, userId }) => ({
      msgFrom,
      msgIcon,
      msgTime,
      msgText,
      msgAttach,
      msgUnread,
      userId,
    })
  );

  const newChannel = await ServerChannel.create({
    channelName,
    channelMsgs: newChannelMsgs,
  });

  return new Response(JSON.stringify(newChannel), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// DELETE request handler
export async function DELETE(req) {
  const id = req.nextUrl.searchParams.get("id");
  await connectMongoDB();
  await ServerChannel.findByIdAndDelete(id);
  return new Response(JSON.stringify({ message: "ServerChannel Deleted" }), {
    status: 200,
  });
}

// POST new channel example
// {
//     "channelName": "General Chat",
//     "channelMsgs": [
//       {
//         "msgFrom": "User1",
//         "msgIcon": "https://example.com/user1.png",
//         "msgTime": "2023-07-27T10:30:00Z",
//         "msgText": "Hello, everyone!",
//         "msgUnread": ["User2", "User3"]
//       },
//       {
//         "msgFrom": "User2",
//         "msgIcon": "https://example.com/user2.png",
//         "msgTime": "2023-07-27T10:35:00Z",
//         "msgText": "Hi there!",
//         "msgUnread": ["User1", "User3"]
//       },
//       {
//         "msgFrom": "User3",
//         "msgIcon": "https://example.com/user3.png",
//         "msgTime": "2023-07-27T10:40:00Z",
//         "msgText": "Great to see you all!",
//         "msgUnread": ["User1", "User2"]
//       }
//     ]
// }
