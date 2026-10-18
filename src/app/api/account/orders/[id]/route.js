import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "برای مشاهده سفارش وارد حساب کاربری شوید." },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "شناسه سفارش معتبر نیست." },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findOne({
      _id: id,
      userId: session.user.id,
    }).lean();

    if (!order) {
      return NextResponse.json(
        { message: "سفارش پیدا نشد یا اجازه مشاهده آن را ندارید." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      order: {
        id: order._id.toString(),
        orderNumber: order.orderNumber || order._id.toString(),
        status: order.status,
        paymentStatus: order.paymentStatus,
        items: order.items || [],
        total: order.total ?? order.totalAmount ?? 0,
        currency: order.currency || "USD",
        shippingAddress: order.shippingAddress || order.address || null,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    console.error("Order details GET error:", error);

    return NextResponse.json(
      { message: "دریافت جزئیات سفارش با خطا مواجه شد." },
      { status: 500 }
    );
  }
}