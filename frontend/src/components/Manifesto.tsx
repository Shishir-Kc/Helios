import React, { useState, useEffect } from "react";
import { Shield, Compass, Sparkles, Check, Send } from "lucide-react";

export default function Manifesto() {
  const [signature, setSignature] = useState("");
  const [signedList, setSignedList] = useState<string[]>([]);
  const [hasSigned, setHasSigned] = useState(false);

  useEffect(() => {
    const savedSignatures = localStorage.getItem("helios_signatures");
    if (savedSignatures) {
      setSignedList(JSON.parse(savedSignatures));
    } else {
      const initial = ["vance.eth", "thorne.sh", "null_kernel", "pixel_craft"];
      setSignedList(initial);
      localStorage.setItem("helios_signatures", JSON.stringify(initial));
    }

    const signed = localStorage.getItem("helios_user_signed");
    if (signed) {
      setHasSigned(true);
    }
  }, []);

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signature.trim()) return;

    const newList = [...signedList, signature.trim()];
    setSignedList(newList);
    localStorage.setItem("helios_signatures", JSON.stringify(newList));
    localStorage.setItem("helios_user_signed", "true");
    setHasSigned(true);
    setSignature("");
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-6 md:px-12 py-12 space-y-12">
      {/* Manifesto Title */}
      <div className="text-center pb-8 border-b border-zinc-200">
        <span className="text-xs uppercase tracking-[0.3em] text-[#F27D26] font-mono font-bold block mb-2">// THE HELIOS MANIFESTO</span>
        <h1 className="font-serif text-3xl md:text-5xl text-zinc-950 tracking-tight leading-tight font-bold">
          Sovereignty of Mind
        </h1>
        <p className="text-xs font-mono text-zinc-400 mt-4 tracking-wide uppercase">
          Published July 2026 • By the Helios Core Team
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded border border-zinc-200 bg-zinc-50 hover:bg-zinc-100/50 transition-colors">
          <Shield className="w-6 h-6 text-[#F27D26] mb-3" />
          <h3 className="font-serif font-bold text-zinc-900 text-base mb-1">Zero Telemetry</h3>
          <p className="text-xs text-zinc-600 font-sans leading-relaxed">
            Your queries never cross WAN boundaries. Your data exists only inside your on-device RAM cache.
          </p>
        </div>
        <div className="p-5 rounded border border-zinc-200 bg-zinc-50 hover:bg-zinc-100/50 transition-colors">
          <Compass className="w-6 h-6 text-[#F27D26] mb-3" />
          <h3 className="font-serif font-bold text-zinc-900 text-base mb-1">100% Sovereign</h3>
          <p className="text-xs text-zinc-600 font-sans leading-relaxed">
            Permanent access. Works in deep bunkers, flight cabins, or during wide-scale network outages.
          </p>
        </div>
        <div className="p-5 rounded border border-zinc-200 bg-zinc-50 hover:bg-zinc-100/50 transition-colors">
          <Sparkles className="w-6 h-6 text-[#F27D26] mb-3" />
          <h3 className="font-serif font-bold text-zinc-900 text-base mb-1">Ultra-Specialized</h3>
          <p className="text-xs text-zinc-600 font-sans leading-relaxed">
            Pruned, distilled, and fine-tuned models built for specific hardware architectures.
          </p>
        </div>
      </div>

      {/* Editorial Content */}
      <div className="space-y-8 font-sans text-zinc-700 leading-relaxed text-base border-t border-zinc-200 pt-8">
        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-zinc-950 font-bold mb-2">1. The Centralization Crisis</h2>
          <p>
            Today, human thought is routed through central hubs. The tools we use to synthesize our thoughts, organize our days, and spark our creativity are increasingly controlled by a handful of remote, hyper-scaled cloud platforms. This arrangement presents an unprecedented risk. When every intellectual query is recorded, cataloged, and processed on remote hardware, human intellectual sovereignty is compromised.
          </p>
          <p>
            Centralized AI turns personal context into a rental commodity. It subjects your most intimate thoughts to remote terms of service, telemetry, and permanent digital logging.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-zinc-950 font-bold mb-2">2. The Solution: Local Intelligence</h2>
          <p>
            We believe general intelligence should belong to the individual. It should reside on the hardware you own, under the physical roof you live under, governed by the keys only you hold.
          </p>
          <p>
            Helios is built on the premise that small, highly-specialized models are the path forward. By focusing on extreme pruning, native quantization, and on-device instruction alignment, we deliver models that compete with massive cloud APIs in speed, utility, and reasoning—while running entirely offline.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-zinc-950 font-bold mb-2">3. Privacy is Not a Feature; It is the Foundation</h2>
          <p>
            Privacy is not something we toggle on or off in a settings panel. It is the default state of local computation. When intelligence runs on your device:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-zinc-600">
            <li><strong>Zero Telemetry</strong>: No logs are transmitted to any remote servers.</li>
            <li><strong>Permanent Offline Availability</strong>: Your tools work in flight cabins, remote basements, and during infrastructure blackouts.</li>
            <li><strong>Total Security</strong>: Sensitive medical, legal, and financial data never leaves your system RAM.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-zinc-950 font-bold mb-2">4. The Edge Revolution</h2>
          <p>
            The hardware of tomorrow is designed for intelligence. Modern laptops, phones, and single-board computers feature dedicated neural hardware that sits idle most of the day. Helios unlocks this latent power.
          </p>
          <p>
            We do not need multi-billion dollar datacenters to synthesize ideas, rewrite emails, or format structured data. We need specialized, precise edge models.
          </p>
        </section>

        <div className="pt-8 text-center font-serif text-zinc-900 italic text-lg">
          "Join us in reclaiming the decentralized mind."
        </div>
      </div>

      {/* Signature Module (Interactive Offline Component) */}
      <div className="p-6 md:p-8 bg-zinc-50 border border-zinc-200 rounded-lg space-y-6">
        <div>
          <h3 className="font-serif text-xl text-zinc-950 font-bold">Sign the Manifesto</h3>
          <p className="text-xs text-zinc-500 mt-1">Commit to local data sovereignty. Signatures are persisted 100% locally on your browser cache.</p>
        </div>

        {hasSigned ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-sm font-mono flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Thank you for supporting decentralization. Your local signature is cataloged.</span>
          </div>
        ) : (
          <form onSubmit={handleSign} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter your alias or name..."
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F27D26] focus:border-[#F27D26] bg-white text-sm"
              maxLength={25}
            />
            <button
              type="submit"
              className="bg-zinc-950 hover:bg-[#F27D26] hover:text-white text-white px-5 py-2 rounded text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              Sign <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <div className="border-t border-zinc-200 pt-4">
          <span className="block text-[10px] text-zinc-400 uppercase tracking-widest font-mono mb-2">Sovereign Signers Offline Ledger</span>
          <div className="flex flex-wrap gap-2">
            {signedList.map((name, idx) => (
              <span key={idx} className="bg-white border border-zinc-200 px-2.5 py-1 text-xs rounded font-mono text-zinc-600">
                ✍️ {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
