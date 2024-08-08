const addMessagesId = async (userId, messageId) => {
  try {
    const res = await fetch(`/api/userss/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
      },
      body: JSON.stringify({ messageId: messageId }),
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();
    console.log("Response data:", data); // Log the response to see its structure
    return data; // Ensure the API returns the correct format
  } catch (error) {
    console.error("Error adding message to user's messages:", error);
    return { success: false }; // Return a default value on error
  }
};

export default addMessagesId;
