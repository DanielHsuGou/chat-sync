export async function addServerChannel(name) {
  try {
    const res = await fetch(`/api/serverChannels/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
      },
      body: JSON.stringify({ channelName: name, channelMsgs: [] }),
    });

    if (!res.ok) {
      throw new Error("Failed to add server channel");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error adding server channel: ", error);
  }
}
