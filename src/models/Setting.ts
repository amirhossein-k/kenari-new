import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const SettingSchema = new Schema(
  {
    key: { type: String, default: "site", unique: true },
    siteName: { type: String, default: "کافه کناری" },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    instagram: { type: String, default: "" },
    openingHours: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    tableCount: { type: Number, default: 12 },
    isOpen: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type SettingDoc = InferSchemaType<typeof SettingSchema>;
export const Setting: Model<SettingDoc> =
  (mongoose.models.Setting as Model<SettingDoc>) || mongoose.model<SettingDoc>("Setting", SettingSchema);
