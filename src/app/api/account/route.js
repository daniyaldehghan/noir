import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "برای مشاهده پنل وارد حساب خود شوید." },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id)
      .select("name email createdAt")
      .lean();

    if (!user) {
      return NextResponse.json(
        { message: "حساب کاربری پیدا نشد." },
        { status: 404 }
      );
    }

    const orders = await Order.find({
      $or: [
        { userId: session.user.id },
        { "customer.email": user.email },
      ],
    })
      .select(
        "orderNumber items subtotal discountAmount total currency status paymentStatus createdAt"
      )
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const orderSummary = {
      total: orders.length,
      pending: orders.filter(
        (order) =>
          order.status === "pending" ||
          order.paymentStatus === "unpaid"
      ).length,
      processing: orders.filter((order) =>
        ["confirmed", "processing", "shipped"].includes(order.status)
      ).length,
      delivered: orders.filter(
        (order) => order.status === "delivered"
      ).length,
    };

    return NextResponse.json({
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      orders: orders.map((order) => ({
        id: String(order._id),
        orderNumber: order.orderNumber,
        items: order.items,
        subtotal: order.subtotal,
        discountAmount: order.discountAmount,
        total: order.total,
        currency: order.currency,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
      })),
      orderSummary,
    });
  } catch (error) {
    console.error("Account GET error:", error);

    return NextResponse.json(
      { message: "دریافت اطلاعات حساب با خطا مواجه شد." },
      { status: 500 }
    );
  }
}