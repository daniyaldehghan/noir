import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Review from "@/models/Review";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { message: "Product slug is required." },
        { status: 400 }
      );
    }

    const product = await Product.findOne({
      slug: slug.trim(),
      isActive: true,
    })
      .select("_id")
      .lean();

    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      );
    }

    const reviews = await Review.find({
      productId: product._id,
      isApproved: true,
    })
      .select("name rating title comment createdAt")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const averageRating =
      reviews.length > 0
        ? Number(
            (
              reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviews.length
            ).toFixed(1)
          )
        : 0;

    return NextResponse.json({
      reviews,
      count: reviews.length,
      averageRating,
    });
  } catch (error) {
    console.error("Reviews GET error:", error);

    return NextResponse.json(
      { message: "Could not load reviews." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const { slug, name, email, rating, title = "", comment } = body;

    if (
      typeof slug !== "string" ||
      !slug.trim() ||
      typeof name !== "string" ||
      !name.trim() ||
      name.trim().length > 80 ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      email.trim().length > 254 ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5 ||
      typeof title !== "string" ||
      title.trim().length > 120 ||
      typeof comment !== "string" ||
      comment.trim().length < 5 ||
      comment.trim().length > 1500
    ) {
      return NextResponse.json(
        { message: "Please provide valid review details." },
        { status: 400 }
      );
    }

    const product = await Product.findOne({
      slug: slug.trim(),
      isActive: true,
    }).select("_id");

    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      );
    }

    const review = await Review.create({
      productId: product._id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      rating,
      title: title.trim(),
      comment: comment.trim(),
      isApproved: false,
    });

    return NextResponse.json(
      {
        message: "Review submitted and is awaiting approval.",
        reviewId: review._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Reviews POST error:", error);

    return NextResponse.json(
      { message: "Could not submit your review." },
      { status: 500 }
    );
  }
}
