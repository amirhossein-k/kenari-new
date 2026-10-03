import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: null },
    image: { type: String, default: "" },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    tags: { type: [String], default: [] },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    prepTime: { type: Number, default: 10 },
    calories: { type: Number, default: null },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type ProductDoc = InferSchemaType<typeof ProductSchema>;
export const Product: Model<ProductDoc> =
  (mongoose.models.Product as Model<ProductDoc>) || mongoose.model<ProductDoc>("Product", ProductSchema);
