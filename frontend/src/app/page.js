import Link from "next/link";
import { Code2, ShieldCheck, Cpu, ArrowRight, Layers, Database, CheckCircle2, Package } from "lucide-react";
import { fetchProducts, formatCurrency } from "@/services/productService";

export const revalidate = 0; // Dynamic fetching

export default async function Home() {
  const response = await fetchProducts({ limit: 3, status: 'ACTIVE' });
  const featuredProducts = response?.data || [];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-[#2D9CFF] text-xs font-bold tracking-wide mb-6 shadow-sm">
            <span>✨ Enterprise Software Solutions</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            Architecting Next-Generation <span className="text-[#2D9CFF]">Digital Platforms</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            PROXIMEDIA delivers high-performance custom software, ERP systems, and cloud architectures built for scalability and security.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              className="px-7 py-3.5 rounded-xl font-bold bg-[#2D9CFF] hover:bg-[#1E7EC8] text-white shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all active:scale-95"
            >
              Explore Products <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-7 py-3.5 rounded-xl font-bold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 shadow-sm transition-all active:scale-95"
            >
              Contact Engineering Team
            </Link>
          </div>
        </div>
      </section>

      {/* Company Intro */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 md:p-12 rounded-2xl bg-white border border-slate-200/80 flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-slate-200/50">
          <div className="space-y-4 md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Who We Are</h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              We are a team of senior software engineers, system architects, and tech consultants dedicated to driving digital transformation for forward-thinking businesses.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:w-1/2 w-full">
            <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-100 text-center">
              <div className="text-3xl font-black text-[#2D9CFF]">99.9%</div>
              <div className="text-xs font-bold text-slate-600 mt-1">Uptime Guaranteed</div>
            </div>
            <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-100 text-center">
              <div className="text-3xl font-black text-[#2D9CFF]">150+</div>
              <div className="text-xs font-bold text-slate-600 mt-1">Projects Delivered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Software Products Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">Featured Software Products</h2>
          <p className="text-slate-500 mt-2 font-medium">Ready-to-deploy SaaS & Enterprise Products</p>
        </div>
        
        {featuredProducts.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-sm">
            Belum ada produk unggulan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((prod) => (
              <div key={prod.id} className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-[#2D9CFF] hover:shadow-xl hover:shadow-blue-500/10 transition-all flex flex-col justify-between shadow-md">
                <div>
                  {prod.image ? (
                    <div className="w-full h-48 rounded-xl overflow-hidden mb-5 border border-slate-100 bg-slate-50">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 text-[#2D9CFF] flex items-center justify-center mb-5 font-bold">
                      <Code2 className="w-7 h-7" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-slate-900">{prod.name}</h3>
                  <p className="text-slate-600 text-sm mt-2 font-medium leading-relaxed line-clamp-2">{prod.description}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[#2D9CFF] font-black text-lg">{formatCurrency(prod.price)}</span>
                  <Link href={`/products/${prod.slug}`} className="text-xs font-bold text-[#2D9CFF] hover:text-[#1E7EC8] flex items-center gap-1 transition-colors">
                    View Detail <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">Why Choose PROXIMEDIA</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2D9CFF] flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Bank-Grade Security</h3>
            <p className="text-slate-600 text-sm mt-2 font-medium leading-relaxed">Built with strict authentication, authorization, and data encryption standards.</p>
          </div>
          <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2D9CFF] flex items-center justify-center mb-5">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">High Scalability</h3>
            <p className="text-slate-600 text-sm mt-2 font-medium leading-relaxed">Designed to handle heavy concurrent traffic without compromising response times.</p>
          </div>
          <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2D9CFF] flex items-center justify-center mb-5">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Modular Architecture</h3>
            <p className="text-slate-600 text-sm mt-2 font-medium leading-relaxed">Easy to maintain, upgrade, and integrate with third-party APIs.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
