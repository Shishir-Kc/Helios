import { useEffect, useState } from "react";
import { FileText, ArrowRight, AlertTriangle } from "lucide-react";
import { fetchPapers, formatDate, type PaperListItem } from "../api";
import Loading from "./Loading";

interface PapersViewProps {
  onOpenPaper: (slug: string) => void;
}

export default function PapersView({ onOpenPaper }: PapersViewProps) {
  const [papers, setPapers] = useState<PaperListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPapers("papers")
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
    <div className="max-w-5xl mx-auto w-full px-6 md:px-12 py-12">
      {/* Title Header */}
      <div className="mb-8 md:mb-10 space-y-2 text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-zinc-950 tracking-tight">Technical Publications</h2>
        <p className="text-zinc-500 font-sans md:text-lg max-w-xl mx-auto">Peer-reviewed manuscripts and technical reports submitted to leading machine learning conferences.</p>
      </div>

      {loading && <Loading label="Loading publications..." />}

      {error && (
        <div className="flex items-center gap-3 text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-4 max-w-xl mx-auto">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-mono">Failed to load: {error}</span>
        </div>
      )}

      {!loading && !error && papers.length === 0 && (
        <p className="text-center text-sm text-zinc-400 font-mono py-12">
          No publications have been released here yet.
        </p>
      )}

      {/* Grid of Papers */}
      {!loading && !error && papers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {papers.map((paper) => (
            <button
              key={paper.slug}
              onClick={() => onOpenPaper(paper.slug)}
              className="text-left p-6 bg-white border border-zinc-200 rounded-lg flex flex-col justify-between hover:border-[#F27D26]/40 transition-all shadow-sm cursor-pointer group"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-zinc-50 border border-zinc-200 text-[#F27D26] rounded">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-zinc-400 uppercase font-semibold">
                      {formatDate(paper.created_at)}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 block">{paper.category}</span>
                  </div>
                </div>

                <h3 className="font-serif text-lg text-zinc-950 font-bold leading-snug mb-1">{paper.title}</h3>
                <p className="text-sm text-zinc-600 font-sans leading-relaxed">{paper.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100">
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-900 group-hover:text-[#F27D26] transition-colors inline-flex items-center gap-2">
                  Read Publication <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
