import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Centered Hero Section */}
      <section id="hero-heading-section" className="pt-20 pb-12 md:pt-28 md:pb-16 max-w-4xl mx-auto w-full px-6 text-center flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-serif text-[42px] sm:text-[52px] md:text-[64px] lg:text-[72px] font-normal tracking-tight text-zinc-950 leading-[1.1] mb-6"
        >
          Local Intelligence.<br />Specialized for Your Device.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-zinc-600 text-[14px] sm:text-[16px] md:text-[18px] leading-relaxed font-sans font-light">
            Helios develops small, fine-tuned language models designed for privacy and performance at the edge, running directly on personal hardware.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-8"
        >
          <Link
            to="/models"
            className="px-8 py-3 bg-black hover:bg-[#F27D26] text-white text-xs font-mono font-bold uppercase tracking-wider rounded border border-black hover:border-[#F27D26] transition-colors"
          >
            Explore Models
          </Link>
        </motion.div>
      </section>

      {/* DECENTRALIZING AI BLACK BANNER */}
      <section id="manifesto-card-section" className="max-w-7xl mx-auto w-full px-6 md:px-12 py-12 md:py-16">
        <div className="bg-[#0D0D0D] text-white rounded-2xl px-8 py-16 sm:px-12 sm:py-20 md:p-24 text-center shadow-xl border border-zinc-800 relative overflow-hidden group">
          {/* Clean, subtle geometric glow in background on hover */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(242,125,38,0.08),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="max-w-3xl mx-auto flex flex-col items-center space-y-6 relative z-10">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white max-w-2xl">
              Smarter local models.<br />Specially tuned for your niche.
            </h2>
            <p className="text-zinc-400 font-sans text-xs sm:text-sm md:text-base leading-relaxed max-w-xl font-light">
              We build small, state-of-the-art language models because we believe that everyone should have access to local models which are smarter in specific niches—running fully offline, fast, and with secure client control.
            </p>

            <div className="pt-4">
              <Link
                to="/manifesto"
                className="font-mono text-xs font-bold uppercase tracking-widest text-[#F27D26] hover:text-white transition-all inline-flex items-center gap-2 group/btn"
              >
                <span className="border-b-2 border-[#F27D26] group-hover/btn:border-white pb-0.5 transition-colors">Read Our Manifesto</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
