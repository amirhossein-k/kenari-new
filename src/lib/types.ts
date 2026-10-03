export type Section = "cafe" | "restaurant";

export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled";

export interface CategoryDTO {
  _id: string;
  title: string;
  slug: string;
  section: Section;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ProductDTO {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  image: string;
  category: string;
  tags: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  prepTime: number;
  calories?: number | null;
  sortOrder: number;
  createdAt?: string;
}

export interface OrderItemDTO {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderDTO {
  _id: string;
  code: string;
  customerName: string;
  phone: string;
  orderType: "dine-in" | "takeaway";
  tableNumber?: string | null;
  items: OrderItemDTO[];
  note: string;
  subtotal: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationDTO {
  _id: string;
  title: string;
  message: string;
  orderCode?: string;
  order?: string;
  read: boolean;
  createdAt: string;
}

export interface SettingsDTO {
  siteName: string;
  tagline: string;
  description: string;
  phone: string;
  address: string;
  instagram: string;
  openingHours: string;
  heroImage: string;
  tableCount: number;
  isOpen: boolean;
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "در انتظار تایید",
  confirmed: "تایید شد",
  preparing: "در حال آماده‌سازی",
  ready: "آماده تحویل",
  delivered: "تحویل داده شد",
  cancelled: "لغو شد",
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800 ring-amber-200",
  confirmed: "bg-sky-100 text-sky-800 ring-sky-200",
  preparing: "bg-violet-100 text-violet-800 ring-violet-200",
  ready: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  delivered: "bg-stone-100 text-stone-700 ring-stone-200",
  cancelled: "bg-rose-100 text-rose-700 ring-rose-200",
};

export const STATUS_FLOW: OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "delivered"];
