export async function getMessages() {
  try {
    const res = await fetch("/api/messages", {
      cache: "no-store",
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch messages");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading messages: ", error);
  }
}
