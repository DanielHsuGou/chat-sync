import connectMongoDB from "../../../../../../libs/mongodb";
import Messages from "../../../../../../models/messages";

// GET request handler for all msgs in specific messages
export async function GET(req, { params }) {
  const { id } = params;
  const { searchParams } = new URL(req.url);
  const offset = parseInt(searchParams.get("offset")) || 0;
  const limit = parseInt(searchParams.get("limit")) || 8;

  await connectMongoDB();
  const messages = await Messages.findById(id);

  if (!messages) {
    return new Response(JSON.stringify({ error: "Messages not found" }), {
      status: 404,
    });
  }

  const msg = messages.msgs;
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
