import server from "../../../../../libs/mongodb/server";
import User from "../../../../../models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { displayName, email, password, icon } = await request.json();
    console.log("Received data:", { displayName, email, password, icon });

    await server();
    console.log("Connected to the database");

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
      console.log("Hashed password:", hashedPassword);
    }

    const newUser = await User.create({
      displayName,
      email,
      password: hashedPassword,
      icon,
    });
    console.log("User created:", newUser);

    return NextResponse.json(
      { message: "User registration successful!" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error during registration:", err);
    return NextResponse.json(
      { message: `Error: ${err.message}` },
      { status: 500 }
    );
  }
}
