import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "برای ویرایش اطلاعات ابتدا وارد حساب شوید." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const name =
      typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { message: "نام باید بین ۲ تا ۱۰۰ کاراکتر باشد." },
        { status: 400 }
      );
    }

    if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { message: "ایمیل واردشده معتبر نیست." },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({
      email,
      _id: { $ne: session.user.id },
    }).select("_id");

    if (existingUser) {
      return NextResponse.json(
        { message: "این ایمیل قبلاً برای حساب دیگری ثبت شده است." },
        { status: 409 }
      );
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: { name, email } },
      { new: true, runValidators: true }
    ).select("name email createdAt");

    if (!user) {
      return NextResponse.json(
        { message: "حساب کاربری پیدا نشد." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "اطلاعات با موفقیت به‌روزرسانی شد.",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "این ایمیل قبلاً ثبت شده است." },
        { status: 409 }
      );
    }

    console.error("Profile PATCH error:", error);

    return NextResponse.json(
      { message: "ذخیره اطلاعات با خطا مواجه شد." },
      { status: 500 }
    );
  }
}