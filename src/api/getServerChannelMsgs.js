export async function getServerChannelMsgs(id, offset = 0, limit = 20) {
  try {
    const res = await fetch(
      `/api/serverChannels/${id}/msgs?offset=${offset}&limit=${limit}`,
      {
        cache: "no-store",
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch server channel messages");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading server channel messages: ", error);
  }
}
