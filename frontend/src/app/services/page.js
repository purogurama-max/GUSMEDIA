import { Code2, Server, Smartphone, RefreshCw, Database, ShieldCheck, Wrench } from "lucide-react";

export default function ServicesPage() {
  const services = [
    { title: "Software Development", icon: Code2, desc: "End-to-end custom software solutions tailored to business requirements." },
    { title: "Web Development", icon: Server, desc: "Fast, responsive, and SEO-optimized modern web applications." },
    { title: "Mobile Development", icon: Smartphone, desc: "Native and cross-platform mobile apps for iOS and Android." },
    { title: "System Integration", icon: RefreshCw, desc: "Connect legacy systems with modern REST APIs and cloud services." },
    { title: "Database Development", icon: Database, desc: "PostgreSQL database design, optimization, and data migration." },
    { title: "Custom Software & Maintenance", icon: Wrench, desc: "Ongoing maintenance, SLA support, and continuous enhancement." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-blue-50 text-[#2D9CFF] border border-blue-200 shadow-sm">
          What We Offer
        </span>
        <h1 className="text-4xl font-black text-slate-900 mt-4">Our Engineering Services</h1>
        <p className="mt-4 text-slate-600 font-medium">
          Professional technology services tailored to grow and secure your digital assets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((svc, idx) => {
          const IconComponent = svc.icon;
          return (
            <div key={idx} className="p-7 rounded-2xl bg-white border border-slate-200/90 hover:border-[#2D9CFF] hover:shadow-xl hover:shadow-blue-500/10 transition-all shadow-md">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-[#2D9CFF] flex items-center justify-center mb-5">
                <IconComponent className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{svc.title}</h3>
              <p className="text-slate-600 text-sm mt-2 font-medium leading-relaxed">{svc.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
