import connectMongo from "@/lib/connectMongo";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const email = req.headers.get("x-user-email");
    const { name } = await req.json();
    await connectMongo();

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 },
      );
    }
    const user = await User.findOne({ email });
    user.name = name.trim();
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Name updated successfully",
      name: name.trim(),
    });
  } catch (error) {
    console.error("Update name error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
