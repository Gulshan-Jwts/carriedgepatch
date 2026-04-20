import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import User from "@/models/User";

export async function POST(req) {
  try {
    const email = req.headers.get("x-user-email");
    const { messageId } = await req.json();

    await connectMongo();
    await User.updateOne(
      { email },
      { $pull: { messages: { _id: messageId } } }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}