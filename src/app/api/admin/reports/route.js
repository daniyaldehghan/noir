
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "30";

    const allowedRanges = ["7", "30", "90", "365"];

    if (!allowedRanges.includes(range)) {
      return NextResponse.json(
        { message: "بازه زمانی معتبر نیست." },
        { status: 400 }
      );
    }

    const days = Number(range);
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - days);
    start.setHours(0, 0, 0, 0);

    const previousStart = new Date(start);
    previousStart.setDate(previousStart.getDate() - days);

    const revenueFilter = {
      paymentStatus: "paid",
      status: { $ne: "cancelled" },
    };

    const [
      currentPeriod,
      previousPeriod,
      statusBreakdown,
      paymentBreakdown,
      topProducts,
      dailyRevenue,
    ] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            ...revenueFilter,
            createdAt: { $gte: start, $lte: now },
          },
        },
        {
          $group: {
            _id: null,
            revenue: { $sum: "$subtotal" },
            orders: { $sum: 1 },
          },
        },
      ]),

      Order.aggregate([
        {
          $match: {
            ...revenueFilter,
            createdAt: { $gte: previousStart, $lt: start },
          },
        },
        {
          $group: {
            _id: null,
            revenue: { $sum: "$subtotal" },
            orders: { $sum: 1 },
          },
        },
      ]),

      Order.aggregate([
        { $match: { createdAt: { $gte: start, $lte: now } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),

      Order.aggregate([
        { $match: { createdAt: { $gte: start, $lte: now } } },
        { $group: { _id: "$paymentStatus", count: { $sum: 1 } } },
      ]),

      Order.aggregate([
        {
          $match: {
            ...revenueFilter,
            createdAt: { $gte: start, $lte: now },
          },
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.productId",
            name: { $first: "$items.name" },
            quantity: { $sum: "$items.quantity" },
            revenue: {
              $sum: {
                $multiply: ["$items.price", "$items.quantity"],
              },
            },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            name: 1,
            quantity: 1,
            revenue: 1,
          },
        },
      ]),

      Order.aggregate([
        {
          $match: {
            ...revenueFilter,
            createdAt: { $gte: start, $lte: now },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            revenue: { $sum: "$subtotal" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const current = currentPeriod[0] || { revenue: 0, orders: 0 };
    const previous = previousPeriod[0] || { revenue: 0, orders: 0 };

    const revenueChange =
      previous.revenue > 0
        ? ((current.revenue - previous.revenue) / previous.revenue) * 100
        : null;

    const orderChange =
      previous.orders > 0
        ? ((current.orders - previous.orders) / previous.orders) * 100
        : null;

    return NextResponse.json({
      range: days,
      summary: {
        revenue: current.revenue,
        orders: current.orders,
        averageOrderValue:
          current.orders > 0 ? current.revenue / current.orders : 0,
        previousRevenue: previous.revenue,
        previousOrders: previous.orders,
        revenueChange,
        orderChange,
      },
      statusBreakdown,
      paymentBreakdown,
      topProducts,
      dailyRevenue,
    });
  } catch (error) {
    console.error("Admin reports API error:", error);

    return NextResponse.json(
      { message: "دریافت گزارش فروش ناموفق بود." },
      { status: 500 }
    );
  }
}
