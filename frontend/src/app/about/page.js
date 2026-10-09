export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-blue-50 text-[#2D9CFF] border border-blue-200 shadow-sm">
          Our Story
        </span>
        <h1 className="text-4xl font-black text-slate-900 mt-4">About GUSMEDIA</h1>
        <p className="mt-4 text-slate-600 text-lg font-medium">
          We build enterprise software that powers modern businesses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-md">
            <h2 className="text-2xl font-bold text-[#2D9CFF] mb-2">Our Vision</h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              To become a leading global software development partner known for engineered excellence, reliable systems, and seamless user experiences.
            </p>
          </div>
          <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-md">
            <h2 className="text-2xl font-bold text-[#2D9CFF] mb-2">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              Deliver robust, secure, and scalable software solutions that enable clients to streamline operational workflows and scale efficiently.
            </p>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-md space-y-5">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Technology Stack We Use</h3>
          <div className="flex flex-wrap gap-2.5">
            {["Node.js", "Express.js", "React", "Next.js", "PostgreSQL", "Tailwind CSS", "Docker", "REST API", "JWT", "Git"].map((tech, idx) => (
              <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-xs font-bold text-[#2D9CFF] border border-blue-100 shadow-xs">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
