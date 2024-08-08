export async function addMessages(userId1, userId2) {
  try {
    const res = await fetch(`/api/messages/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
      },
      body: JSON.stringify({ userIds: [userId1, userId2], msgs: [] }),
    });

    if (!res.ok) {
      throw new Error("Failed to add messages");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error adding messages: ", error);
  }
}
