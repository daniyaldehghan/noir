import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "دسترسی غیرمجاز است." },
        { status: 403 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "شناسه نظر معتبر نیست." },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (typeof body.isApproved !== "boolean") {
      return NextResponse.json(
        { message: "وضعیت تأیید معتبر نیست." },
        { status: 400 }
      );
    }

    await connectDB();

    const review = await Review.findByIdAndUpdate(
      id,
      { $set: { isApproved: body.isApproved } },
      { new: true, runValidators: true }
    );

    if (!review) {
      return NextResponse.json({ message: "نظر پیدا نشد." }, { status: 404 });
    }

    return NextResponse.json({
      message: body.isApproved
        ? "نظر با موفقیت تأیید شد."
        : "نظر از حالت تأیید خارج شد.",
    });
  } catch (error) {
    console.error("Admin review PATCH error:", error);

    return NextResponse.json(
      { message: "خطا در تغییر وضعیت نظر." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "دسترسی غیرمجاز است." },
        { status: 403 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "شناسه نظر معتبر نیست." },
        { status: 400 }
      );
    }

    await connectDB();

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return NextResponse.json({ message: "نظر پیدا نشد." }, { status: 404 });
    }

    return NextResponse.json({
      message: "نظر با موفقیت حذف شد.",
    });
  } catch (error) {
    console.error("Admin review DELETE error:", error);

    return NextResponse.json({ message: "خطا در حذف نظر." }, { status: 500 });
  }
}
