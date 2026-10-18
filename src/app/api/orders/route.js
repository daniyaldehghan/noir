import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import Order from "@/models/Order";

const COOKIE_NAME = "noir_cart_token";

function fail(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  throw error;
}

export async function POST(request) {
  let session;

  try {
    await connectDB();

    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Your shopping bag is empty." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      address,
      city,
      postalCode,
      notes = "",
      discountCode = "",
    } = body;

    if (
      typeof fullName !== "string" ||
      !fullName.trim() ||
      fullName.trim().length > 120 ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      email.trim().length > 254 ||
      typeof phone !== "string" ||
      !phone.trim() ||
      phone.trim().length > 30 ||
      typeof address !== "string" ||
      !address.trim() ||
      address.trim().length > 1000 ||
      typeof city !== "string" ||
      !city.trim() ||
      city.trim().length > 100 ||
      typeof postalCode !== "string" ||
      !postalCode.trim() ||
      postalCode.trim().length > 20 ||
      typeof notes !== "string" ||
      notes.length > 1000
    ) {
      return NextResponse.json(
        { message: "Please provide valid customer and delivery details." },
        { status: 400 }
      );
    }

    session = await mongoose.startSession();

    let createdOrder;

    await session.withTransaction(async () => {
      const cart = await Cart.findOne({ cartToken: token }).session(session);

      if (!cart || cart.items.length === 0) {
        fail("Your shopping bag is empty.", 400);
      }

      const orderItems = [];
      let subtotal = 0;

      for (const cartItem of cart.items) {
        const product = await Product.findOne({
          _id: cartItem.productId,
          isActive: true,
        }).session(session);

        if (!product) {
          fail(
            `A product in your bag is no longer available: ${cartItem.name}`,
            409
          );
        }

        const quantity = cartItem.quantity;

        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
          fail("An item has an invalid quantity.", 400);
        }

        // Atomically reserve stock only if enough remains.
        const stockUpdate = await Product.updateOne(
          {
            _id: product._id,
            isActive: true,
            stock: { $gte: quantity },
          },
          {
            $inc: { stock: -quantity },
          },
          { session }
        );

        if (stockUpdate.modifiedCount !== 1) {
          fail(
            `Insufficient stock for ${product.name}. Please update your bag.`,
            409
          );
        }

        const price = Number(product.price);

        if (!Number.isFinite(price) || price < 0) {
          fail("A product has an invalid price.", 409);
        }

        subtotal += price * quantity;

        orderItems.push({
          productId: product._id,
          name: product.name,
          slug: product.slug,
          image: product.image || product.images?.[0] || "",
          price,
          currency: product.currency || "USD",
          quantity,
        });
      }

      const normalizedCode =
        typeof discountCode === "string"
          ? discountCode.trim().toUpperCase()
          : "";

      const discountRates = {
        NOIR10: 10,
        WELCOME15: 15,
      };

      if (normalizedCode && !discountRates[normalizedCode]) {
        fail("Invalid discount code.", 400);
      }

      const discountRate = discountRates[normalizedCode] || 0;

      const discountAmount = Number(
        ((subtotal * discountRate) / 100).toFixed(2)
      );

      const total = Number((subtotal - discountAmount).toFixed(2));

      const orderNumber = `NOIR-${Date.now()}-${randomBytes(3)
        .toString("hex")
        .toUpperCase()}`;

      const orders = await Order.create(
        [
          {
            orderNumber,
            customer: {
              fullName: fullName.trim(),
              email: email.trim().toLowerCase(),
              phone: phone.trim(),
              address: address.trim(),
              city: city.trim(),
              postalCode: postalCode.trim(),
            },
            items: orderItems,
            subtotal: Number(subtotal.toFixed(2)),
            discountCode: normalizedCode,
            discountAmount,
            total,
            currency: "USD",
            status: "pending",
            paymentStatus: "unpaid",
            notes: notes.trim(),
          },
        ],
        { session }
      );

      createdOrder = orders[0];

      // Clear the cart only within the successful transaction.
      cart.items = [];
      await cart.save({ session });
    });

    return NextResponse.json(
      {
        message: "Order created successfully.",

        order: {
          orderNumber: createdOrder.orderNumber,
          status: createdOrder.status,
          paymentStatus: createdOrder.paymentStatus,
          subtotal: createdOrder.subtotal,
          discountCode: createdOrder.discountCode,
          discountAmount: createdOrder.discountAmount,
          total: createdOrder.total,
          currency: createdOrder.currency,
          createdAt: createdOrder.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order POST error:", error);

    return NextResponse.json(
      {
        message:
          error.status && error.status < 500
            ? error.message
            : "Could not create your order. Please try again.",
      },
      { status: error.status || 500 }
    );
  } finally {
    if (session) {
      await session.endSession();
    }
  }
}
