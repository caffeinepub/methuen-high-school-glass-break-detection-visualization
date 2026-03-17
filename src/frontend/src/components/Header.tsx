import { Shield, Wifi } from "lucide-react";

export function Header() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <header
      className="relative overflow-hidden border-b"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.11 0.03 240) 0%, oklch(0.10 0.015 250) 100%)",
        borderColor: "oklch(0.88 0.18 195 / 0.25)",
        boxShadow:
          "0 1px 0 oklch(0.88 0.18 195 / 0.1), 0 4px 20px oklch(0.08 0.01 250 / 0.8)",
      }}
    >
      {/* Scanline texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0.88 0.18 195 / 0.02) 2px, oklch(0.88 0.18 195 / 0.02) 4px)",
        }}
      />
      {/* Top accent line */}
      <div
        className="absolute left-0 right-0 top-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.88 0.18 195 / 0.6) 20%, oklch(0.88 0.18 195) 50%, oklch(0.88 0.18 195 / 0.6) 80%, transparent)",
          boxShadow: "0 0 8px oklch(0.88 0.18 195 / 0.8)",
        }}
      />

      <div className="container relative mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo + Title */}
          <div className="flex items-center gap-4">
            <div
              className="relative flex h-11 w-11 items-center justify-center"
              style={{
                background: "oklch(0.60 0.26 18 / 0.15)",
                border: "1px solid oklch(0.60 0.26 18 / 0.5)",
                boxShadow:
                  "0 0 12px oklch(0.60 0.26 18 / 0.4), inset 0 0 8px oklch(0.60 0.26 18 / 0.1)",
              }}
            >
              <Shield
                className="h-6 w-6"
                style={{
                  color: "oklch(0.65 0.28 18)",
                  filter: "drop-shadow(0 0 4px oklch(0.65 0.28 18 / 0.8))",
                }}
              />
              {/* Corner brackets on logo */}
              <span
                className="absolute left-0 top-0 h-2 w-2"
                style={{
                  borderLeft: "2px solid oklch(0.88 0.18 195 / 0.8)",
                  borderTop: "2px solid oklch(0.88 0.18 195 / 0.8)",
                }}
              />
              <span
                className="absolute right-0 top-0 h-2 w-2"
                style={{
                  borderRight: "2px solid oklch(0.88 0.18 195 / 0.8)",
                  borderTop: "2px solid oklch(0.88 0.18 195 / 0.8)",
                }}
              />
              <span
                className="absolute bottom-0 left-0 h-2 w-2"
                style={{
                  borderLeft: "2px solid oklch(0.88 0.18 195 / 0.8)",
                  borderBottom: "2px solid oklch(0.88 0.18 195 / 0.8)",
                }}
              />
              <span
                className="absolute bottom-0 right-0 h-2 w-2"
                style={{
                  borderRight: "2px solid oklch(0.88 0.18 195 / 0.8)",
                  borderBottom: "2px solid oklch(0.88 0.18 195 / 0.8)",
                }}
              />
            </div>

            <div>
              <h1
                className="text-xl font-bold tracking-widest uppercase flicker"
                style={{
                  color: "oklch(0.88 0.18 195)",
                  textShadow:
                    "0 0 8px oklch(0.88 0.18 195 / 0.6), 0 0 20px oklch(0.88 0.18 195 / 0.3)",
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.2em",
                }}
              >
                METHUEN HIGH SCHOOL
              </h1>
              <p
                className="text-xs tracking-[0.3em] uppercase"
                style={{
                  color: "oklch(0.88 0.18 195 / 0.55)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Glass Break Detection System — Command Interface v2.4
              </p>
            </div>
          </div>

          {/* Right status cluster */}
          <div className="flex items-center gap-3">
            {/* Clock */}
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 font-mono text-xs"
              style={{
                color: "oklch(0.88 0.18 195 / 0.7)",
                border: "1px solid oklch(0.88 0.18 195 / 0.15)",
                background: "oklch(0.88 0.18 195 / 0.05)",
              }}
            >
              <span className="font-mono">{timeStr}</span>
            </div>

            {/* LIVE badge */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5"
              style={{
                background: "oklch(0.60 0.26 18 / 0.15)",
                border: "1px solid oklch(0.60 0.26 18 / 0.5)",
                boxShadow: "0 0 8px oklch(0.60 0.26 18 / 0.3)",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full animate-pulse"
                style={{
                  background: "oklch(0.65 0.28 18)",
                  boxShadow: "0 0 6px oklch(0.65 0.28 18)",
                }}
              />
              <span
                className="text-xs font-bold tracking-widest"
                style={{
                  color: "oklch(0.65 0.28 18)",
                  fontFamily: "'JetBrains Mono', monospace",
                  textShadow: "0 0 6px oklch(0.65 0.28 18 / 0.8)",
                }}
              >
                LIVE
              </span>
            </div>

            {/* System Active */}
            <div
              className="flex items-center gap-2 px-3 py-1.5"
              style={{
                background: "oklch(0.75 0.20 140 / 0.1)",
                border: "1px solid oklch(0.75 0.20 140 / 0.35)",
                boxShadow: "0 0 8px oklch(0.75 0.20 140 / 0.2)",
              }}
            >
              {/* Radar-style pulsing dot */}
              <div className="relative h-3 w-3">
                <span
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{
                    background: "oklch(0.75 0.20 140 / 0.4)",
                    animationDuration: "2s",
                  }}
                />
                <span
                  className="relative block h-3 w-3 rounded-full"
                  style={{
                    background: "oklch(0.75 0.20 140)",
                    boxShadow: "0 0 6px oklch(0.75 0.20 140)",
                  }}
                />
              </div>
              <Wifi
                className="h-3.5 w-3.5"
                style={{ color: "oklch(0.75 0.20 140)" }}
              />
              <span
                className="text-xs font-medium tracking-wider uppercase"
                style={{
                  color: "oklch(0.75 0.20 140)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.65rem",
                }}
              >
                SYSTEM ACTIVE
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
