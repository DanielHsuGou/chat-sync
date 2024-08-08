export async function getServerChannels() {
  try {
    const res = await fetch("/api/serverChannels", {
      cache: "no-store",
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch server channels");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading server channels: ", error);
  }
}
