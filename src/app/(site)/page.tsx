import Link from "next/link";
import { ArrowLeft, QrCode, ShoppingBag, Sparkles, Star, Timer } from "lucide-react";
import { getFeatured, getMenu, getSettings } from "@/lib/data";
import FeaturedGrid from "@/components/site/FeaturedGrid";
import SmartImage from "@/components/ui/SmartImage";
import { faNum } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [s, featured, menu] = await Promise.all([getSettings(), getFeatured(), getMenu()]);
  const steps = [
    { icon: QrCode, title: "اسکن کیوآر میز", text: "کد روی میز رو اسکن کن تا منو برای میزت باز بشه." },
    { icon: ShoppingBag, title: "انتخاب و سفارش", text: "آیتم‌هات رو انتخاب کن و با یک کلیک سفارش بده." },
    { icon: Timer, title: "پیگیری لحظه‌ای", text: "وضعیت آماده‌سازی سفارشت رو زنده ببین." },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative -mt-16 overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-bl from-brand-100 via-brand-50 to-white" />
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-brand-300/30 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="container-x relative grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-brand-700 shadow-sm ring-1 ring-brand-200">
              <Sparkles size={14} /> {s.isOpen ? "الان بازیم، منتظرتیم!" : "فعلا بسته‌ایم"}
            </span>
            <h1 className="mt-5 text-4xl font-black leading-[1.3] sm:text-5xl lg:text-6xl">
              {s.siteName}
              <span className="mt-2 block bg-gradient-to-l from-brand-500 to-brand-800 bg-clip-text text-transparent">{s.tagline}</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-8 text-stone-600">{s.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/menu" className="btn-primary px-6 py-3.5 text-base">مشاهده منو <ArrowLeft size={18} /></Link>
              <Link href="#how" className="btn-ghost px-6 py-3.5 text-base">چطور سفارش بدم؟</Link>
            </div>
            <div className="mt-10 flex gap-8">
              {[
                [faNum(menu.products.length) + "+", "آیتم منو"],
                [faNum(menu.categories.length), "دسته‌بندی"],
                ["۴٫۹", "امتیاز مشتری"],
              ].map(([n, l]) => (
                <div key={l}>
                  <p className="text-2xl font-black text-coffee-900">{n}</p>
                  <p className="text-xs text-stone-500">{l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg animate-fade-up [animation-delay:150ms]">
            <div className="absolute -inset-4 rotate-3 rounded-[2.5rem] bg-gradient-to-br from-brand-300 to-brand-600 opacity-30" />
            <SmartImage src={s.heroImage} alt={s.siteName} className="relative aspect-[4/5] w-full rounded-[2rem] shadow-2xl" />
            <div className="absolute -right-4 bottom-10 flex items-center gap-3 rounded-2xl bg-white/95 p-3 pl-5 shadow-soft backdrop-blur animate-float">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-100 text-2xl">☕</div>
              <div>
                <p className="text-xs text-stone-500">محبوب امروز</p>
                <p className="text-sm font-black">{featured[0]?.name ?? "اسپرسو"}</p>
              </div>
            </div>
            <div className="absolute -left-3 top-8 flex items-center gap-1 rounded-2xl bg-coffee-900 px-4 py-2.5 text-sm font-bold text-white shadow-soft">
              <Star size={16} className="fill-amber-400 text-amber-400" /> ۴٫۹ از ۵
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-x mt-6">
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
          {menu.categories.map((c) => (
            <Link key={c._id} href="/menu" className="card flex shrink-0 items-center gap-3 px-5 py-4 transition hover:-translate-y-0.5 hover:ring-brand-300">
              <span className="text-2xl">{c.icon}</span>
              <span className="text-sm font-bold">{c.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-x mt-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold text-brand-600">پیشنهاد سرآشپز</p>
            <h2 className="mt-1 text-3xl font-black">محبوب‌ترین‌ها</h2>
          </div>
          <Link href="/menu" className="hidden items-center gap-1 text-sm font-bold text-brand-700 hover:gap-2 sm:flex">
            همه منو <ArrowLeft size={16} />
          </Link>
        </div>
        <FeaturedGrid products={featured} />
      </section>

      {/* HOW */}
      <section id="how" className="container-x mt-24 scroll-mt-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-coffee-900 p-8 text-white sm:p-12">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl" />
          <h2 className="relative text-3xl font-black">سفارش از سر میز، در ۳ قدم</h2>
          <div className="relative mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((st, i) => (
              <div key={st.title} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur transition hover:bg-white/10">
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-500"><st.icon size={22} /></span>
                  <span className="text-4xl font-black text-white/10">{faNum(i + 1)}</span>
                </div>
                <h3 className="mt-5 text-lg font-extrabold">{st.title}</h3>
                <p className="mt-2 text-sm leading-7 text-brand-100/70">{st.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="container-x mt-24 grid scroll-mt-24 items-center gap-10 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-4">
          {featured.slice(0, 4).map((p, i) => (
            <SmartImage key={p._id} src={p.image} alt={p.name} className={`aspect-square w-full rounded-3xl shadow-soft ${i % 2 ? "mt-8" : ""}`} />
          ))}
        </div>
        <div>
          <p className="text-sm font-bold text-brand-600">درباره ما</p>
          <h2 className="mt-1 text-3xl font-black">از دونه‌ی قهوه تا بشقاب، با عشق</h2>
          <p className="mt-5 leading-8 text-stone-600">
            ما توی {s.siteName} هر روز دونه‌های تازه رُست‌شده رو آسیاب می‌کنیم، نونمون رو خودمون می‌پزیم و مواد اولیه رو از تأمین‌کننده‌های محلی می‌گیریم. نتیجه؟ طعمی که دوباره برت می‌گردونه.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[["☕", "رُست تازه"], ["🥐", "پخت روزانه"], ["🌿", "مواد ارگانیک"]].map(([e, t]) => (
              <div key={t} className="card p-4 text-center">
                <div className="text-3xl">{e}</div>
                <p className="mt-2 text-xs font-bold">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
