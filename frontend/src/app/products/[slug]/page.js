import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProductBySlug, formatCurrency } from "@/services/productService";
import { CheckCircle2, Shield, Cpu, Server, ArrowLeft } from "lucide-react";
import OrderForm from "@/components/OrderForm";

export const revalidate = 0; // Dynamic fetching

export default async function ProductDetailPage({ params, searchParams }) {
  const product = await fetchProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const isOrderMode = searchParams?.order === "true";

  // Parse features and specs if string/array or fallback
  const features = Array.isArray(product.features)
    ? product.features
    : [
        "Full Source Code & Database Access",
        "REST API Integration Ready",
        "High Performance Architecture",
        "Responsive Modern UI",
      ];

  const specifications = product.specifications || {
    backend: "Node.js / Express.js",
    database: "PostgreSQL 14+",
    frontend: "Next.js / Tailwind CSS",
    deployment: "Docker / Linux Server",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#2D9CFF] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog Produk
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-blue-50 text-[#2D9CFF] border border-blue-200">
              {product.category_name || "Enterprise Solution"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
              {product.name}
            </h1>
            
            {product.image && (
              <div className="mt-6 w-full h-80 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
            )}

            <p className="text-slate-600 text-base sm:text-lg mt-6 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

          {/* Key Features */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#2D9CFF]" /> Fitur Utama (Key Features)
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Specifications */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-[#2D9CFF]" /> Spesifikasi Teknis
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {Object.entries(specifications).map(([key, val], idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{key}</div>
                  <div className="text-sm font-bold text-slate-800 mt-1">{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Card / Form */}
        <div className="space-y-6">
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-lg space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <div>
                <div className="text-xs font-semibold text-slate-400">Harga Lisensi</div>
                <div className="text-3xl font-black text-[#2D9CFF] mt-1">{formatCurrency(product.price)}</div>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {product.status || "ACTIVE"}
              </span>
            </div>

            {isOrderMode ? (
              <OrderForm product={product} />
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Paket sudah termasuk lisensi software, dokumen arsitektur, panduan konfigurasi, dan dukungan SLA standar enterprise.
                </p>
                <Link
                  href={`/products/${product.slug}?order=true`}
                  className="block text-center w-full py-3.5 rounded-xl bg-[#2D9CFF] hover:bg-[#1E7EC8] text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95"
                >
                  Pesan Lisensi Software
                </Link>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
              <Shield className="w-4 h-4 text-[#2D9CFF]" /> Guaranteed Enterprise SLA Support
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

