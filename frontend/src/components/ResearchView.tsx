import { useEffect, useState } from "react";
import { Calendar, ArrowRight, AlertTriangle } from "lucide-react";
import { fetchPapers, formatDate, type PaperListItem } from "../api";
import Loading from "./Loading";

interface ResearchViewProps {
  onOpenPaper: (slug: string) => void;
}

export default function ResearchView({ onOpenPaper }: ResearchViewProps) {
  const [papers, setPapers] = useState<PaperListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPapers("research")
      .then((p) => {
        if (!cancelled) {
          setPapers(p);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto w-full px-6 md:px-12 py-12">
      {/* Title Header */}
      <div className="mb-8 md:mb-10 space-y-2 text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-zinc-950 tracking-tight">On-Device Intelligence Studies</h2>
        <p className="text-zinc-500 font-sans md:text-lg max-w-xl mx-auto">Our ongoing investigation into neural weight compression, native edge runtimes, and local context optimization.</p>
      </div>

      {loading && <Loading label="Loading studies..." />}

      {error && (
        <div className="flex items-center gap-3 text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-4 max-w-xl mx-auto">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-mono">Failed to load: {error}</span>
        </div>
      )}

      {!loading && !error && papers.length === 0 && (
        <p className="text-center text-sm text-zinc-400 font-mono py-12">
          No studies have been published here yet.
        </p>
      )}

      <div className="space-y-6">
        {!loading &&
          !error &&
          papers.map((paper) => (
            <button
              key={paper.slug}
              onClick={() => onOpenPaper(paper.slug)}
              className="text-left w-full p-6 bg-white border border-zinc-200 rounded-lg hover:border-[#F27D26]/40 transition-all shadow-xs block cursor-pointer group"
            >
              {/* Paper Meta */}
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-[#F27D26]" />
                <span className="text-[10px] font-mono font-bold text-[#F27D26] uppercase tracking-wider">
                  {formatDate(paper.created_at)}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl text-zinc-950 font-bold leading-snug group-hover:text-[#F27D26] transition-colors">
                {paper.title}
              </h3>
              <p className="text-sm text-zinc-600 font-sans leading-relaxed pt-3">
                {paper.description}
              </p>

              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-xs text-zinc-900 group-hover:text-[#F27D26] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors">
                  Read Full Study <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
