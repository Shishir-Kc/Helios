import { useEffect, useState } from "react";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import Markdown from "./Markdown";
import Loading from "./Loading";
import { fetchPaper, formatDate, type Paper } from "../api";

interface PaperDetailProps {
  category: string;
  slug: string;
  onBack: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  papers: "Papers",
  research: "Research",
  docs: "Docs",
};

export default function PaperDetail({
  category,
  slug,
  onBack,
}: PaperDetailProps) {
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchPaper(slug)
      .then((p) => {
        if (!cancelled) {
          setPaper(p);
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
  }, [slug]);

  const label = CATEGORY_LABELS[category] ?? category;

  return (
    <div className="max-w-3xl mx-auto w-full px-6 md:px-12 py-12">
      <button
        onClick={onBack}
        className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 hover:text-[#F27D26] transition-colors cursor-pointer mb-8 flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Back to {label}
      </button>

      {loading && <Loading label="Loading..." />}

      {error && (
        <div className="flex items-start gap-3 text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-4">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold font-mono">{error}</p>
            <button
              onClick={onBack}
              className="text-xs font-mono text-zinc-500 hover:text-zinc-900 mt-2 underline cursor-pointer"
            >
              ← Back
            </button>
          </div>
        </div>
      )}

      {paper && (
        <article>
          <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-widest text-[#F27D26] bg-[#F27D26]/10 border border-[#F27D26]/20 px-2.5 py-1 rounded mb-4">
            {label}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-zinc-950 leading-tight mb-3">
            {paper.title}
          </h1>
          <p className="text-zinc-500 font-sans text-base leading-relaxed mb-4">
            {paper.description}
          </p>
          <div className="caption font-mono text-xs text-zinc-400 border-b border-zinc-200 pb-6 mb-8 flex flex-wrap gap-x-3">
            <span>Published {formatDate(paper.created_at)}</span>
            {paper.updated_at !== paper.created_at && (
              <span>· Updated {formatDate(paper.updated_at)}</span>
            )}
          </div>

          <div className="paper-markdown">
            <Markdown content={paper.content} />
          </div>
        </article>
      )}
    </div>
  );
}
