import mongoose from "mongoose";
import products from "./noir-products.mjs";

const MONGODB_URI = process.env.MONGODB_URI;

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: "", maxlength: 5000 },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD", enum: ["USD"] },
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
    tag: { type: String, default: "" },
    stock: { type: Number, default: 0, min: 0, validate: Number.isInteger },
    volume: { type: String, default: "" },
    fragranceFamily: { type: String, default: "" },
    scentNotes: {
      top: { type: [String], default: [] },
      heart: { type: [String], default: [] },
      base: { type: [String], default: [] },
    },
    longevity: { type: String, default: "" },
    sillage: { type: String, default: "" },
    season: { type: [String], default: [] },
    gender: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

async function importProducts() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from .env");
  }

  if (!Array.isArray(products) || products.length === 0) {
    throw new Error("No products found in the import file.");
  }
  const slugs = products.map((product) => product.slug);

  if (slugs.some((slug) => !slug) || new Set(slugs).size !== slugs.length) {
    throw new Error("Missing or duplicate product slugs found.");
  }

  await mongoose.connect(MONGODB_URI);

  const existing = await Product.find({
    slug: { $in: slugs },
  })
    .select("slug")
    .lean();

  const existingSlugs = new Set(existing.map((item) => item.slug));
  const newProducts = products.filter(
    (product) => !existingSlugs.has(product.slug)
  );

  if (newProducts.length) {
    const inserted = await Product.insertMany(newProducts);
    console.log(`Successfully imported: ${inserted.length}`);
  } else {
    console.log("All products already exist. Nothing imported.");
  }

  console.log(`Already existed: ${existing.length}`);
}

try {
  await importProducts();
} catch (error) {
  console.error("Import failed:", error.message);
  process.exitCode = 1;
} finally {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
