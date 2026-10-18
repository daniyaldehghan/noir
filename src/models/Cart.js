import mongoose from "mongoose";

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

const CartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: String,
    image: String,
    category: String,
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    cartToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      sparse: true,
    },

    items: {
      type: [CartItemSchema],
      default: [],
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + THREE_DAYS_MS),
      expires: 0,
    },
  },
  { timestamps: true }
);

// تمدید مهلت سه‌روزه با هر بار ذخیره سبد
CartSchema.pre("save", function () {
  this.expiresAt = new Date(Date.now() + THREE_DAYS_MS);
});

export default mongoose.models.Cart ||
  mongoose.model("Cart", CartSchema);