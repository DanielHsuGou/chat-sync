export async function getServers() {
  try {
    const res = await fetch("/api/servers", {
      cache: "no-store",
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch servers");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading servers: ", error);
  }
}
