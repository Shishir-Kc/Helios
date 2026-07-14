import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, FileText, ShieldCheck, Cpu, Check, Copy } from "lucide-react";

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: "research" | "papers" | "docs" | "about" | null;
  setActiveTab: (tab: "research" | "papers" | "docs" | "about" | null) => void;
}

const RESEARCH_PAPERS = [
  {
    title: "Integer Activation Quantization for Low-Power NPUs",
    authors: "Helios Research Group (A. Vance, L. Thorne)",
    date: "June 2026",
    abstract: "We introduce a novel pruning metric that isolates activation-heavy attention pathways, reducing integer representation loss by 42% on ultra-mobile processors.",
    tags: ["Quantization", "NPU Optimization", "Edge ML"]
  },
  {
    title: "Stateful Decoupled Attention Models on Local Runtimes",
    authors: "Helios Labs in collab with Decentralized AI Alliance",
    date: "April 2026",
    abstract: "By splitting token-state buffers between WebGPU cache and device RAM, we achieve up to 32k context lengths on standard 8GB RAM systems without swapping stalls.",
    tags: ["Context Windows", "WebGPU", "Memory Mapping"]
  }
];

const ACADEMIC_PUBLICATIONS = [
  {
    title: "Sovereign Weights: The Case for Absolute Local Inference",
    authors: "Thorne, L. & Vance, A. (Preprint)",
    date: "May 2026"
  },
  {
    title: "Decentralized Cognitive Nodes and Local Telemetry Containment",
    authors: "Helios Security Working Group",
    date: "March 2026"
  }
];

const CODE_EXAMPLES = [
  {
    title: "1. Instantiate the Edge Client",
    description: "Install our native NPM wrapper to load any pruned Helios weights directly via WebGPU in the browser.",
    language: "javascript",
    code: `import { HeliosClient } from "@helios-labs/sdk";

const client = await HeliosClient.load({
  model: "helios-phi3-3b-awq",
  precision: "int4",
  onProgress: (p) => console.log(\`Loading: \${p}%\`)
});`
  },
  {
    title: "2. Generate Zero-Telemetry Inference",
    description: "Execute structured prompt arrays strictly inside your active device session tab, with local state buffering.",
    language: "javascript",
    code: `const response = await client.generate({
  prompt: "Synthesize the core tenets of cognitive sovereignty.",
  temperature: 0.2,
  maxTokens: 512
});

console.log(response.text);`
  }
];

export default function NavigationDrawer({ isOpen, onClose, activeTab, setActiveTab }: NavigationDrawerProps) {
  const [copiedSnippetIdx, setCopiedSnippetIdx] = useState<number | null>(null);

  const tabs = [
    { id: "research", label: "Research" },
    { id: "papers", label: "Papers" },
    { id: "docs", label: "Docs" },
    { id: "about", label: "About" }
  ] as const;

  useEffect(() => {
    if (isOpen && !activeTab) {
      setActiveTab("research");
    }
  }, [isOpen, activeTab, setActiveTab]);

  const handleCopy = (idx: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetIdx(idx);
    setTimeout(() => setCopiedSnippetIdx(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="navigation-drawer-modal" className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-2xl h-full bg-[#FAF9F6] border-l border-zinc-200 shadow-2xl flex flex-col z-10 text-zinc-900"
          >
            {/* Header / Tabs */}
            <div className="p-6 border-b border-zinc-200 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">HELIOS KNOWLEDGE BASE</span>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400 hover:text-zinc-900 cursor-pointer"
                  aria-label="Close panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Selector Buttons */}
              <div className="flex border-b border-zinc-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 pb-3 text-sm font-medium transition-all relative font-sans cursor-pointer ${
                      activeTab === tab.id ? "text-zinc-950 font-semibold" : "text-zinc-400 hover:text-zinc-800"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="active-nav-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab || "empty"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  {/* Research Tab */}
                  {activeTab === "research" && (
                    <div className="space-y-6">
                      <div className="pb-4 border-b border-zinc-150">
                        <h3 className="font-serif text-xl text-zinc-950 tracking-tight">On-Device Intelligence Studies</h3>
                        <p className="text-xs text-zinc-500 mt-1">Our ongoing investigation into neural weight compression, native edge runtimes, and local context optimization.</p>
                      </div>

                      <div className="space-y-6">
                        {RESEARCH_PAPERS.map((paper, idx) => (
                          <div key={idx} className="p-5 bg-white border border-zinc-200 rounded-xl space-y-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                              <span className="text-[10px] font-mono font-semibold text-zinc-400 uppercase">{paper.date}</span>
                            </div>
                            <h4 className="font-serif text-md text-zinc-950 font-medium leading-snug">{paper.title}</h4>
                            <p className="text-xs text-zinc-500 font-mono">{paper.authors}</p>
                            <p className="text-sm text-zinc-600 font-sans leading-relaxed pt-1">{paper.abstract}</p>
                            <div className="flex gap-1.5 pt-2">
                              {paper.tags.map((tag, tagIdx) => (
                                <span key={tagIdx} className="text-[9px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-sm">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Papers Tab */}
                  {activeTab === "papers" && (
                    <div className="space-y-6">
                      <div className="pb-4 border-b border-zinc-150">
                        <h3 className="font-serif text-xl text-zinc-950 tracking-tight">Academic Publications</h3>
                        <p className="text-xs text-zinc-500 mt-1">Peer-reviewed manuscripts and technical reports submitted to leading ML conferences.</p>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {ACADEMIC_PUBLICATIONS.map((paper, idx) => (
                          <div key={idx} className="p-4 bg-white border border-zinc-200 rounded-xl flex items-start gap-4">
                            <div className="p-3 bg-zinc-100 rounded-lg text-zinc-600">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-serif font-medium text-zinc-950 leading-snug text-sm">{paper.title}</h4>
                              <p className="text-xs text-zinc-500">{paper.authors} • {paper.date}</p>
                              <div className="pt-2">
                                <button className="text-[11px] font-medium text-zinc-900 hover:underline flex items-center gap-1 cursor-pointer">
                                  Download pre-print PDF →
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Docs Tab */}
                  {activeTab === "docs" && (
                    <div className="space-y-6">
                      <div className="pb-4 border-b border-zinc-150">
                        <h3 className="font-serif text-xl text-zinc-950 tracking-tight">On-Device SDK Guides</h3>
                        <p className="text-xs text-zinc-500 mt-1">Build safe, zero-telemetry integrations using your choice of runtime layer.</p>
                      </div>

                      <div className="space-y-6">
                        {CODE_EXAMPLES.map((snippet, idx) => (
                          <div key={idx} className="space-y-2">
                            <h4 className="font-serif text-md text-zinc-950 font-medium">{snippet.title}</h4>
                            <p className="text-xs text-zinc-600 leading-relaxed font-sans">{snippet.description}</p>
                            
                            {/* Codeblock */}
                            <div className="relative bg-zinc-900 rounded-xl overflow-hidden shadow-xs border border-zinc-800">
                              <div className="p-2 px-4 bg-zinc-800 border-b border-zinc-700 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                                <span className="uppercase">{snippet.language}</span>
                                <button
                                  onClick={() => handleCopy(idx, snippet.code)}
                                  className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                                >
                                  {copiedSnippetIdx === idx ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span className="text-emerald-400">Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <pre className="p-4 overflow-x-auto text-[11px] font-mono text-zinc-300 leading-relaxed">
                                <code>{snippet.code}</code>
                              </pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* About Tab */}
                  {activeTab === "about" && (
                    <div className="space-y-6">
                      <div className="pb-4 border-b border-zinc-150">
                        <h3 className="font-serif text-xl text-zinc-950 tracking-tight">About Helios</h3>
                        <p className="text-xs text-zinc-500 mt-1">A collective dedicated to decentralized edge intelligence and physical data sovereignty.</p>
                      </div>

                      <div className="space-y-4">
                        <p className="text-sm text-zinc-600 leading-relaxed font-sans">
                           Helios is an open-scientific lab founded in early 2026. Our mission is to ensure that general-purpose intelligence remains decentralized, physical, and subject only to the individual.
                        </p>
                        <p className="text-sm text-zinc-600 leading-relaxed font-sans">
                          Rather than building hyper-scaled data monoliths, we design architectures that excel on on-device neural processing units (NPUs), graphics pipelines (WebGPU), and consumer desktop machines. 
                        </p>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                          <div className="p-4 bg-white border border-zinc-200 rounded-xl">
                            <ShieldCheck className="w-5 h-5 text-zinc-800 mb-1" />
                            <span className="block text-[10px] font-mono text-zinc-400 uppercase">Core Standard</span>
                            <span className="text-sm font-semibold text-zinc-900">Zero Inbound Logs</span>
                          </div>
                          <div className="p-4 bg-white border border-zinc-200 rounded-xl">
                            <Cpu className="w-5 h-5 text-zinc-800 mb-1" />
                            <span className="block text-[10px] font-mono text-zinc-400 uppercase">Edge Efficiency</span>
                            <span className="text-sm font-semibold text-zinc-900">Up to 45 tokens/s</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
