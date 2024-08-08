import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import User from "models/user";
import { NextResponse } from "next/server";

const MONGO_URI = process.env.MONGODB_URI;

async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    console.log("Connecting to the database...");
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected.");
  }
}

async function getUserFromToken(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) throw new Error("Unauthorized");
  return await User.findOne({ email: token.email });
}

export async function PUT(req) {
  try {
    await connectToDatabase();

    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { icon, displayName } = await req.json();

    if (icon) user.icon = icon;
    if (displayName) user.displayName = displayName;

    await user.save();

    return NextResponse.json(
      { message: "User updated successfully", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { message: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}
