import { Cpu, RefreshCw, EyeOff } from "lucide-react";

export default function AboutView() {
  const values = [
    {
      icon: EyeOff,
      title: "Zero Inbound Telemetry",
      description: "Our software features absolutely no remote tracking code or telemetry. When you query a Helios model, your input never leaves your machine's volatile cache memory."
    },
    {
      icon: Cpu,
      title: "Edge Efficiency Standard",
      description: "Rather than routing simple tasks through multi-billion dollar centralized data farms, we build highly-specialized neural models that excel directly on raw local silicon."
    },
    {
      icon: RefreshCw,
      title: "Absolute Permanent Offline",
      description: "If the network cuts out or goes dark, your intelligence toolset remains completely uninterrupted. It resides permanently on your hardware, under your roof."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto w-full px-6 md:px-12 py-12">
      {/* Title Header */}
      <div className="mb-8 md:mb-10 space-y-2 text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-zinc-950 tracking-tight">About Helios</h2>
        <p className="text-zinc-500 font-sans md:text-lg max-w-xl mx-auto">A collective dedicated to decentralized edge intelligence and physical data sovereignty.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-zinc-200 p-6 md:p-8 rounded-lg space-y-4">
          <h3 className="font-serif text-xl text-zinc-950 font-bold mb-2">Our Mission</h3>
          <p className="text-sm text-zinc-600 font-sans leading-relaxed">
            Helios is an open-scientific research lab and product collective founded in early 2026. 
            Our focus is the preservation of human intellectual privacy and data custody in the age of generative intelligence.
          </p>
          <p className="text-sm text-zinc-600 font-sans leading-relaxed">
            We believe that routing every question, thought, draft, and file through Hyper-Scaled central databases represents 
            an unprecedented risk to cognitive autonomy. If third parties catalog and monitor every step of human ideation, 
            true innovation is compromised.
          </p>
          <p className="text-sm text-zinc-600 font-sans leading-relaxed">
            The solution is already sitting on our desks. Modern laptops, smartphones, and single-board computers 
            feature massive neural processing hardware that is highly underutilized. By designing compact, highly-specialized, 
            quantized language and code architectures, we unlock this offline compute potential.
          </p>
        </div>

        {/* Three Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div key={idx} className="p-5 bg-zinc-50 border border-zinc-200 rounded">
                <Icon className="w-5 h-5 text-[#F27D26] mb-2" />
                <h4 className="font-serif font-bold text-zinc-950 text-sm mb-1">{v.title}</h4>
                <p className="text-xs text-zinc-500 font-sans leading-relaxed">{v.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
