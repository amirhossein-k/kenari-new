import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const CategorySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    section: { type: String, enum: ["cafe", "restaurant"], default: "cafe" },
    icon: { type: String, default: "☕" },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type CategoryDoc = InferSchemaType<typeof CategorySchema>;
export const Category: Model<CategoryDoc> =
  (mongoose.models.Category as Model<CategoryDoc>) || mongoose.model<CategoryDoc>("Category", CategorySchema);
