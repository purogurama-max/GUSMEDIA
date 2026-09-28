import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-blue-500/20">
              <img src="/logo.jpg" alt="PROXIMEDIA Logo" className="w-full h-full object-cover" />
            </div>
            <Link href="/" className="text-xl font-extrabold tracking-tight text-slate-900">
              PROXI<span className="text-[#2D9CFF]">MEDIA</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="/" className="hover:text-[#2D9CFF] transition-colors">Home</Link>
            <Link href="/about" className="hover:text-[#2D9CFF] transition-colors">About</Link>
            <Link href="/services" className="hover:text-[#2D9CFF] transition-colors">Services</Link>
            <Link href="/products" className="hover:text-[#2D9CFF] transition-colors">Products</Link>
            <Link href="/portfolio" className="hover:text-[#2D9CFF] transition-colors">Portfolio</Link>
            <Link href="/contact" className="hover:text-[#2D9CFF] transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#2D9CFF] hover:bg-[#1E7EC8] text-white shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
