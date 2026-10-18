
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    const body = await request.json();

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "تمام فیلدها الزامی هستند." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "ایمیل معتبر نیست." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "رمز عبور باید حداقل ۸ کاراکتر باشد." },
        { status: 400 }
      );
    }

    if (name.length > 100 || email.length > 254) {
      return NextResponse.json(
        { message: "طول اطلاعات واردشده بیش از حد مجاز است." },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "این ایمیل قبلاً ثبت‌نام کرده است." },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    return NextResponse.json(
      {
        message: "ثبت‌نام با موفقیت انجام شد.",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "این ایمیل قبلاً ثبت‌نام کرده است." },
        { status: 409 }
      );
    }

    console.error("Register error:", error);

    return NextResponse.json(
      { message: "ثبت‌نام انجام نشد. دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}
