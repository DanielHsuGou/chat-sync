import server from "../../../../../libs/mongodb/server";
import User from "../../../../../models/user";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await server();
    const { email } = await request.json();
    const user = await User.findOne({ email }).select("_id isVerified");
    console.log("user", user);
    return NextResponse.json({ user });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: `${err}` }, { status: 500 });
  }
}
