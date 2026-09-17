import { Braces, Hammer } from "lucide-react";

export default function Tokenizers() {
  return (
    <div className="max-w-5xl mx-auto w-full px-6 md:px-12 py-12">
      <div className="mb-8 md:mb-10 space-y-2 text-center">
        <h1 className="text-3xl md:text-4xl font-serif text-zinc-950 tracking-tight">
          Helios Tokenizers
        </h1>
        <p className="text-zinc-500 font-sans md:text-lg max-w-xl mx-auto">
          Tokenization tools and resources for running Helios models locally.
        </p>
      </div>
      <div className="p-10 md:p-16 bg-white border border-zinc-200 rounded-2xl flex flex-col items-center text-center shadow-sm">
        <div className="p-4 bg-zinc-50 border border-zinc-200 text-[#F27D26] rounded-full mb-6">
          <Hammer className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl md:text-3xl text-zinc-950 font-bold mb-3">
          Tokenizers Under Development
        </h2>
        <p className="text-zinc-500 font-sans text-base leading-relaxed max-w-md">
          We&apos;re preparing tokenizer tools and documentation for the Helios ecosystem. Check back soon.
        </p>
        <div className="mt-6 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
          <Braces className="w-4 h-4" />
          <span>The Sun Is Rising</span>
        </div>
      </div>
    </div>
  );
}
