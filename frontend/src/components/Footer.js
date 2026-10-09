import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 text-slate-600 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link href="/" className="inline-block">
            <img src="/logo.jpg" alt="GUSMEDIA Logo" className="h-12 w-auto object-contain" />
          </Link>
          <p className="text-sm leading-relaxed text-slate-500">
            Empowering modern enterprises with scalable software engineering, cloud architectures, and innovative SaaS solutions.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm font-medium">
            <li><Link href="/" className="hover:text-[#2D9CFF] transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-[#2D9CFF] transition-colors">About Us</Link></li>
            <li><Link href="/services" className="hover:text-[#2D9CFF] transition-colors">Services</Link></li>
            <li><Link href="/products" className="hover:text-[#2D9CFF] transition-colors">Products</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-4">Solutions</h4>
          <ul className="space-y-2 text-sm font-medium">
            <li><Link href="/services" className="hover:text-[#2D9CFF] transition-colors">Custom Software</Link></li>
            <li><Link href="/services" className="hover:text-[#2D9CFF] transition-colors">Cloud Architecture</Link></li>
            <li><Link href="/services" className="hover:text-[#2D9CFF] transition-colors">System Integration</Link></li>
            <li><Link href="/services" className="hover:text-[#2D9CFF] transition-colors">Enterprise Security</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-4">Contact Info</h4>
          <ul className="space-y-2 text-sm font-medium text-slate-500">
            <li>Jakarta Tech Hub, Level 14</li>
            <li>info@gusmedia.com</li>
            <li>+62 21 5558 9000</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-100 text-xs text-center text-slate-400 font-medium">
        © {new Date().getFullYear()} GUSMEDIA. All rights reserved.
      </div>
    </footer>
  );
}
