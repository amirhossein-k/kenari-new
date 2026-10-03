import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const NotificationSchema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, default: "" },
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    orderCode: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type NotificationDoc = InferSchemaType<typeof NotificationSchema>;
export const Notification: Model<NotificationDoc> =
  (mongoose.models.Notification as Model<NotificationDoc>) ||
  mongoose.model<NotificationDoc>("Notification", NotificationSchema);
