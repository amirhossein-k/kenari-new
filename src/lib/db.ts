import mongoose from "mongoose";

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const g = globalThis as unknown as { _mongoose?: Cache };
const cache: Cache = g._mongoose ?? { conn: null, promise: null };
g._mongoose = cache;

export async function connectDB() {
  if (cache.conn) return cache.conn;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI در فایل .env.local تعریف نشده است");
  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, { bufferCommands: false });
  }
  try {
    cache.conn = await cache.promise;
  } catch (e) {
    cache.promise = null;
    throw e;
  }
  return cache.conn;
}

/** تبدیل داکیومنت‌های mongoose به آبجکت ساده قابل ارسال به کلاینت */
export function plain<T>(data: unknown): T {
  return JSON.parse(JSON.stringify(data)) as T;
}
