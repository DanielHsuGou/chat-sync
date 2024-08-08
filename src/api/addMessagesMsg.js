export async function addMessagesMsg(id, msg) {
  try {
    const res = await fetch(`/api/messages/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
      },
      body: JSON.stringify({ newMessage: msg }),
    });

    if (!res.ok) {
      throw new Error("Failed to add message to messages");
    }

    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("Error adding message to messages: ", error);
  }
}
