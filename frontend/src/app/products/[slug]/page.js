import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProductBySlug, formatCurrency } from "@/services/productService";
import { CheckCircle2, Shield, Cpu, Server, ArrowLeft, ShoppingBag } from "lucide-react";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <span className="text-xs font-semibold px-3 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {product.category_name || "Enterprise"}
            </span>
            <h1 className="text-4xl font-extrabold text-white mt-4">{product.name}</h1>
            
            {product.image && (
              <div className="mt-6 w-full h-72 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
            )}

            <p className="text-slate-300 text-lg mt-6 leading-relaxed">{product.description}</p>
          </div>

          {/* Key Features */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" /> Key Features
            </h2>
            <ul className="space-y-3">
              {features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Specifications */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-400" /> Technical Specifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(specifications).map(([key, val], idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xs text-slate-500 capitalize">{key}</div>
                  <div className="text-sm font-medium text-slate-200 mt-1">{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Card / Form */}
        <div className="space-y-6">
          <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <div>
                <div className="text-xs text-slate-400">License Price</div>
                <div className="text-2xl font-bold text-cyan-400 mt-1">{formatCurrency(product.price)}</div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {product.status || "ACTIVE"}
              </span>
            </div>

            {isOrderMode ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                  <ShoppingBag className="w-4 h-4" /> Place Order Request
                </div>
                <form className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      placeholder="PT Example Indonesia"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Contact Email</label>
                    <input
                      type="email"
                      placeholder="procurement@company.com"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Quantity</label>
                    <input
                      type="number"
                      defaultValue={1}
                      min={1}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <button
                    type="button"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all mt-2"
                  >
                    Submit Order Request
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Includes software source/license package, configuration support, and standard SLA maintenance.
                </p>
                <Link
                  href={`/products/${product.slug}?order=true`}
                  className="block text-center w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-bold shadow-lg shadow-cyan-500/25 transition-all"
                >
                  Order Software Now
                </Link>
              </div>
            )}

            <div className="pt-4 border-t border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-500">
              <Shield className="w-4 h-4 text-slate-400" /> Guaranteed Enterprise SLA Support
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
