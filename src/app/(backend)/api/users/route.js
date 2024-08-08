import { getToken } from "next-auth/jwt";
import User from "models/user";
import server from "libs/mongodb/server";
import { NextResponse } from "next/server";

export async function GET(req) {
  console.log("Connecting to the database...");
  await server(); // Ensure the database connection is established
  console.log("Database connected.");

  console.log("Getting token...");
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  console.log("Token:", token);
  try {
    if (!token) {
      console.log("No token found.");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Extract the user ID from the token
    const currentUserId = token.sub; // Adjust this based on your token structure
    console.log("Current User ID:", currentUserId);

    console.log("Finding users...");
    // Find all users except the current user
    const users = await User.find({ _id: { $ne: currentUserId } });
    console.log("Users:", users);

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}
