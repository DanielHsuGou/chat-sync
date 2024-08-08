import { getToken } from "next-auth/jwt";
import User from "models/user";
import server from "libs/mongodb/server";
import { NextResponse } from "next/server";

let isConnected = false;

async function connectToDatabase() {
  if (!isConnected) {
    console.log("Connecting to the database...");
    await server(); // Ensure the database connection is established
    isConnected = true; // Update connection status
    console.log("Database connected.");
  }
}

async function getUserFromToken(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) throw new Error("Unauthorized");
  return await User.findOne({ email: token.email });
}

export async function GET(req) {
  await connectToDatabase();

  const user = await getUserFromToken(req);
  try {
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { message: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}
