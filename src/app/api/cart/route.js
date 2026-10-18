import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { getServerSession } from "next-auth";

import connectDB from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

const COOKIE_NAME = "noir_cart_token";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

function serializeItems(items = []) {
  return items.map((item) => ({
    productId: item.productId,
    name: item.name,
    slug: item.slug,
    image: item.image,
    category: item.category,
    price: item.price,
    currency: item.currency,
    quantity: item.quantity,
  }));
}

function responseWithCookie(data, status = 200, token = undefined) {
  const response = NextResponse.json(data, { status });

  if (token !== undefined) {
    response.cookies.set(COOKIE_NAME, token, {
      ...cookieOptions,
      maxAge: token ? cookieOptions.maxAge : 0,
    });
  }

  return response;
}

async function getCartContext(request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || null;
  const token = request.cookies.get(COOKIE_NAME)?.value || null;

  if (userId) {
    let cart = await Cart.findOne({ userId });

    // Only an unowned guest cart can be merged.
    const guestCart = token
      ? await Cart.findOne({
          cartToken: token,
          userId: { $exists: false },
        })
      : null;

    if (guestCart) {
      if (!cart) {
        guestCart.userId = userId;
        cart = await guestCart.save();
      } else if (String(cart._id) !== String(guestCart._id)) {
        for (const guestItem of guestCart.items) {
          const existing = cart.items.find(
            (item) => item.productId === guestItem.productId
          );

          if (existing) {
            existing.quantity = Math.min(
              20,
              existing.quantity + guestItem.quantity
            );
          } else {
            cart.items.push({
              productId: guestItem.productId,
              name: guestItem.name,
              slug: guestItem.slug,
              image: guestItem.image,
              category: guestItem.category,
              price: guestItem.price,
              currency: guestItem.currency,
              quantity: Math.min(20, guestItem.quantity),
            });
          }
        }

        await cart.save();
        await Cart.deleteOne({ _id: guestCart._id });
      }
    }

    return {
      cart,
      userId,
      clearCookie: Boolean(token),
    };
  }

  // A guest can only access an unowned cart.
  const cart = token
    ? await Cart.findOne({
        cartToken: token,
        userId: { $exists: false },
      })
    : null;

  return {
    cart,
    userId: null,
    clearCookie: Boolean(token && !cart),
  };
}

async function createCart(context) {
  const token = randomBytes(32).toString("hex");

  const cart = new Cart({
    cartToken: token,
    ...(context.userId ? { userId: context.userId } : {}),
    items: [],
  });

  await cart.save();

  return { cart, guestToken: context.userId ? null : token };
}

async function getProduct(productId) {
  const conditions = [{ slug: productId }];

  if (/^[a-f\d]{24}$/i.test(productId)) {
    conditions.push({ _id: productId });
  }

  return Product.findOne({
    $or: conditions,
    isActive: true,
  }).lean();
}

function productDetails(product) {
  return {
    productId: String(product._id),
    name: product.name,
    slug: product.slug,
    image: product.image || product.images?.[0] || "",
    category: product.category || "",
    price: Number(product.price),
    currency: product.currency || "USD",
  };
}

export async function GET(request) {
  try {
    await connectDB();

    const context = await getCartContext(request);

    return responseWithCookie(
      { items: serializeItems(context.cart?.items || []) },
      200,
      context.clearCookie ? "" : undefined
    );
  } catch (error) {
    console.error("Cart GET error:", error);

    return NextResponse.json(
      { message: "Could not load cart" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (
      typeof productId !== "string" ||
      !productId.trim() ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 20
    ) {
      return NextResponse.json(
        { message: "Invalid product or quantity" },
        { status: 400 }
      );
    }

    const product = await getProduct(productId);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found or unavailable" },
        { status: 404 }
      );
    }

    const context = await getCartContext(request);
    let cart = context.cart;
    let guestToken;

    if (!cart) {
      const created = await createCart(context);
      cart = created.cart;
      guestToken = created.guestToken;
    }

    const details = productDetails(product);
    const existing = cart.items.find(
      (item) => item.productId === details.productId
    );

    if (existing) {
      if (existing.quantity + quantity > 20) {
        return NextResponse.json(
          { message: "Maximum quantity is 20 per product" },
          { status: 400 }
        );
      }

      existing.quantity += quantity;
      Object.assign(existing, details);
    } else {
      cart.items.push({ ...details, quantity });
    }

    await cart.save();

    return responseWithCookie(
      { items: serializeItems(cart.items) },
      200,
      guestToken
    );
  } catch (error) {
    console.error("Cart POST error:", error);

    return NextResponse.json(
      { message: "Could not update cart" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    await connectDB();

    const { productId, quantity } = await request.json();

    if (
      typeof productId !== "string" ||
      !productId.trim() ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 20
    ) {
      return NextResponse.json(
        { message: "Invalid product or quantity" },
        { status: 400 }
      );
    }

    const context = await getCartContext(request);
    const cart = context.cart;

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const item = cart.items.find((entry) => entry.productId === productId);

    if (!item) {
      return NextResponse.json(
        { message: "Product not found in cart" },
        { status: 404 }
      );
    }

    item.quantity = quantity;
    await cart.save();

    return NextResponse.json({ items: serializeItems(cart.items) });
  } catch (error) {
    console.error("Cart PATCH error:", error);

    return NextResponse.json(
      { message: "Could not update cart quantity" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();

    const { productId } = await request.json();

    if (typeof productId !== "string" || !productId.trim()) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 }
      );
    }

    const context = await getCartContext(request);
    const cart = context.cart;

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    cart.items = cart.items.filter((item) => item.productId !== productId);
    await cart.save();

    return NextResponse.json({ items: serializeItems(cart.items) });
  } catch (error) {
    console.error("Cart PUT error:", error);

    return NextResponse.json(
      { message: "Could not remove product from cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();

    const context = await getCartContext(request);

    if (context.cart) {
      await Cart.deleteOne({ _id: context.cart._id });
    }

    // Clear only the browser's guest-cart cookie.
    return responseWithCookie({ items: [] }, 200, "");
  } catch (error) {
    console.error("Cart DELETE error:", error);

    return NextResponse.json(
      { message: "Could not clear cart" },
      { status: 500 }
    );
  }
}
