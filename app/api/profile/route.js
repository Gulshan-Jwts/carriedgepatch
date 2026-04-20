import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import User from "@/models/User";

export async function GET(req) {
  try {
    const email = req.headers.get("x-user-email");
    await connectMongo();

    const user = await User.findOne({ email });

    if (user.plan.active > 1) {
      let activeCurrent = new Date(user?.plan.since);
      let sinceDate = new Date(activeCurrent.toLocaleDateString());
      let currentDate = new Date();

      let diffTime = currentDate - sinceDate;
      let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 7) {
        user.plan.active = 0;
        user.plan.since = null;
        await user.save();
      }
    }

    console.log(user, "log server");

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 },
    );
  }
}
