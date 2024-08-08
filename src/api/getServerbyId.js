export async function getServerById(id) {
  try {
    const res = await fetch(`/api/servers/${id}`, {
      cache: "no-store",
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch server");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading server: ", error);
  }
}
