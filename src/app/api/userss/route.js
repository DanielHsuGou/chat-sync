// src/app/api/servers/route.js
import connectMongoDB from "../../../../libs/mongodb";
import User from "../../../../models/user";
import { getSession } from "next-auth/react";

// GET request handler
export async function GET() {
  await connectMongoDB();
  const session = await getSession();
  const user = await User.find();
  return new Response(JSON.stringify({ user }), { status: 200 });
}

// POST request handler
// export async function POST(req) {
//   const { userIds, msgs } = await req.json();

//   await connectMongoDB();

//   const newMsgs = msgs.map(
//     ({ msgFrom, msgIcon, msgTime, msgText, msgAttach, msgUnread }) => ({
//       msgFrom,
//       msgIcon,
//       msgTime,
//       msgText,
//       msgAttach,
//       msgUnread,
//     })
//   );

//   const newMessage = await Messages.create({
//     userIds,
//     msgs: newMsgs,
//   });

//   return new Response(JSON.stringify(newMessage), {
//     status: 201,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }

// // DELETE request handler
// export async function DELETE(req) {
//   const id = req.nextUrl.searchParams.get("id");
//   await connectMongoDB();
//   await Messages.findByIdAndDelete(id);
//   return new Response(JSON.stringify({ message: "Messages Deleted" }), {
//     status: 200,
//   });
// }

// POST new message example
// {
//     "userIds": ["id_1","id_2"],
//     "msgs": [
//       {
//         "msgFrom": "User1",
//         "msgIcon": "https://example.com/user1.png",
//         "msgTime": "2023-07-27T10:30:00Z",
//         "msgText": "Hello, everyone!",
//         "msgAttach": ["Attach1", "Attach2"],
//         "msgUnread": ["User2", "User3"]
//       },
//       {
//         "msgFrom": "User2",
//         "msgIcon": "https://example.com/user2.png",
//         "msgTime": "2023-07-27T10:35:00Z",
//         "msgText": "Hi there!",
//         "msgAttach": ["Attach1", "Attach2"],
//         "msgUnread": ["User1", "User3"]
//       },
//       {
//         "msgFrom": "User1",
//         "msgIcon": "https://example.com/user1.png",
//         "msgTime": "2023-07-27T10:40:00Z",
//         "msgText": "Great to see you all!",
//         "msgAttach": ["Attach1", "Attach2"],
//         "msgUnread": ["User1", "User2"]
//       }
//     ]
// }
