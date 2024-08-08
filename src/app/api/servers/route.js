// src/app/api/servers/route.js
import connectMongoDB from "../../../../libs/mongodb";
import Server from "../../../../models/server";

// GET request handler
export async function GET() {
  await connectMongoDB();
  const servers = await Server.find();
  return new Response(JSON.stringify({ servers }), { status: 200 });
}

// POST request handler
export async function POST(req) {
  const {
    serverName,
    serverCategory,
    // serverAdmin,
    serverIcon,
    // serverPrivacy,
    members,
    onlineMembers,
    serverChannels,
  } = await req.json();

  await connectMongoDB();
  const newServer = await Server.create({
    serverName,
    serverCategory,
    // serverAdmin,
    serverIcon,
    // serverPrivacy,
    members,
    onlineMembers,
    serverChannels,
  });

  return new Response(
    JSON.stringify({ _id: newServer._id, ...newServer.toObject() }),
    {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

// DELETE request handler
export async function DELETE(req) {
  const id = req.nextUrl.searchParams.get("id");
  await connectMongoDB();
  await Server.findByIdAndDelete(id);
  return new Response(JSON.stringify({ message: "Server Deleted" }), {
    status: 200,
  });
}
