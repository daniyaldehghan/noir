import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const search = searchParams.get("search")?.trim();

    if (slug) {
      const product = await Product.findOne({
        slug,
        isActive: true,
      }).lean();

      if (!product) {
        return NextResponse.json(
          { message: "Product not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ product });
    }

    const filter = { isActive: true };

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.name = {
        $regex: escapedSearch,
        $options: "i",
      };
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(search ? 6 : 0)
      .lean();

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Products API GET error:", error);

    return NextResponse.json(
      { message: "Could not load products" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const name = String(body.name || "").trim();
    const slug = String(body.slug || "")
      .trim()
      .toLowerCase();
    const category = String(body.category || "").trim();
    const description = String(body.description || "").trim();
    const image = String(body.image || "").trim();

    const tag = String(body.tag || "").trim();
    const price = Number(body.price);
    const stock = Number(body.stock ?? 0);

    const volume = String(body.volume || "").trim();
    const fragranceFamily = String(body.fragranceFamily || "").trim();
    const longevity = String(body.longevity || "").trim();
    const sillage = String(body.sillage || "").trim();
    const gender = String(body.gender || "").trim();

    const scentNotes = {
      top: Array.isArray(body.scentNotes?.top)
        ? body.scentNotes.top.map(String)
        : [],
      heart: Array.isArray(body.scentNotes?.heart)
        ? body.scentNotes.heart.map(String)
        : [],
      base: Array.isArray(body.scentNotes?.base)
        ? body.scentNotes.base.map(String)
        : [],
    };

    const season = Array.isArray(body.season) ? body.season.map(String) : [];

    if (!name || !slug || !category) {
      return NextResponse.json(
        { message: "Name, slug and category are required." },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return NextResponse.json(
        { message: "Price or stock is invalid." },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name,
      slug,
      category,
      description,
      price,
      currency: "USD",
      image,
      images: image ? [image] : [],
      tag,
      stock,
      isActive: true,

      volume,
      fragranceFamily,
      scentNotes,
      longevity,
      sillage,
      season,
      gender,
    });

    return NextResponse.json(
      { message: "Product created successfully.", product },
      { status: 201 }
    );
  } catch (error) {
    console.error("Products API POST error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { message: "This slug already exists." },
        { status: 409 }
      );
    }

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { message: "Product data is invalid." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Could not create product.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required." },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Products API DELETE error:", error);

    if (error.name === "CastError") {
      return NextResponse.json(
        { message: "Invalid product ID." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Could not delete product." },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required." },
        { status: 400 }
      );
    }

    const updates = {};

    const stringFields = [
      "name",
      "slug",
      "category",
      "description",
      "image",
      "tag",
      "volume",
      "fragranceFamily",
      "longevity",
      "sillage",
      "gender",
    ];

    for (const field of stringFields) {
      if (body[field] !== undefined) {
        updates[field] = String(body[field] ?? "").trim();

        if (field === "slug") {
          updates[field] = updates[field].toLowerCase();
        }
      }
    }

    if (body.price !== undefined) {
      const price = Number(body.price);

      if (!Number.isFinite(price) || price < 0) {
        return NextResponse.json(
          { message: "Price is invalid." },
          { status: 400 }
        );
      }

      updates.price = price;
    }

    if (body.stock !== undefined) {
      const stock = Number(body.stock);

      if (!Number.isInteger(stock) || stock < 0) {
        return NextResponse.json(
          { message: "Stock is invalid." },
          { status: 400 }
        );
      }

      updates.stock = stock;
    }

    if (body.isActive !== undefined) {
      if (typeof body.isActive !== "boolean") {
        return NextResponse.json(
          { message: "isActive must be a boolean." },
          { status: 400 }
        );
      }

      updates.isActive = body.isActive;
    }

    if (body.scentNotes !== undefined) {
      updates.scentNotes = {
        top: Array.isArray(body.scentNotes?.top)
          ? body.scentNotes.top.map(String)
          : [],
        heart: Array.isArray(body.scentNotes?.heart)
          ? body.scentNotes.heart.map(String)
          : [],
        base: Array.isArray(body.scentNotes?.base)
          ? body.scentNotes.base.map(String)
          : [],
      };
    }

    if (body.season !== undefined) {
      if (!Array.isArray(body.season)) {
        return NextResponse.json(
          { message: "Season must be an array." },
          { status: 400 }
        );
      }

      updates.season = body.season.map(String);
    }

    if (body.image !== undefined && body.images === undefined) {
      updates.images = updates.image ? [updates.image] : [];
    }

    if (!Object.keys(updates).length) {
      return NextResponse.json(
        { message: "No fields provided to update." },
        { status: 400 }
      );
    }

    if (
      (updates.name !== undefined && !updates.name) ||
      (updates.slug !== undefined && !updates.slug) ||
      (updates.category !== undefined && !updates.category)
    ) {
      return NextResponse.json(
        { message: "Name, slug and category cannot be empty." },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error("Products API PUT error:", error);

    if (error.name === "CastError") {
      return NextResponse.json(
        { message: "Invalid product ID." },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { message: "This slug already exists." },
        { status: 409 }
      );
    }

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { message: "Product data is invalid." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Could not update product." },
      { status: 500 }
    );
  }
}
