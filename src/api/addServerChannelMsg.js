export async function addServerChannelMsg(id, msg) {
  try {
    const res = await fetch(`/api/serverChannels/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
      },
      body: JSON.stringify({ newMessage: msg }),
    });

    if (!res.ok) {
      throw new Error("Failed to add message to server channel");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error adding message to server channel: ", error);
  }
}
