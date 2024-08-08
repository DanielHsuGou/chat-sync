export async function getServerChannelById(id) {
  try {
    const res = await fetch(`/api/serverChannels/${id}`, {
      cache: "no-store",
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch server channels");
    }

    const data = await res.json();
    // console.log(data.serverChannel);
    return data.serverChannel;
  } catch (error) {
    console.log("Error loading server channels: ", error);
  }
}
