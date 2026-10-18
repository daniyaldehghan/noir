
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();

    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const revenueFilter = {
      paymentStatus: "paid",
      status: { $ne: "cancelled" },
    };

    const [
      totalOrders,
      pendingOrders,
      todayRevenue,
      monthRevenue,
      totalRevenue,
      totalProducts,
      lowStockProducts,
      recentOrders,
      dailySales,
      bestSellers,
    ] = await Promise.all([
      Order.countDocuments(),

      Order.countDocuments({ status: "pending" }),

      Order.aggregate([
        {
          $match: {
            ...revenueFilter,
            createdAt: { $gte: todayStart, $lt: tomorrowStart },
          },
        },
        { $group: { _id: null, total: { $sum: "$subtotal" } } },
      ]),

      Order.aggregate([
        {
          $match: {
            ...revenueFilter,
            createdAt: { $gte: monthStart, $lte: now },
          },
        },
        { $group: { _id: null, total: { $sum: "$subtotal" } } },
      ]),

      Order.aggregate([
        { $match: revenueFilter },
        { $group: { _id: null, total: { $sum: "$subtotal" } } },
      ]),

      Product.countDocuments({ isActive: true }),

      Product.countDocuments({
        isActive: true,
        stock: { $lte: 5 },
      }),

      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("orderNumber customer.fullName subtotal currency status paymentStatus createdAt")
        .lean(),

      Order.aggregate([
        {
          $match: {
            ...revenueFilter,
            createdAt: {
              $gte: new Date(todayStart.getTime() - 6 * 24 * 60 * 60 * 1000),
              $lt: tomorrowStart,
            },
          },
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
            orders: { $addToSet: "$_id" },
          },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            revenue: 1,
            orders: { $size: "$orders" },
          },
        },
        { $sort: { date: 1 } },
      ]),

      Order.aggregate([
        { $match: revenueFilter },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.productId",
            name: { $first: "$items.name" },
            image: { $first: "$items.image" },
            quantitySold: { $sum: "$items.quantity" },
            revenue: {
              $sum: {
                $multiply: ["$items.price", "$items.quantity"],
              },
            },
          },
        },
        { $sort: { quantitySold: -1 } },
        { $limit: 5 },
        { $project: { _id: 0, name: 1, image: 1, quantitySold: 1, revenue: 1 } },
      ]),
    ]);

    const dailySalesMap = new Map(
      dailySales.map((item) => [item.date, item])
    );

    const salesChart = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(todayStart);
      date.setDate(date.getDate() - i);

      const key = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");

      const sale = dailySalesMap.get(key);

      salesChart.push({
        date: key,
        revenue: sale?.revenue || 0,
        orders: sale?.orders || 0,
      });
    }

    return NextResponse.json({
      stats: {
        totalOrders,
        pendingOrders,
        todayRevenue: todayRevenue[0]?.total || 0,
        monthRevenue: monthRevenue[0]?.total || 0,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalProducts,
        lowStockProducts,
      },
      recentOrders,
      salesChart,
      bestSellers,
    });
  } catch (error) {
    console.error("Admin stats API error:", error);

    return NextResponse.json(
      { message: "Could not load dashboard statistics." },
      { status: 500 }
    );
  }
}
