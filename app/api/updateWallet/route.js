import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import User from "@/models/User";

export async function PUT(req) {
  try {
    const email = req.headers.get("x-user-email");
    const { dataUsed } = await req.json();
    await connectMongo();

    const user = await User.findOne({ email });
    const dailyQuota =
      user?.plan?.active === 1
        ? 250
        : user?.plan?.active === 2
          ? 1024
          : user?.plan?.active === 3
            ? 5120
            : 0;
    const isToday =
      user?.today?.date &&
      new Date(user.today.date).toDateString() === new Date().toDateString();

    const todayUsed = isToday ? user?.today?.quota || 0 : 0;
    const remainingQuota = dailyQuota - todayUsed;
    if (!remainingQuota)
      return NextResponse.json(
        { message: "No remaining quota available" },
        { status: 200 },
      );
    user.wallet = user.wallet + dataUsed / 10;
    user.today = {
      date: new Date(),
      quota: todayUsed + dataUsed,
    };
    user.history.push({
      source: "data",
      data: dataUsed,
      description: `Data Shared (${dataUsed.toFixed(0)}MB)`,
    });
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
