const deleteServerChannelfromServer = async (serverId, channelId) => {
  try {
    const res = await fetch(`/api/servers/${serverId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
      },
      body: JSON.stringify({ channelId, action: "remove" }),
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();
    return data; // Ensure the API returns the correct format
  } catch (error) {
    console.error("Error deleting server channel:", error);
    return { success: false }; // Return a default value on error
  }
};

export default deleteServerChannelfromServer;
