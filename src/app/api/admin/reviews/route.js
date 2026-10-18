import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "دسترسی غیرمجاز است." },
        { status: 403 }
      );
    }

    await connectDB();

    const reviews = await Review.find({})
      .populate("productId", "name title slug")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return NextResponse.json(
      { reviews },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Admin reviews GET error:", error);

    return NextResponse.json(
      { message: "خطا در دریافت نظرات." },
      { status: 500 }
    );
  }
}
