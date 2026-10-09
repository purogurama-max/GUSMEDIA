import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-blue-50 text-[#2D9CFF] border border-blue-200 shadow-sm">
          Get In Touch
        </span>
        <h1 className="text-4xl font-black text-slate-900 mt-4">Contact Us</h1>
        <p className="mt-4 text-slate-600 font-medium">
          Get in touch with our team to discuss your software project.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-md flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#2D9CFF] flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Email Us</h3>
              <p className="text-sm font-medium text-slate-600 mt-0.5">info@gusmedia.com</p>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-md flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#2D9CFF] flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Call Us</h3>
              <p className="text-sm font-medium text-slate-600 mt-0.5">+62 21 5558 9000</p>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-md flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#2D9CFF] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Office Location</h3>
              <p className="text-sm font-medium text-slate-600 mt-0.5">Jakarta Tech Hub, Level 14, Indonesia</p>
            </div>
          </div>
        </div>

        <form className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-lg space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2D9CFF] focus:bg-white focus:ring-2 focus:ring-blue-500/10 font-medium transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2D9CFF] focus:bg-white focus:ring-2 focus:ring-blue-500/10 font-medium transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
            <textarea
              rows={4}
              placeholder="Tell us about your project requirements..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2D9CFF] focus:bg-white focus:ring-2 focus:ring-blue-500/10 font-medium transition-all"
            ></textarea>
          </div>
          <button
            type="button"
            className="w-full py-3.5 px-6 rounded-xl bg-[#2D9CFF] hover:bg-[#1E7EC8] text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all active:scale-95"
          >
            Send Message <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
