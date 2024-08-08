import User from "models/user"; // Adjust the import path as necessary
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt"; // Import getToken from NextAuth
import { NextResponse } from "next/server";

let isConnected = false;

async function connectToDatabase() {
  if (!isConnected) {
    console.log("Connecting to the database...");
    await mongoose.connect(process.env.MONGODB_URI); // Ensure you have your MongoDB URI set
    isConnected = true; // Update connection status
    console.log("Database connected.");
  }
}

async function getUserFromToken(req) {
  const token = await getToken({ req }); // Get the token from the request
  if (!token || !token.sub) throw new Error("Unauthorized");
  return token.sub; // Return user ID from token
}

async function findUserById(userId) {
  return await User.findById(userId);
}

async function updateFriendship(user, friendId, userId) {
  if (user.allFriends.includes(friendId)) {
    throw new Error("This user is already your friend!");
  }

  if (user.pendingFriends.includes(friendId)) {
    user.pendingFriends = user.pendingFriends.filter((id) => id !== friendId); // Remove friendId from pendingFriends
    user.allFriends.push(friendId); // Add friendId to allFriends
    return user; // Return updated user
  } else {
    throw new Error("Friend Request already accepted!");
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();

    const userId = await getUserFromToken(req);
    const { friendId } = await req.json(); // Only friendId is expected

    if (!friendId) {
      return new NextResponse("Friend ID is required", { status: 400 });
    }

    const user = await findUserById(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const friend = await findUserById(friendId);
    if (!friend) {
      return new NextResponse("Friend not found", { status: 404 });
    }

    // Update friendship
    const updatedUser = await updateFriendship(user, friendId, userId);
    friend.allFriends.push(userId); // Add userId to friend's allFriends
    await updatedUser.save(); // Save the updated user
    await friend.save(); // Save the updated friend object

    return new NextResponse("Friend request accepted successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("Error adding friend:", error.message);
    return new NextResponse("Error adding friend", { status: 500 });
  }
}
