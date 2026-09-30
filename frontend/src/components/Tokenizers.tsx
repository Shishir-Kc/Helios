import { useEffect, useMemo, useState, type FocusEvent, type KeyboardEvent } from "react";
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

function supportsInput(value: string, isMultilangual: boolean): boolean {
  return isMultilangual || /^[\x00-\x7F]*$/.test(value);
}

type LoadedTokenizer = { slug: string; tokenizer: EmberTokenizer };
type TokenizerError = { slug: string | null; message: string };

export default function Tokenizers() {
  const [tokenizers, setTokenizers] = useState<Tokenizer[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [loadedTokenizer, setLoadedTokenizer] = useState<LoadedTokenizer | null>(null);
  const [text, setText] = useState("");
  const [showWhitespace, setShowWhitespace] = useState(false);
  const [hoveredTokenIndex, setHoveredTokenIndex] = useState<number | null>(null);
  const [focusedTokenIndex, setFocusedTokenIndex] = useState<number | null>(null);
  const [rovingTokenIndex, setRovingTokenIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<TokenizerError | null>(null);
  const selectedTokenizer = tokenizers.find((item) => item.slug === selectedSlug);
  const tokenizer = loadedTokenizer?.slug === selectedSlug ? loadedTokenizer.tokenizer : null;
  const selectedError = error && (error.slug === null || error.slug === selectedSlug) ? error.message : null;
  const loadingFile = Boolean(selectedSlug && !tokenizer && !selectedError);
  const activeTokenIndex = hoveredTokenIndex ?? focusedTokenIndex;

  const tokenInteractionProps = (index: number, label: string) => ({
    "aria-label": label,
    "data-token-index": index,
    onBlur: (event: FocusEvent<HTMLSpanElement>) => {
      const nextTarget = event.relatedTarget;
      if (!(nextTarget instanceof Node) || !event.currentTarget.parentElement?.contains(nextTarget)) {
        setFocusedTokenIndex(null);
      }
    },
    onFocus: () => {
      setFocusedTokenIndex(index);
      setRovingTokenIndex(index);
    },
    onKeyDown: (event: KeyboardEvent<HTMLSpanElement>) => {
      const direction = event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
      if (direction === 0) return;

      const items = event.currentTarget.parentElement?.querySelectorAll<HTMLElement>("[data-token-index]");
      if (!items?.length) return;

      event.preventDefault();
      const nextIndex = (index + direction + items.length) % items.length;
      items[nextIndex]?.focus();
    },
    onPointerEnter: () => setHoveredTokenIndex(index),
    onPointerLeave: () => setHoveredTokenIndex(null),
    role: "listitem" as const,
    tabIndex: index === rovingTokenIndex ? 0 : -1,
  });

  useEffect(() => {
    fetchTokenizers().then((items) => {
      const initialTokenizer = items.find((item) => item.name === "ember_40K_base") ?? items[0];
      setTokenizers(items);
      setSelectedSlug(initialTokenizer?.slug ?? "");
      setError(null);
    }).catch((err: Error) => setError({ slug: null, message: err.message })).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedSlug) { setLoadedTokenizer(null); return; }
    let cancelled = false;
    setLoadedTokenizer(null);
    setError((current) => current?.slug === selectedSlug ? null : current);
    fetchTokenizerFile(selectedSlug).then((contents) => {
      if (!cancelled) setLoadedTokenizer({ slug: selectedSlug, tokenizer: EmberTokenizer.fromFile(contents) });
    }).catch((err: Error) => {
      if (!cancelled) setError({ slug: selectedSlug, message: err.message });
    });
    return () => { cancelled = true; };
  }, [selectedSlug]);

  const tokenIds = useMemo(() => {
    if (!tokenizer || !supportsInput(text, Boolean(selectedTokenizer?.is_multilangual))) return [];
    try { return tokenizer.encode(text); } catch { return []; }
  }, [text, tokenizer, selectedTokenizer?.is_multilangual]);
  const parsedTokens: ParsedToken[] = useMemo(() => tokenizer?.inspect(tokenIds) ?? [], [tokenIds, tokenizer]);
  const inputSupported = supportsInput(text, Boolean(selectedTokenizer?.is_multilangual));
  const inputPlaceholder = selectedSlug
    ? tokenizer
      ? selectedTokenizer?.is_multilangual ? "Type or paste text in any language..." : "Type or paste English text here..."
      : loadingFile ? "Loading tokenizer…" : "Tokenizer failed to load."
    : loading
      ? "Loading available tokenizers..."
      : selectedError ? "Unable to load tokenizers." : "Upload a tokenizer to begin...";

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 md:px-12 md:py-12">
      <div className="mb-7 flex flex-col gap-5 md:mb-8 md:flex-row md:items-center md:justify-between">
        <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#F27D26]">Helios tools</p><h1 className="text-3xl font-bold tracking-tight text-zinc-950 md:text-4xl">Tokenizer</h1></div>
        <label className="relative block w-full md:w-[274px]"><span className="sr-only">Choose a tokenizer</span><select value={selectedSlug} onChange={(event) => { setError(null); setLoadedTokenizer(null); setSelectedSlug(event.target.value); }} disabled={loading || tokenizers.length === 0} className="h-11 w-full appearance-none rounded-lg border border-zinc-300 bg-white px-4 pr-10 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-[#F27D26] focus:ring-2 focus:ring-orange-100 disabled:bg-zinc-100">{tokenizers.length === 0 ? <option>No tokenizers available</option> : tokenizers.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select><span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">⌄</span></label>
      </div>

      {selectedError && <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{selectedError}</div>}
      {loading && <div className="mb-4 text-sm text-zinc-500">Loading available tokenizers…</div>}
      {!loading && tokenizers.length === 0 && <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-5 py-6 text-sm text-zinc-500">No tokenizer has been uploaded yet.</div>}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex min-h-[330px] flex-col rounded-lg border border-zinc-300 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3"><label htmlFor="tokenizer-input" className="text-sm font-bold text-zinc-800">Text input</label><span className="text-xs text-zinc-400">{loadingFile ? "Loading…" : selectedTokenizer?.filename ?? ""}</span></div><textarea id="tokenizer-input" value={text} onChange={(event) => setText(event.target.value)} placeholder={inputPlaceholder} disabled={!tokenizer} spellCheck={false} className="min-h-[275px] flex-1 resize-none bg-transparent p-4 text-base leading-7 text-zinc-900 outline-none placeholder:text-zinc-300 disabled:cursor-not-allowed disabled:bg-zinc-50" />{!inputSupported && <p className="border-t border-rose-100 bg-rose-50 px-4 py-2 text-xs text-rose-700">This tokenizer supports English text only. Non-English characters are not supported.</p>}</div>
        <div className="flex min-h-[330px] flex-col gap-4"><div className="rounded-lg border border-zinc-200 bg-zinc-50/80 px-4 py-4 shadow-sm"><p className="text-sm text-zinc-700">Token count</p><p className="mt-1 text-2xl font-bold tabular-nums text-zinc-950">{tokenIds.length}</p></div><div className="min-h-0 flex-1 rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 shadow-sm"><p className="mb-3 text-sm text-zinc-700">Tokens</p><div role="list" aria-label="Token sequence. Focus a token and use the arrow keys to highlight its matching token ID." className="flex max-h-[265px] min-h-[215px] flex-wrap content-start gap-1.5 overflow-y-auto rounded-md border border-zinc-200 bg-white p-3 font-mono text-sm leading-6">{parsedTokens.length === 0 ? <span className="text-zinc-300">Your tokens will appear here.</span> : parsedTokens.map((token, index) => <span key={`${token.id}-${index}`} {...tokenInteractionProps(index, `Token ${index + 1}: ${token.text || "empty"}, ID ${token.id}`)} title={`Token ID ${token.id}`} className={`rounded border px-1.5 py-0.5 transition-shadow duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F27D26] focus-visible:ring-offset-1 ${activeTokenIndex === index ? "relative z-10 ring-2 ring-[#F27D26] ring-offset-1 shadow-sm" : ""} ${tokenColor(token.id)}`}>{displayToken(token.text, showWhitespace)}</span>)}</div></div></div>
        <div className="min-h-[235px] rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 shadow-sm"><p className="mb-3 text-sm text-zinc-700">Token IDs</p><div role="list" aria-label="Token IDs. Focus an ID and use the arrow keys to highlight its matching token." className="flex min-h-[170px] flex-wrap content-start gap-1.5 overflow-auto rounded-md border border-zinc-200 bg-white p-3 font-mono text-sm leading-7 text-zinc-700">{tokenIds.length ? tokenIds.map((id, index) => <span key={`${id}-${index}`} {...tokenInteractionProps(index, `Token ID ${id}, token ${parsedTokens[index]?.text || "empty"}`)} className={`rounded border px-1.5 py-0.5 transition-shadow duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F27D26] focus-visible:ring-offset-1 ${activeTokenIndex === index ? "relative z-10 ring-2 ring-[#F27D26] ring-offset-1 shadow-sm" : ""} ${tokenColor(id)}`}>{id}</span>) : <span className="text-zinc-300">Token IDs will appear here.</span>}</div></div>
        <div className="min-h-[235px] rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 shadow-sm"><p className="mb-3 text-sm text-zinc-700">Decoded text</p><div className="min-h-[170px] whitespace-pre-wrap overflow-auto rounded-md border border-zinc-200 bg-white p-3 text-sm leading-7 text-zinc-700">{!inputSupported ? <span className="text-rose-600">Unsupported characters detected.</span> : tokenizer ? tokenizer.decode(tokenIds) || <span className="text-zinc-300">Decoded text will appear here.</span> : <span className="text-zinc-300">Decoded text will appear here.</span>}</div></div>
      </div>
      <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-sm text-zinc-800"><input type="checkbox" checked={showWhitespace} onChange={(event) => setShowWhitespace(event.target.checked)} className="h-4 w-4 accent-[#F27D26]" />Show whitespace</label>
    </section>
  );
}
