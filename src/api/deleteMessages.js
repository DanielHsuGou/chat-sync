export async function deleteMessages(id) {
  try {
    const res = await fetch(`/api/messages?id=${id}`, {
      method: "DELETE",
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete messages");
    }
  } catch (error) {
    console.log("Error deleting messages: ", error);
  }
}
