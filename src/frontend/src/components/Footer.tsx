import { Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const utm = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: "oklch(0.09 0.015 250)",
        borderTop: "1px solid oklch(0.88 0.18 195 / 0.12)",
        boxShadow: "0 -1px 0 oklch(0.88 0.18 195 / 0.05)",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute left-0 right-0 top-0 h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.88 0.18 195 / 0.2) 30%, oklch(0.88 0.18 195 / 0.4) 50%, oklch(0.88 0.18 195 / 0.2) 70%, transparent)",
        }}
      />

      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <p
            className="flex items-center gap-1.5 font-mono text-xs"
            style={{ color: "oklch(0.88 0.18 195 / 0.35)" }}
          >
            <span>© {year}. Built with</span>
            <Heart
              className="inline h-3.5 w-3.5"
              style={{
                color: "oklch(0.65 0.28 18)",
                fill: "oklch(0.65 0.28 18)",
              }}
            />
            <span>using</span>
            <a
              href={utm}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
              style={{
                color: "oklch(0.88 0.18 195 / 0.6)",
                textDecoration: "none",
                textShadow: "0 0 6px oklch(0.88 0.18 195 / 0.3)",
              }}
            >
              caffeine.ai
            </a>
          </p>
          <p
            className="font-mono text-[10px] tracking-widest uppercase"
            style={{ color: "oklch(0.88 0.18 195 / 0.2)" }}
          >
            GLASS BREAK DETECTION VISUALIZATION SYSTEM
          </p>
        </div>
      </div>
    </footer>
  );
}
