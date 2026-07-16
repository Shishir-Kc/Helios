import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Github, Cpu, Layers, MemoryStick, Boxes } from "lucide-react";
import Markdown from "./Markdown";
import Loading from "./Loading";
import { fetchModel, formatDate, type Model } from "../api";

const ORG_HF = "https://huggingface.co/Helios4U";
const ORG_GITHUB = "https://github.com/Helios-4U";

export default function ModelDetail() {
  const { slug } = useParams();
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchModel(slug ?? "")
      .then((m) => {
        if (!cancelled) {
          setModel(m);
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

  const specs = model
    ? [
        model.parameters && { icon: Layers, label: "Parameters", value: model.parameters },
        model.context_length && { icon: Boxes, label: "Context Length", value: model.context_length },
        model.base_model && { icon: Cpu, label: "Base Model", value: model.base_model },
        model.required_hardware && {
          icon: MemoryStick,
          label: "Required Hardware",
          value: model.required_hardware,
        },
      ].filter(Boolean)
    : [];

  return (
    <div className="w-full">
      <Link
        to="/models"
        className="max-w-5xl mx-auto w-full px-6 md:px-12 pt-8 block text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 hover:text-[#F27D26] transition-colors cursor-pointer"
      >
        <span className="inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Models
        </span>
      </Link>

      {loading && (
        <div className="max-w-5xl mx-auto w-full px-6 md:px-12 py-12">
          <Loading />
        </div>
      )}

      {error && (
        <div className="max-w-5xl mx-auto w-full px-6 md:px-12 py-12">
          <div className="flex items-start gap-3 text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-4">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold font-mono">{error}</p>
              <Link
                to="/models"
                className="text-xs font-mono text-zinc-500 hover:text-zinc-900 mt-2 underline cursor-pointer"
              >
                ← Back to Models
              </Link>
            </div>
          </div>
        </div>
      )}

      {model && (
        <>
          {/* Banner image with overlaid title */}
          <div className="px-6 md:px-12 mt-6">
            <div className="relative mx-auto max-w-5xl w-full h-64 md:h-80 overflow-hidden rounded-2xl bg-zinc-900">
              {model.banner_image_url ? (
                <img
                  src={model.banner_image_url}
                  alt={model.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-zinc-800 to-zinc-950" />
              )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            <div className="absolute inset-x-0 bottom-0">
              <div className="max-w-3xl mx-auto w-full px-6 md:px-12 pb-8">
                <h1 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight">
                  {model.name}
                </h1>
              </div>
            </div>
          </div>

          {model.tagline && (
            <div className="max-w-3xl mx-auto w-full px-6 md:px-12 mt-6">
              <p className="text-zinc-500 font-sans text-base md:text-lg leading-relaxed">
                {model.tagline}
              </p>
            </div>
          )}
          </div>

          <div className="max-w-3xl mx-auto w-full px-6 md:px-12 py-12">
            <div className="caption font-mono text-xs text-zinc-400 border-b border-zinc-200 pb-6 mb-8 flex flex-wrap gap-x-3">
              <span>Published {formatDate(model.created_at)}</span>
              {model.updated_at !== model.created_at && (
                <span>· Updated {formatDate(model.updated_at)}</span>
              )}
            </div>

            {/* Structured specs */}
            {specs.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {specs.map((spec) => {
                  const Icon = spec!.icon;
                  return (
                    <div
                      key={spec!.label}
                      className="flex items-start gap-3 p-4 bg-white border border-zinc-200 rounded-xl"
                    >
                      <div className="p-2 bg-zinc-50 border border-zinc-200 text-[#F27D26] rounded-lg">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
                          {spec!.label}
                        </div>
                        <div className="text-sm font-sans text-zinc-900 font-medium leading-snug mt-0.5">
                          {spec!.value}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="paper-markdown">
              <Markdown content={model.content} />
            </div>

            {/* External links footer */}
            <div className="mt-12 pt-8 border-t border-zinc-200 flex flex-wrap items-center gap-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Cpu className="w-4 h-4" /> Explore
              </span>
              <a
                href={model.huggingface_url || ORG_HF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 hover:text-[#F27D26] transition-colors border border-zinc-200 rounded-lg px-4 py-2"
              >
                Hugging Face
              </a>
              <a
                href={model.github_url || ORG_GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 hover:text-[#F27D26] transition-colors border border-zinc-200 rounded-lg px-4 py-2"
              >
                <Github className="w-4 h-4" /> GitHub
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
