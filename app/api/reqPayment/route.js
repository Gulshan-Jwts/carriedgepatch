import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import User from "@/models/User";

export async function PUT(req) {
  try {
    const email = req.headers.get("x-user-email");
    const { source, amount, formData } = await req.json();
    await connectMongo();

    const user = await User.findOne({ email });
    if (source === "refer") {
      let isFound = false;
      const updatedHistory = user.history.map((item) => {
        if (isFound) return item;
        if (item.source === "refer" && item.isPending) {
          isFound = true;
          return { ...item, isPending: false };
        } else {
          return item;
        }
      });
      user.history = updatedHistory;
      user.withdraw.source = "refer";
    } else {
      user.earned = 0;
      user.withdraw.source = "First Data Shared";
    }
    console.log(amount, typeof Number(amount));
    user.withdraw.amount += Number(amount);
    user.receivingPhone = formData.phone;
    user.name = formData.name;
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
