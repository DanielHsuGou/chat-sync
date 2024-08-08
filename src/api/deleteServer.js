export async function deleteServer(id) {
  try {
    const res = await fetch(`/api/servers?id=${id}`, {
      method: "DELETE",
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete server");
    }
  } catch (error) {
    console.log("Error deleting server: ", error);
  }
}
