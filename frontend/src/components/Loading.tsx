import { DotLottieReact, setWasmUrl } from "@lottiefiles/dotlottie-react";

setWasmUrl("/dotlottie-player.wasm");


interface LoadingProps {
  size?: number;
  label?: string;
  className?: string;
}

export default function Loading({
  size = 120,
  label = "",
  className = "",
}: LoadingProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-12 ${className}`}
    >
      <DotLottieReact
        autoplay
        loop
        src="/animation/loading.lottie"
        style={{ width: size, height: size }}
      />
      {label && (
        <span className="text-sm font-mono text-zinc-400">{label}</span>
      )}
    </div>
  );
}
