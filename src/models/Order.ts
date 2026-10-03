import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    name: String,
    price: Number,
    quantity: { type: Number, min: 1 },
    image: String,
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    orderType: { type: String, enum: ["dine-in", "takeaway"], default: "dine-in" },
    tableNumber: { type: String, default: null },
    items: { type: [OrderItemSchema], default: [] },
    note: { type: String, default: "" },
    subtotal: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export type OrderDoc = InferSchemaType<typeof OrderSchema>;
export const Order: Model<OrderDoc> =
  (mongoose.models.Order as Model<OrderDoc>) || mongoose.model<OrderDoc>("Order", OrderSchema);
