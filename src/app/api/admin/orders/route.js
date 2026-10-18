
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

const allowedStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = 20;

    const filter = {};

    if (status && allowedStatuses.includes(status)) {
      filter.status = status;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin orders GET error:", error);

    return NextResponse.json(
      { message: "Could not load orders." },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { id, status, paymentStatus } = body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "شناسه سفارش معتبر نیست." },
        { status: 400 }
      );
    }

    const updates = {};

    if (status !== undefined) {
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json(
          { message: "وضعیت سفارش معتبر نیست." },
          { status: 400 }
        );
      }

      updates.status = status;
    }

    if (paymentStatus !== undefined) {
      if (!["unpaid", "paid", "refunded"].includes(paymentStatus)) {
        return NextResponse.json(
          { message: "وضعیت پرداخت معتبر نیست." },
          { status: 400 }
        );
      }

      updates.paymentStatus = paymentStatus;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { message: "تغییری برای ذخیره ارسال نشده است." },
        { status: 400 }
      );
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!order) {
      return NextResponse.json(
        { message: "سفارش پیدا نشد." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "سفارش با موفقیت به‌روزرسانی شد.",
      order,
    });
  } catch (error) {
    console.error("Admin orders PATCH error:", error);

    return NextResponse.json(
      { message: "به‌روزرسانی سفارش انجام نشد." },
      { status: 500 }
    );
  }
}
