import { ExternalLink } from "lucide-react";

export default function PortfolioPage() {
  const portfolios = [
    { title: "National Logistics Dashboard", category: "System Integration", desc: "Real-time tracking and dispatch management system." },
    { title: "Fintech Payment Gateway", category: "Security & API", desc: "High-throughput transaction processing microservice." },
    { title: "Healthcare EMR Portal", category: "Web Development", desc: "Electronic medical record portal compliant with data standards." },
    { title: "Retail Inventory POS", category: "Custom Software", desc: "Multi-branch point of sale and stock syncing solution." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-blue-50 text-[#2D9CFF] border border-blue-200 shadow-sm">
          Case Studies
        </span>
        <h1 className="text-4xl font-black text-slate-900 mt-4">Client Success Portfolio</h1>
        <p className="mt-4 text-slate-600 font-medium">
          A showcase of systems and digital platforms we have engineered.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {portfolios.map((item, idx) => (
          <div key={idx} className="p-8 rounded-2xl bg-white border border-slate-200/90 hover:border-[#2D9CFF] hover:shadow-xl hover:shadow-blue-500/10 transition-all flex flex-col justify-between shadow-md">
            <div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-50 text-[#2D9CFF] border border-blue-100">
                {item.category}
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-4">{item.title}</h3>
              <p className="text-slate-600 text-sm mt-2 font-medium leading-relaxed">{item.desc}</p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D9CFF] hover:text-[#1E7EC8] cursor-pointer transition-colors">
                Case Study <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
