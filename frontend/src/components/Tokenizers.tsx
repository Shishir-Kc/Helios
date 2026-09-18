import { useEffect, useMemo, useState } from "react";
import { fetchTokenizerFile, fetchTokenizers, type Tokenizer } from "../api";
import { EmberTokenizer, type ParsedToken } from "../tokenizer";

const TOKEN_COLORS = [
  "bg-orange-100 text-orange-900 border-orange-200", "bg-sky-100 text-sky-900 border-sky-200",
  "bg-violet-100 text-violet-900 border-violet-200", "bg-emerald-100 text-emerald-900 border-emerald-200",
  "bg-rose-100 text-rose-900 border-rose-200", "bg-amber-100 text-amber-900 border-amber-200",
];

function displayToken(value: string, showWhitespace: boolean): string {
  if (!showWhitespace) return value;
  return value.replaceAll(" ", "·").replaceAll("\n", "↵\n").replaceAll("\t", "→");
}

function tokenColor(id: number): string {
  return TOKEN_COLORS[Math.abs(id) % TOKEN_COLORS.length];
}

function supportsInput(value: string): boolean {
  return /^[\x00-\x7F]*$/.test(value);
}

export default function Tokenizers() {
  const [tokenizers, setTokenizers] = useState<Tokenizer[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [tokenizer, setTokenizer] = useState<EmberTokenizer | null>(null);
  const [text, setText] = useState("");
  const [showWhitespace, setShowWhitespace] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingFile, setLoadingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTokenizers().then((items) => {
      setTokenizers(items); setSelectedSlug(items[0]?.slug ?? "");
    }).catch((err: Error) => setError(err.message)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedSlug) { setTokenizer(null); return; }
    let cancelled = false;
    setLoadingFile(true); setError(null);
    fetchTokenizerFile(selectedSlug).then((contents) => {
      if (!cancelled) setTokenizer(EmberTokenizer.fromFile(contents));
    }).catch((err: Error) => {
      if (!cancelled) { setTokenizer(null); setError(err.message); }
    }).finally(() => { if (!cancelled) setLoadingFile(false); });
    return () => { cancelled = true; };
  }, [selectedSlug]);

  const tokenIds = useMemo(() => {
    if (!tokenizer || !supportsInput(text)) return [];
    try { return tokenizer.encode(text); } catch { return []; }
  }, [text, tokenizer]);
  const parsedTokens: ParsedToken[] = useMemo(() => tokenizer?.inspect(tokenIds) ?? [], [tokenIds, tokenizer]);
  const selectedTokenizer = tokenizers.find((item) => item.slug === selectedSlug);
  const inputSupported = supportsInput(text);

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 md:px-12 md:py-12">
      <div className="mb-7 flex flex-col gap-5 md:mb-8 md:flex-row md:items-center md:justify-between">
        <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#F27D26]">Helios tools</p><h1 className="text-3xl font-bold tracking-tight text-zinc-950 md:text-4xl">Tokenizer</h1></div>
        <label className="relative block w-full md:w-[274px]"><span className="sr-only">Choose a tokenizer</span><select value={selectedSlug} onChange={(event) => setSelectedSlug(event.target.value)} disabled={loading || tokenizers.length === 0} className="h-11 w-full appearance-none rounded-lg border border-zinc-300 bg-white px-4 pr-10 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-[#F27D26] focus:ring-2 focus:ring-orange-100 disabled:bg-zinc-100">{tokenizers.length === 0 ? <option>No tokenizers available</option> : tokenizers.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select><span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">⌄</span></label>
      </div>

      {error && <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}
      {loading && <div className="mb-4 text-sm text-zinc-500">Loading available tokenizers…</div>}
      {!loading && tokenizers.length === 0 && <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-5 py-6 text-sm text-zinc-500">No tokenizer has been uploaded yet.</div>}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex min-h-[330px] flex-col rounded-lg border border-zinc-300 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3"><label htmlFor="tokenizer-input" className="text-sm font-bold text-zinc-800">Text input</label><span className="text-xs text-zinc-400">{loadingFile ? "Loading…" : selectedTokenizer?.filename ?? ""}</span></div><textarea id="tokenizer-input" value={text} onChange={(event) => setText(event.target.value)} placeholder={tokenizer ? "Type or paste English text here..." : "Upload a tokenizer to begin..."} disabled={!tokenizer} spellCheck={false} className="min-h-[275px] flex-1 resize-none bg-transparent p-4 text-base leading-7 text-zinc-900 outline-none placeholder:text-zinc-300 disabled:cursor-not-allowed disabled:bg-zinc-50" />{!inputSupported && <p className="border-t border-rose-100 bg-rose-50 px-4 py-2 text-xs text-rose-700">Only English letters, numbers, whitespace, and ASCII special characters are supported.</p>}</div>
        <div className="flex min-h-[330px] flex-col gap-4"><div className="rounded-lg border border-zinc-200 bg-zinc-50/80 px-4 py-4 shadow-sm"><p className="text-sm text-zinc-700">Token count</p><p className="mt-1 text-2xl font-bold tabular-nums text-zinc-950">{tokenIds.length}</p></div><div className="min-h-0 flex-1 rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 shadow-sm"><p className="mb-3 text-sm text-zinc-700">Tokens</p><div className="flex max-h-[265px] min-h-[215px] flex-wrap content-start gap-1.5 overflow-y-auto rounded-md border border-zinc-200 bg-white p-3 font-mono text-sm leading-6">{parsedTokens.length === 0 ? <span className="text-zinc-300">Your tokens will appear here.</span> : parsedTokens.map((token, index) => <span key={`${token.id}-${index}`} title={`Token ID ${token.id}`} className={`rounded border px-1.5 py-0.5 ${tokenColor(token.id)}`}>{displayToken(token.text, showWhitespace)}</span>)}</div></div></div>
        <div className="min-h-[235px] rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 shadow-sm"><p className="mb-3 text-sm text-zinc-700">Token IDs</p><div className="flex min-h-[170px] flex-wrap content-start gap-1.5 overflow-auto rounded-md border border-zinc-200 bg-white p-3 font-mono text-sm leading-7 text-zinc-700">{tokenIds.length ? tokenIds.map((id, index) => <span key={`${id}-${index}`} className={`rounded border px-1.5 py-0.5 ${tokenColor(id)}`}>{id}</span>) : <span className="text-zinc-300">Token IDs will appear here.</span>}</div></div>
        <div className="min-h-[235px] rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 shadow-sm"><p className="mb-3 text-sm text-zinc-700">Decoded text</p><div className="min-h-[170px] whitespace-pre-wrap overflow-auto rounded-md border border-zinc-200 bg-white p-3 text-sm leading-7 text-zinc-700">{!inputSupported ? <span className="text-rose-600">Unsupported characters detected.</span> : tokenizer ? tokenizer.decode(tokenIds) || <span className="text-zinc-300">Decoded text will appear here.</span> : <span className="text-zinc-300">Decoded text will appear here.</span>}</div></div>
      </div>
      <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-sm text-zinc-800"><input type="checkbox" checked={showWhitespace} onChange={(event) => setShowWhitespace(event.target.checked)} className="h-4 w-4 accent-[#F27D26]" />Show whitespace</label>
    </section>
  );
}
