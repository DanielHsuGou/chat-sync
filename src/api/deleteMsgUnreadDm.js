const deleteMsgUnreadDm = async (messageId, userIds) => {
  try {
    const res = await fetch(`/api/messages/${messageId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
      },
      body: JSON.stringify({ deleteUnreadFor: userIds }),
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();
    return data; // Ensure the API returns the correct format
  } catch (error) {
    console.error("Error deleting unread messages:", error);
    return { success: false }; // Return a default value on error
  }
};

export default deleteMsgUnreadDm;
