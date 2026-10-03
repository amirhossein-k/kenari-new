"use client";
import { useState } from "react";
import type { ProductDTO } from "@/lib/types";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";

export default function FeaturedGrid({ products }: { products: ProductDTO[] }) {
  const [sel, setSel] = useState<ProductDTO | null>(null);
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p, i) => <ProductCard key={p._id} p={p} index={i} onOpen={() => setSel(p)} />)}
      </div>
      <ProductModal p={sel} onClose={() => setSel(null)} />
    </>
  );
}
