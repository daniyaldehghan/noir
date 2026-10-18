import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { compare, hash } from "bcryptjs";

import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "برای تغییر رمز ابتدا وارد حساب کاربری شوید." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const currentPassword =
      typeof body.currentPassword === "string"
        ? body.currentPassword
        : "";

    const newPassword =
      typeof body.newPassword === "string" ? body.newPassword : "";

    const confirmPassword =
      typeof body.confirmPassword === "string"
        ? body.confirmPassword
        : "";

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { message: "تمام فیلدها الزامی هستند." },
        { status: 400 }
      );
    }

    if (
      newPassword.length < 8 ||
      !/[a-zA-Z]/.test(newPassword) ||
      !/\d/.test(newPassword)
    ) {
      return NextResponse.json(
        {
          message:
            "رمز جدید باید حداقل ۸ کاراکتر و شامل یک حرف انگلیسی و یک عدد باشد.",
        },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { message: "رمز جدید و تکرار آن یکسان نیستند." },
        { status: 400 }
      );
    }

    if (newPassword === currentPassword) {
      return NextResponse.json(
        { message: "رمز جدید باید با رمز فعلی متفاوت باشد." },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id).select("+password");

    if (!user) {
      return NextResponse.json(
        { message: "حساب کاربری پیدا نشد." },
        { status: 404 }
      );
    }

    const isCurrentPasswordValid = await compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { message: "رمز عبور فعلی صحیح نیست." },
        { status: 400 }
      );
    }

    user.password = await hash(newPassword, 12);
    await user.save();

    return NextResponse.json({
      message: "رمز عبور با موفقیت تغییر کرد.",
    });
  } catch (error) {
    console.error("Account security PATCH error:", error);

    return NextResponse.json(
      { message: "در تغییر رمز عبور خطایی رخ داد." },
      { status: 500 }
    );
  }
}