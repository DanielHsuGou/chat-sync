import connectMongoDB from "../../../../../libs/mongodb";
import Server from "../../../../../models/server";

// GET request handler
export async function GET(req, { params }) {
  const { id } = params;
  await connectMongoDB();
  const server = await Server.findOne({ _id: id });
  return new Response(JSON.stringify({ server }), { status: 200 });
}

// PUT request handler
export async function PUT(req, { params }) {
  const { id } = params;
  const {
    newServerName: serverName,
    newServerCategory: serverCategory,
    newServerIcon: serverIcon,
    newMembers: members,
    newOnlineMembers: onlineMembers,
    newServerChannels: serverChannels,
  } = await req.json();

  await connectMongoDB();
  await Server.findByIdAndUpdate(id, {
    serverName,
    serverCategory,
    serverIcon,
    members,
    onlineMembers,
    serverChannels,
  });

  return new Response(JSON.stringify({ message: "Server Updated" }), {
    status: 200,
  });
}

// PATCH request handler
export async function PATCH(req, { params }) {
  const { id } = params;
  const { memberId, channelId, action } = await req.json();

  if (!memberId && !channelId) {
    return new Response(
      JSON.stringify({
        message: "Member ID or Channel ID is required",
        success: false,
      }),
      {
        status: 400,
      }
    );
  }

  await connectMongoDB();
  const server = await Server.findById(id);

  if (!server) {
    return new Response(
      JSON.stringify({ message: "Server not found", success: false }),
      {
        status: 404,
      }
    );
  }

  let updated = false;

  if (action === "remove") {
    if (memberId && server.members.includes(memberId)) {
      server.members = server.members.filter((member) => member !== memberId);
      updated = true;
    }
    if (channelId && server.serverChannels.includes(channelId)) {
      server.serverChannels = server.serverChannels.filter(
        (channel) => channel !== channelId
      );
      updated = true;
    }
  } else {
    if (memberId && !server.members.includes(memberId)) {
      server.members.push(memberId);
      updated = true;
    }

    if (channelId && !server.serverChannels.includes(channelId)) {
      server.serverChannels.push(channelId);
      updated = true;
    }
  }

  if (updated) {
    await server.save();
    return new Response(JSON.stringify({ message: "Server updated", server }), {
      status: 200,
    });
  }

  return new Response(
    JSON.stringify({ message: "No updates made", success: false }),
    {
      status: 200,
    }
  );
}
