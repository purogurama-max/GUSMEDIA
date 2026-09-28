import Link from "next/link";
import { Code2, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { fetchProducts, formatCurrency } from "@/services/productService";

export const revalidate = 0; // Dynamic fetching

export default async function ProductsPage() {
  const response = await fetchProducts();
  const products = response?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-blue-50 text-[#2D9CFF] border border-blue-200 shadow-sm">
          Software Catalog
        </span>
        <h1 className="text-4xl font-black text-slate-900 mt-4">Enterprise Software Solutions</h1>
        <p className="mt-4 text-slate-600 font-medium">
          Explore our ready-to-deploy software products built for reliability, security, and scale.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 p-8 rounded-2xl bg-slate-50 border border-slate-200">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">Belum Ada Produk Tersedia</h3>
          <p className="text-slate-500 text-sm mt-1">Produk akan segera ditampilkan setelah ditambahkan ke database backend.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="p-8 rounded-2xl bg-white border border-slate-200/90 hover:border-[#2D9CFF] hover:shadow-xl hover:shadow-blue-500/10 transition-all flex flex-col justify-between shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                    {product.category_name || "General"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> {product.status || "ACTIVE"}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  {product.image ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 text-[#2D9CFF] flex items-center justify-center font-bold flex-shrink-0">
                      <Code2 className="w-7 h-7" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{product.name}</h2>
                    <span className="text-xs text-slate-400 font-medium">{product.category_name || "Enterprise Solution"}</span>
                  </div>
                </div>

                <p className="text-slate-600 text-sm mt-3 leading-relaxed font-medium">
                  {product.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Starting Price</div>
                  <div className="text-[#2D9CFF] font-black text-2xl">
                    {formatCurrency(product.price)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/products/${product.slug}`}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1 active:scale-95"
                  >
                    View Detail <ArrowRight className="w-3 h-3" />
                  </Link>
                  <Link
                    href={`/products/${product.slug}?order=true`}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#2D9CFF] hover:bg-[#1E7EC8] text-white shadow-md shadow-blue-500/20 transition-all active:scale-95"
                  >
                    Order Software
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
