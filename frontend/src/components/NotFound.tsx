import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto w-full px-6 md:px-12 py-12 flex flex-col items-center text-center">
      <div className="font-serif font-bold text-[120px] leading-none tracking-tight text-zinc-950">
        4<span className="text-[#F27D26]">0</span>4
      </div>
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-zinc-950 mt-4">
        Lost in the cosmos
      </h1>
      <p className="text-zinc-500 font-sans text-base leading-relaxed mt-3 max-w-md">
        The page you're looking for has drifted beyond our orbit. Let's get you back to safe ground.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 px-8 py-3 bg-black hover:bg-[#F27D26] text-white text-xs font-mono font-bold uppercase tracking-wider rounded border border-black hover:border-[#F27D26] transition-colors"
      >
        <Home className="w-4 h-4" /> Back Home
      </Link>
    </div>
  );
}
