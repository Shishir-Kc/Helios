import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const components: Components = {
  h1: ({ children }) => (
    <h1 className="font-serif text-3xl md:text-4xl font-bold text-zinc-950 mt-10 mb-4 leading-tight">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-serif text-2xl md:text-3xl font-bold text-zinc-950 mt-8 mb-3 leading-tight">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-serif text-xl font-bold text-zinc-950 mt-6 mb-2">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-sm md:text-base text-zinc-700 leading-relaxed mb-4">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-6 mb-4 space-y-2 text-sm md:text-base text-zinc-700">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 mb-4 space-y-2 text-sm md:text-base text-zinc-700">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-[#F27D26] pl-4 py-2 my-6 bg-zinc-50 text-zinc-600 italic">
      {children}
    </blockquote>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-[#F27D26] underline hover:text-zinc-950 transition-colors"
    >
      {children}
    </a>
  ),
  code: ({ className, children }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-zinc-100 text-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      );
    }
    return (
      <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg overflow-x-auto my-6 text-sm font-mono leading-relaxed">
        <code className={className}>{children}</code>
      </pre>
    );
  },
  table: ({ children }) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b-2 border-zinc-300 text-left p-2 font-bold text-zinc-900">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-zinc-200 p-2 text-zinc-700">{children}</td>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-zinc-950">{children}</strong>
  ),
  hr: () => <hr className="border-t border-zinc-200 my-8" />,
  img: ({ src, alt }) => (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img src={src} alt={alt} className="rounded-lg my-6 max-w-full" />
  ),
};

export default function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
