import User from "models/user"; // Adjust the import path as necessary
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt"; // Import getToken from NextAuth
import { NextResponse } from "next/server";

export async function POST(req) {
  const token = await getToken({ req }); // Get the token from the request
  console.log("Token:", token); // Log the token to inspect its structure

  if (!token || !token.sub) {
    return new NextResponse("Unauthorized", { status: 401 }); // Return 401 if not authenticated
  }

  const { friendId } = await req.json(); // Only friendId is expected
  console.log("Friend ID:", friendId); // Log the friendId

  if (!friendId) {
    return new NextResponse("Friend ID is required", { status: 400 });
  }

  const userId = token.sub; // Use the user ID from the token
  console.log("User ID:", userId); // Log the userId

  try {
    await mongoose.connect(process.env.MONGODB_URI); // Ensure you have your MongoDB URI set

    const user = await User.findById(userId);
    console.log("User found:", user); // Log the user object

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const friend = await User.findById(friendId);
    console.log("Friend found:", friend); // Log the friend object

    if (!friend) {
      return new NextResponse("Friend not found", { status: 404 });
    }

    // Remove friendId from the user's pendingFriends
    if (user.pendingFriends.includes(friendId)) {
      user.pendingFriends = user.pendingFriends.filter((id) => id !== friendId); // Correctly remove the userId
      await user.save();
    } else {
      return new NextResponse("Friend request already removed!", {
        status: 400,
      });
    }

    return new NextResponse("Friend request removed successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("Error removing friend:", error.message);
    console.error(error.stack);
    return new NextResponse("Error removing friend", { status: 500 });
  } finally {
    await mongoose.disconnect();
  }
}
