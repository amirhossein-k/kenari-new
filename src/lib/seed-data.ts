const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

export const seedSettings = {
  siteName: "کافه کناری",
  tagline: "طعم خوب، حال خوب",
  description:
    "کافه رستوران کناری؛ جایی برای یک قهوه‌ی دبش صبحگاهی، ناهار خوشمزه و دورهمی‌های عصرانه. سفارشت رو از سر میز ثبت کن، بقیه‌ش با ما.",
  phone: "۰۲۱-۱۲۳۴۵۶۷۸",
  address: "تهران، خیابان ولیعصر، کوچه نسترن، پلاک ۱۲",
  instagram: "cafe.kenari",
  openingHours: "همه روزه ۸ صبح تا ۱۲ شب",
  heroImage: u("photo-1554118811-1e0d58224f24"),
  tableCount: 12,
  isOpen: true,
};

export const seedCategories = [
  { title: "قهوه گرم", slug: "hot-coffee", section: "cafe", icon: "☕", sortOrder: 1 },
  { title: "نوشیدنی سرد", slug: "cold-drinks", section: "cafe", icon: "🧋", sortOrder: 2 },
  { title: "کیک و دسر", slug: "desserts", section: "cafe", icon: "🍰", sortOrder: 3 },
  { title: "صبحانه", slug: "breakfast", section: "restaurant", icon: "🍳", sortOrder: 4 },
  { title: "پیتزا و پاستا", slug: "pizza-pasta", section: "restaurant", icon: "🍕", sortOrder: 5 },
  { title: "برگر و ساندویچ", slug: "burgers", section: "restaurant", icon: "🍔", sortOrder: 6 },
  { title: "سالاد", slug: "salads", section: "restaurant", icon: "🥗", sortOrder: 7 },
] as const;

type SeedProduct = {
  name: string; description: string; price: number; discountPrice?: number; image: string;
  category: (typeof seedCategories)[number]["slug"]; tags?: string[]; isFeatured?: boolean; prepTime?: number; calories?: number;
};

export const seedProducts: SeedProduct[] = [
  { name: "اسپرسو دبل", description: "دو شات اسپرسو با دانه‌ی ۷۰٪ عربیکا، کرمای غلیظ و طعم شکلاتی", price: 85000, image: u("photo-1510707577719-ae7c14805e3a"), category: "hot-coffee", tags: ["پرفروش"], isFeatured: true, prepTime: 3, calories: 10 },
  { name: "کاپوچینو", description: "اسپرسو، شیر بخارداده و فوم مخملی با پودر کاکائو", price: 110000, image: u("photo-1572442388796-11668a67e53d"), category: "hot-coffee", prepTime: 5, calories: 120 },
  { name: "لاته کارامل", description: "لاته‌ی خامه‌ای با سس کارامل خانگی", price: 125000, discountPrice: 105000, image: u("photo-1561882468-9110e03e0f78"), category: "hot-coffee", tags: ["تخفیف"], isFeatured: true, prepTime: 5, calories: 210 },
  { name: "آمریکانو", description: "اسپرسو رقیق‌شده با آب داغ، سبک و خوش‌عطر", price: 90000, image: u("photo-1497935586351-b67a49e012bf"), category: "hot-coffee", prepTime: 3, calories: 15 },
  { name: "آیس لاته", description: "اسپرسو روی یخ و شیر سرد، انتخاب روزهای گرم", price: 120000, image: u("photo-1517701604599-bb29b565090c"), category: "cold-drinks", tags: ["جدید"], isFeatured: true, prepTime: 4, calories: 150 },
  { name: "اسموتی توت‌فرنگی موز", description: "توت‌فرنگی تازه، موز، ماست و عسل", price: 135000, image: u("photo-1505252585461-04db1eb84625"), category: "cold-drinks", prepTime: 6, calories: 230 },
  { name: "لیموناد نعنا", description: "لیموی تازه، برگ نعنا و سودا", price: 95000, image: u("photo-1523371054106-bbf80586c38c"), category: "cold-drinks", prepTime: 4, calories: 90 },
  { name: "چیزکیک نیویورکی", description: "چیزکیک پخته با سس توت‌فرنگی", price: 140000, image: u("photo-1533134242443-d4fd215305ad"), category: "desserts", tags: ["پرفروش"], isFeatured: true, prepTime: 2, calories: 380 },
  { name: "کیک شکلاتی", description: "کیک خیس شکلاتی با گاناش تلخ", price: 130000, image: u("photo-1578985545062-69928b1d9587"), category: "desserts", prepTime: 2, calories: 420 },
  { name: "تیرامیسو", description: "لایه‌های بیسکویت قهوه‌ای و کرم ماسکارپونه", price: 150000, image: u("photo-1571877227200-a0d98ea607e9"), category: "desserts", prepTime: 2, calories: 390 },
  { name: "پنکیک با عسل و میوه", description: "سه لایه پنکیک پفکی، عسل، کره و میوه‌ی فصل", price: 165000, image: u("photo-1533089860892-a7c6f0a88666"), category: "breakfast", isFeatured: true, prepTime: 12, calories: 520 },
  { name: "صبحانه انگلیسی", description: "تخم‌مرغ، سوسیس، لوبیا، قارچ و نان تست", price: 210000, image: u("photo-1525351484163-7529414344d8"), category: "breakfast", prepTime: 15, calories: 680 },
  { name: "پیتزا مارگاریتا", description: "سس گوجه، موزارلا تازه و ریحان، خمیر ناپلی", price: 260000, image: u("photo-1574071318508-1cdbab80d002"), category: "pizza-pasta", prepTime: 18, calories: 850 },
  { name: "پیتزا پپرونی", description: "پپرونی تند، پنیر موزارلا و سس مخصوص", price: 295000, discountPrice: 265000, image: u("photo-1513104890138-7c749659a591"), category: "pizza-pasta", tags: ["تند", "تخفیف"], isFeatured: true, prepTime: 18, calories: 920 },
  { name: "پاستا آلفردو", description: "پنه با سس خامه، قارچ و مرغ گریل", price: 240000, image: u("photo-1621996346565-e3dbc646d9a9"), category: "pizza-pasta", prepTime: 15, calories: 780 },
  { name: "برگر کلاسیک کناری", description: "۲۰۰ گرم گوشت گوساله، چدار، کاهو، گوجه و سس مخصوص", price: 275000, image: u("photo-1568901346375-23c9450c58cd"), category: "burgers", tags: ["پرفروش"], isFeatured: true, prepTime: 15, calories: 890 },
  { name: "کلاب ساندویچ", description: "مرغ گریل، بیکن، تخم‌مرغ و سبزیجات در نان تست", price: 210000, image: u("photo-1528735602780-2552fd46c7af"), category: "burgers", prepTime: 12, calories: 640 },
  { name: "سالاد سزار", description: "کاهو رومی، مرغ گریل، کروتان و پارمزان", price: 190000, image: u("photo-1550304943-4f24f54ddde9"), category: "salads", prepTime: 10, calories: 420 },
  { name: "سالاد یونانی", description: "خیار، گوجه، زیتون، پنیر فتا و سس لیمو", price: 170000, image: u("photo-1540420773420-3366772f4999"), category: "salads", tags: ["گیاهی"], prepTime: 8, calories: 310 },
];
