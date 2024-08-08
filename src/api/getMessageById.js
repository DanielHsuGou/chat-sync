export async function getMessageById(id) {
  try {
    const res = await fetch(`/api/messages/${id}`, {
      cache: "no-store",
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch messages");
    }

    const data = await res.json();
    // console.log(data.serverChannel);
    return data.messages;
  } catch (error) {
    console.log("Error loading messages: ", error);
  }
}
