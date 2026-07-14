/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Menu, X, Lock, Clock, WifiOff, ArrowRight } from "lucide-react";
import ModelExplorer from "./components/ModelExplorer";
import Manifesto from "./components/Manifesto";
import ResearchView from "./components/ResearchView";
import PapersView from "./components/PapersView";
import DocsView from "./components/DocsView";
import AboutView from "./components/AboutView";
import PaperDetail from "./components/PaperDetail";

type PageType = "home" | "models" | "research" | "papers" | "docs" | "about" | "manifesto";

const LOGO_LETTERS: { ch: string; keep: boolean }[] = [
  { ch: "H", keep: true },
  { ch: "E", keep: false },
  { ch: "L", keep: false },
  { ch: "I", keep: true },
  { ch: "O", keep: false },
  { ch: "S", keep: false },
];


interface PaperDetailState {
  category: string;
  slug: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [paperDetail, setPaperDetail] = useState<PaperDetailState | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigateToPage = (page: PageType) => {
    setCurrentPage(page);
    setPaperDetail(null);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const openPaper = (category: string, slug: string) => {
    setPaperDetail({ category, slug });
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const closePaper = () => {
    setPaperDetail(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-zinc-900 font-sans relative overflow-x-clip flex flex-col">
      {/* Header Navigation */}
      <header id="main-header" className="max-w-7xl mx-auto w-full px-6 md:px-12 py-8 flex items-center justify-between sticky top-0 bg-[#FAF9F6]/90 backdrop-blur-md z-30 border-b border-zinc-200/40">
        <div className="flex flex-col">
          <button
            onClick={() => navigateToPage("home")}
            className="flex items-baseline font-serif font-bold text-3xl tracking-tight text-black select-none hover:opacity-80 transition-opacity cursor-pointer text-left"
          >
            {LOGO_LETTERS.map((l, i) => (
              <span
                key={i}
                className={`inline-block overflow-hidden whitespace-nowrap transition-all duration-300 ${
                  l.keep
                    ? "opacity-100 max-w-[1em]"
                    : scrolled
                      ? "opacity-0 max-w-0"
                      : "opacity-100 max-w-[1em]"
                }`}
              >
                {l.ch}
              </span>
            ))}
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-10 text-sm font-mono font-bold uppercase tracking-wider">
          <button 
            onClick={() => navigateToPage("home")}
            className={`transition-all duration-200 cursor-pointer pb-1 border-b-2 ${
              currentPage === "home" ? "text-black border-black" : "text-zinc-500 hover:text-black border-transparent"
            }`}
          >
            Home
          </button>
          <button 
            onClick={() => navigateToPage("models")}
            className={`transition-all duration-200 cursor-pointer pb-1 border-b-2 ${
              currentPage === "models" ? "text-black border-black" : "text-zinc-500 hover:text-black border-transparent"
            }`}
          >
            Models
          </button>
          <button 
            onClick={() => navigateToPage("research")}
            className={`transition-all duration-200 cursor-pointer pb-1 border-b-2 ${
              currentPage === "research" ? "text-black border-black" : "text-zinc-500 hover:text-black border-transparent"
            }`}
          >
            Research
          </button>
          <button 
            onClick={() => navigateToPage("papers")}
            className={`transition-all duration-200 cursor-pointer pb-1 border-b-2 ${
              currentPage === "papers" ? "text-black border-black" : "text-zinc-500 hover:text-black border-transparent"
            }`}
          >
            Papers
          </button>
          <button 
            onClick={() => navigateToPage("docs")}
            className={`transition-all duration-200 cursor-pointer pb-1 border-b-2 ${
              currentPage === "docs" ? "text-black border-black" : "text-zinc-500 hover:text-black border-transparent"
            }`}
          >
            Docs
          </button>
          <button 
            onClick={() => navigateToPage("about")}
            className={`transition-all duration-200 cursor-pointer pb-1 border-b-2 ${
              currentPage === "about" ? "text-black border-black" : "text-zinc-500 hover:text-black border-transparent"
            }`}
          >
            About
          </button>
        </nav>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-zinc-600 hover:text-black focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Dropdown Menu */}
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isMobileMenuOpen ? "auto" : 0, opacity: isMobileMenuOpen ? 1 : 0 }}
        className="md:hidden overflow-hidden bg-[#FAF9F6] border-b border-zinc-200 px-6 absolute w-full left-0 top-[96px] z-20"
      >
        <div className="flex flex-col space-y-4 py-6 pb-8 text-sm font-mono font-bold uppercase tracking-wider items-start">
          <button 
            onClick={() => navigateToPage("home")}
            className={`text-left pb-0.5 border-b-2 ${
              currentPage === "home" ? "text-black border-black" : "text-zinc-500 hover:text-black border-transparent"
            }`}
          >
            Home
          </button>
          <button 
            onClick={() => navigateToPage("models")}
            className={`text-left pb-0.5 border-b-2 ${
              currentPage === "models" ? "text-black border-black" : "text-zinc-500 hover:text-black border-transparent"
            }`}
          >
            Models
          </button>
          <button 
            onClick={() => navigateToPage("research")}
            className={`text-left pb-0.5 border-b-2 ${
              currentPage === "research" ? "text-black border-black" : "text-zinc-500 hover:text-black border-transparent"
            }`}
          >
            Research
          </button>
          <button 
            onClick={() => navigateToPage("papers")}
            className={`text-left pb-0.5 border-b-2 ${
              currentPage === "papers" ? "text-black border-black" : "text-zinc-500 hover:text-black border-transparent"
            }`}
          >
            Papers
          </button>
          <button 
            onClick={() => navigateToPage("docs")}
            className={`text-left pb-0.5 border-b-2 ${
              currentPage === "docs" ? "text-black border-black" : "text-zinc-500 hover:text-black border-transparent"
            }`}
          >
            Docs
          </button>
          <button 
            onClick={() => navigateToPage("about")}
            className={`text-left pb-0.5 border-b-2 ${
              currentPage === "about" ? "text-black border-black" : "text-zinc-500 hover:text-black border-transparent"
            }`}
          >
            About
          </button>
        </div>
      </motion.div>

      {/* Active Page Route Rendering */}
      <main className="flex-grow flex flex-col">
        {currentPage === "home" && (
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
                <button
                  onClick={() => navigateToPage("models")}
                  className="px-8 py-3 bg-black hover:bg-[#F27D26] text-white text-xs font-mono font-bold uppercase tracking-wider rounded border border-black hover:border-[#F27D26] transition-colors cursor-pointer"
                >
                  Explore Models
                </button>
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
                    <button
                      onClick={() => navigateToPage("manifesto")}
                      className="font-mono text-xs font-bold uppercase tracking-widest text-[#F27D26] hover:text-white transition-all inline-flex items-center gap-2 cursor-pointer group/btn"
                    >
                      <span className="border-b-2 border-[#F27D26] group-hover/btn:border-white pb-0.5 transition-colors">Read Our Manifesto</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Other Pages */}
        {paperDetail ? (
          <PaperDetail
            category={paperDetail.category}
            slug={paperDetail.slug}
            onBack={closePaper}
          />
        ) : (
          <>
            {currentPage === "models" && <ModelExplorer />}
            {currentPage === "research" && (
              <ResearchView onOpenPaper={(slug) => openPaper("research", slug)} />
            )}
            {currentPage === "papers" && (
              <PapersView onOpenPaper={(slug) => openPaper("papers", slug)} />
            )}
            {currentPage === "docs" && (
              <DocsView onOpenPaper={(slug) => openPaper("docs", slug)} />
            )}
            {currentPage === "about" && <AboutView />}
            {currentPage === "manifesto" && <Manifesto />}
          </>
        )}
      </main>

      {/* Clean Minimalist Footer */}
      <footer className="border-t border-zinc-200 bg-[#FAF9F6] py-20 mt-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center gap-8 text-center">
          <div className="font-serif font-bold text-3xl text-black">
            HELIOS
          </div>
          <div className="text-sm font-mono uppercase tracking-[0.35em] text-[#F27D26]">
            The Sun Is Rising
          </div>
          
          <div className="flex flex-col items-center gap-5 text-sm font-mono font-bold uppercase tracking-wider text-zinc-500">
            <div className="flex flex-wrap gap-8 justify-center">
              <button onClick={() => navigateToPage("research")} className="hover:text-black transition-colors cursor-pointer">Research</button>
              <button onClick={() => navigateToPage("docs")} className="hover:text-black transition-colors cursor-pointer">Docs</button>
              <button onClick={() => navigateToPage("papers")} className="hover:text-black transition-colors cursor-pointer">Papers</button>
              <button onClick={() => navigateToPage("about")} className="hover:text-black transition-colors cursor-pointer">Company</button>
            </div>
            <div className="text-xs text-zinc-400 font-mono tracking-wide font-normal lowercase">
              &copy; 2026 helios systems inc. all rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
