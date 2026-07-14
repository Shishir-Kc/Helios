import { Cpu, Hammer } from "lucide-react";

export default function ModelExplorer() {
  return (
    <div className="max-w-3xl mx-auto w-full px-6 md:px-12 py-12">
      <div className="mb-8 md:mb-10 space-y-2 text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-zinc-950 tracking-tight">Helios Model Hub</h2>
        <p className="text-zinc-500 font-sans md:text-lg max-w-xl mx-auto">
          On-device, privacy-first language models tuned for your hardware.
        </p>
      </div>

      <div className="p-10 md:p-16 bg-white border border-zinc-200 rounded-2xl flex flex-col items-center text-center shadow-sm">
        <div className="p-4 bg-zinc-50 border border-zinc-200 text-[#F27D26] rounded-full mb-6">
          <Hammer className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl md:text-3xl text-zinc-950 font-bold mb-3">
          Models Under Development
        </h3>
        <p className="text-zinc-500 font-sans text-base leading-relaxed max-w-md">
          We're actively fine-tuning and quantizing the first Helios model families.
          Check back soon — local, offline intelligence is on the way.
        </p>
        <div className="mt-6 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
          <Cpu className="w-4 h-4" />
          <span>The Sun Is Rising</span>
        </div>
      </div>
    </div>
  );
}
