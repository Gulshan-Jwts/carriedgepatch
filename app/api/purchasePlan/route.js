import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import User from "@/models/User";

export async function POST(req) {
  try {
    const email = req.headers.get("x-user-email");
    const { planCode, phone } = await req.json();
    await connectMongo();

    const user = await User.findOne({ email });
    user.plan.pending = planCode;
    user.payingPhone = phone;
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
