import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { fetchPapers, formatDate, type PaperListItem } from "../api";
import Loading from "./Loading";

export default function DocsView() {
  const [papers, setPapers] = useState<PaperListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPapers("docs")
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
        <h2 className="text-3xl md:text-4xl font-serif text-zinc-950 tracking-tight">On-Device SDK Guides</h2>
        <p className="text-zinc-500 font-sans md:text-lg max-w-xl mx-auto">Guides, references, and tutorials for building safe, zero-telemetry integrations with Helios.</p>
      </div>

      {loading && <Loading />}

      {error && (
        <div className="flex items-center gap-3 text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-4 max-w-xl mx-auto">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-mono">Failed to load: {error}</span>
        </div>
      )}

      {!loading && !error && papers.length === 0 && (
        <p className="text-center text-sm text-zinc-400 font-mono py-12">
          No guides have been published here yet.
        </p>
      )}

      <div className="space-y-6">
        {!loading &&
          !error &&
          papers.map((paper) => (
            <Link
              key={paper.slug}
              to={`/docs/${paper.slug}`}
              className="text-left w-full p-6 bg-white border border-zinc-200 rounded-lg hover:border-[#F27D26]/40 transition-all shadow-xs block cursor-pointer group"
            >
              <div className="flex-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase font-semibold">
                  {formatDate(paper.created_at)}
                </span>
                <h3 className="font-serif text-lg text-zinc-950 font-bold leading-snug mt-0.5 group-hover:text-[#F27D26] transition-colors">
                  {paper.title}
                </h3>
                <p className="text-sm text-zinc-600 font-sans leading-relaxed pt-2">
                  {paper.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs text-zinc-900 group-hover:text-[#F27D26] font-mono font-bold transition-colors">
                  Open Guide <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
