import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Cpu, Hammer } from "lucide-react";
import { fetchModels, type ModelListItem } from "../api";
import Loading from "./Loading";

export default function ModelExplorer() {
  const [models, setModels] = useState<ModelListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchModels()
      .then((m) => {
        if (!cancelled) {
          setModels(m);
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
      <div className="mb-8 md:mb-10 space-y-2 text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-zinc-950 tracking-tight">Helios Model Hub</h2>
        <p className="text-zinc-500 font-sans md:text-lg max-w-xl mx-auto">
          On-device, privacy-first language models tuned for your hardware.
        </p>
      </div>

      {loading && <Loading />}

      {error && (
        <div className="flex items-center gap-3 text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-4 max-w-xl mx-auto">
          <Hammer className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-mono">Failed to load: {error}</span>
        </div>
      )}

      {!loading && !error && models.length === 0 && (
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
      )}

      {!loading && !error && models.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {models.map((model) => (
            <Link
              key={model.slug}
              to={`/models/${model.slug}`}
              className="group relative block h-48 md:h-56 rounded-xl overflow-hidden cursor-pointer"
            >
              {model.card_image_url ? (
                <img
                  src={model.card_image_url}
                  alt={model.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-zinc-800 to-zinc-950" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-serif text-2xl font-bold text-white leading-snug mb-1">
                  {model.name}
                </h3>
                <p className="text-sm text-zinc-200 font-sans leading-relaxed line-clamp-2">
                  {model.tagline}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-bold text-white/90 group-hover:text-[#F27D26] transition-colors">
                  View Model <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
