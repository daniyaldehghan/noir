
require("dotenv").config({ path: ".env.local" });

const mongoose = require("mongoose");
const products = require("../data/products").default;

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
    tag: { type: String, default: "" },
    stock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    for (const item of products) {
      await Product.updateOne(
        { slug: item.slug || item.id },
        {
          $setOnInsert: {
            name: item.name,
            slug: item.slug || item.id,
            category: item.category || "EAU DE PARFUM",
            description: item.description || "",
            price: Number(item.price),
            currency: item.currency || "USD",
            image: item.image || "",
            images: item.images || [],
            tag: item.tag || "",
            stock: 10,
            isActive: true,
          },
        },
        { upsert: true }
      );
    }

    console.log("Products imported successfully.");
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
