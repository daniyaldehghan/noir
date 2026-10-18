import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      maxlength: 5000,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "USD",
      enum: ["USD"],
    },

    image: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    tag: {
      type: String,
      default: "",
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
      validate: Number.isInteger,
    },

    volume: {
      type: String,
      default: "",
      trim: true,
      maxlength: 50,
    },

    fragranceFamily: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

    scentNotes: {
      top: {
        type: [String],
        default: [],
      },
      heart: {
        type: [String],
        default: [],
      },
      base: {
        type: [String],
        default: [],
      },
    },

    longevity: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

    sillage: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

    season: {
      type: [String],
      default: [],
    },

    gender: {
      type: String,
      default: "",
      trim: true,
      maxlength: 50,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
