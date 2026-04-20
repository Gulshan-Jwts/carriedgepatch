import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import User from "@/models/User";

export async function PUT(req) {
  try {
    const email = req.headers.get("x-user-email");
    const { amount } = await req.json();
    await connectMongo();

    const user = await User.findOne({ email });
    user.pendingWithdraw = amount;
    user.save();
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 },
    );
  }
}
