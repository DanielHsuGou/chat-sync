import connectMongoDB from "../../../../../../libs/mongodb";
import ServerChannel from "../../../../../../models/serverChannel";

// GET request handler for all msgs in specific serverChannel
export async function GET(req, { params }) {
  const { id } = params;
  const { searchParams } = new URL(req.url);
  const offset = parseInt(searchParams.get("offset")) || 0;
  const limit = parseInt(searchParams.get("limit")) || 8;

  await connectMongoDB();
  const serverChannel = await ServerChannel.findById(id);

  if (!serverChannel) {
    return new Response(JSON.stringify({ error: "ServerChannel not found" }), {
      status: 404,
    });
  }

  const msg = serverChannel.channelMsgs;
  if (msg.length - offset >= 0) {
    const msgs = msg.slice(
      msg.length - offset - limit < 0 ? 0 : msg.length - offset - limit,
      msg.length - offset
    );
    return new Response(JSON.stringify({ msgs: msgs.reverse() }), {
      status: 200,
    });
  }
  return new Response(JSON.stringify({ msgs: [] }), { status: 200 });
}
