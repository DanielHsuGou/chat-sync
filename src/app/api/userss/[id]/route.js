import connectMongoDB from "libs/mongodb";
import User from "../../../../../models/user";

// GET request handler
export async function GET(req, { params }) {
  const { id } = params;
  await connectMongoDB();
  const user = await User.findOne({ _id: id });
  return new Response(JSON.stringify({ user }), { status: 200 });
}

// PATCH request handler for adding or removing a server to/from a user's joinedServerList
export async function PATCH(req, { params }) {
  const { id } = params; // userId
  const { serverId, removeServerId, messageId, removeMessageId } =
    await req.json();

  await connectMongoDB();
  const user = await User.findById(id);

  if (!user) {
    return new Response(
      JSON.stringify({ message: "User not found", success: false }),
      {
        status: 404,
      }
    );
  }

  // Handle adding a server
  if (serverId) {
    if (!user.joinedServerList.includes(serverId)) {
      user.joinedServerList.push(serverId);
      await user.save();
      return new Response(
        JSON.stringify({
          message: "Server added to user's joined list",
          success: true,
        }),
        {
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          message: "Server already in user's joined list",
          success: false,
        }),
        {
          status: 200,
        }
      );
    }
  }

  // Handle removing a server
  if (removeServerId) {
    if (user.joinedServerList.includes(removeServerId)) {
      user.joinedServerList = user.joinedServerList.filter(
        (id) => id !== removeServerId
      );
      await user.save();
      return new Response(
        JSON.stringify({
          message: "Server removed from user's joined list",
          success: true,
        }),
        {
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          message: "Server not found in user's joined list",
          success: false,
        }),
        {
          status: 200,
        }
      );
    }
  }

  // Handle adding a message
  if (messageId) {
    if (!user.messages.includes(messageId)) {
      user.messages.push(messageId);
      await user.save();
      return new Response(
        JSON.stringify({
          message: "Message added to user's messages",
          success: true,
        }),
        {
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          message: "Message already in user's messages",
          success: false,
        }),
        {
          status: 200,
        }
      );
    }
  }

  // Handle removing a message
  if (removeMessageId) {
    if (user.messages.includes(removeMessageId)) {
      user.messages = user.messages.filter((id) => id !== removeMessageId);
      await user.save();
      return new Response(
        JSON.stringify({
          message: "Message removed from user's messages",
          success: true,
        }),
        {
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          message: "Message not found in user's messages",
          success: false,
        }),
        {
          status: 200,
        }
      );
    }
  }

  return new Response(
    JSON.stringify({
      message:
        "Server ID, removeServerId, messageId, or removeMessageId is required",
      success: false,
    }),
    {
      status: 400,
    }
  );
}
