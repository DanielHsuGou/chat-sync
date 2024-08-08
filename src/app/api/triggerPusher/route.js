import { pusher } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function POST(req) {
  try {
    const { channelId, selectedServerId, message, triggerType, messageId } =
      await req.json(); // Include triggerType in the destructuring

    if (triggerType === "channel" && channelId) {
      const channelKey = toPusherKey(
        `channel:${channelId}:incoming_channel_msgs`
      );
      console.log("Triggering Pusher event for channel:", channelKey);
      await pusher.trigger(channelKey, "incoming_channel_msgs", message);
    } else if (triggerType === "server" && selectedServerId) {
      const serverKey = toPusherKey(
        `server:${selectedServerId}:incoming_channel_badges`
      );
      console.log("Triggering Pusher event for server:", serverKey);
      await pusher.trigger(serverKey, "incoming_channel_badges", {
        message,
        channelId,
        messageId,
      });
    } else if (triggerType === "dm" && messageId) {
      const dmKey = toPusherKey(`dm:${messageId}:incoming_dm_msgs`);
      console.log("Triggering Pusher event for DM:", dmKey);
      await pusher.trigger(dmKey, "incoming_dm_msgs", message);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in POST /api/triggerPusher:", error);
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
