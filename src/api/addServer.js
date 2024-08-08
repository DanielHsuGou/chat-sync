export async function addServer(newServer) {
  try {
    const res = await fetch(`/api/servers/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
      },
      body: JSON.stringify(newServer),
    });

    if (!res.ok) {
      throw new Error("Failed to add server channel");
    }

    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("Error adding server channel: ", error);
  }
}
