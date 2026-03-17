import { AlertCircle, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { GlassBreakEvent } from "../App";

interface MapViewProps {
  events: GlassBreakEvent[];
  onTriggerEvent: (x: number, y: number) => void;
  audioEnabled: boolean;
}

const RING_SIZES = [160, 130, 100, 70];

export function MapView({
  events,
  onTriggerEvent,
  audioEnabled,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [showSpeakerFlash, setShowSpeakerFlash] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const lastEventIdRef = useRef<string | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.src = "/assets/glass-break.mp3";
    audio.volume = 0.7;
    audio.preload = "auto";
    audio.addEventListener("canplaythrough", () => {
      setAudioInitialized(true);
      setAudioError(null);
    });
    audio.addEventListener("error", () => {
      setAudioError("Audio file not available");
      setAudioInitialized(false);
    });
    audioRef.current = audio;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (events.length === 0) return;
    const latestEvent = events[0];
    if (latestEvent.id === lastEventIdRef.current) return;
    lastEventIdRef.current = latestEvent.id;
    if (audioEnabled && audioRef.current && audioInitialized) {
      const playAudio = async () => {
        try {
          audioRef.current!.currentTime = 0;
          await audioRef.current!.play();
          setShowSpeakerFlash(true);
          setTimeout(() => setShowSpeakerFlash(false), 500);
        } catch (error: any) {
          if (error.name === "NotAllowedError") {
            setAudioError("Click anywhere to enable audio");
            const enableAudio = async () => {
              try {
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                  await audioRef.current.play();
                  setShowSpeakerFlash(true);
                  setTimeout(() => setShowSpeakerFlash(false), 500);
                  setAudioError(null);
                }
                document.removeEventListener("click", enableAudio);
              } catch (e) {
                console.error("Failed to play audio:", e);
              }
            };
            document.addEventListener("click", enableAudio, { once: true });
          }
        }
      };
      playAudio();
    }
  }, [events, audioEnabled, audioInitialized]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onTriggerEvent(x, y);
  };

  const handleMapKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      onTriggerEvent(50, 50);
    }
  };

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: "oklch(0.10 0.015 250)",
        border: "1px solid oklch(0.88 0.18 195 / 0.2)",
        boxShadow:
          "0 0 0 1px oklch(0.88 0.18 195 / 0.05), 0 4px 32px oklch(0.08 0.01 250)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: "oklch(0.11 0.02 245)",
          borderBottom: "1px solid oklch(0.88 0.18 195 / 0.15)",
        }}
      >
        <div className="flex items-center gap-2">
          <AlertCircle
            className="h-4 w-4"
            style={{
              color: "oklch(0.65 0.28 18)",
              filter: "drop-shadow(0 0 4px oklch(0.65 0.28 18 / 0.8))",
            }}
          />
          <span
            className="text-sm font-bold tracking-widest uppercase"
            style={{
              color: "oklch(0.88 0.18 195)",
              fontFamily: "'JetBrains Mono', monospace",
              textShadow: "0 0 6px oklch(0.88 0.18 195 / 0.5)",
            }}
          >
            CAMPUS MAP — THREAT VISUALIZATION
          </span>
          {showSpeakerFlash && (
            <Volume2
              className="h-4 w-4 animate-pulse"
              style={{ color: "oklch(0.88 0.18 195)" }}
            />
          )}
        </div>
        <div className="flex items-center gap-3">
          {audioError && (
            <span
              className="text-xs font-mono"
              style={{ color: "oklch(0.65 0.28 18 / 0.8)" }}
            >
              ⚠ {audioError}
            </span>
          )}
          <span
            className="text-xs font-mono"
            style={{ color: "oklch(0.88 0.18 195 / 0.4)" }}
          >
            SENSORS: ONLINE
          </span>
        </div>
      </div>

      {/* Map container */}
      <div
        ref={containerRef}
        data-ocid="map.canvas_target"
        className="relative aspect-[3/2] cursor-crosshair overflow-hidden"
        onClick={handleMapClick}
        onKeyDown={handleMapKeyDown}
      >
        <img
          src="/assets/generated/methuen-high-school-map.dim_1200x800.png"
          alt="Methuen High School Map"
          className="h-full w-full object-cover"
          style={{ opacity: 0.75, filter: "saturate(0.6) brightness(0.85)" }}
        />

        {/* Dark tactical overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.08 0.02 240 / 0.3) 0%, oklch(0.06 0.02 240 / 0.5) 100%)",
          }}
        />

        {/* Fine grid */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.88 0.18 195 / 0.07) 1px, transparent 1px), linear-gradient(90deg, oklch(0.88 0.18 195 / 0.07) 1px, transparent 1px)",
            backgroundSize: "5% 5%",
          }}
        />

        {/* Major grid */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.88 0.18 195 / 0.12) 1px, transparent 1px), linear-gradient(90deg, oklch(0.88 0.18 195 / 0.12) 1px, transparent 1px)",
            backgroundSize: "25% 25%",
          }}
        />

        {/* Scanline sweep */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ zIndex: 4 }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "3px",
              background:
                "linear-gradient(180deg, transparent 0%, oklch(0.88 0.18 195 / 0.4) 50%, transparent 100%)",
              animation: "scanline 6s linear infinite",
              boxShadow: "0 0 8px oklch(0.88 0.18 195 / 0.3)",
            }}
          />
        </div>

        {/* HUD corner brackets */}
        <div
          className="pointer-events-none absolute left-3 top-3 h-8 w-8 animate-bracket-pulse"
          style={{
            borderLeft: "2px solid oklch(0.88 0.18 195 / 0.8)",
            borderTop: "2px solid oklch(0.88 0.18 195 / 0.8)",
            filter: "drop-shadow(0 0 3px oklch(0.88 0.18 195 / 0.6))",
          }}
        />
        <div
          className="pointer-events-none absolute right-3 top-3 h-8 w-8 animate-bracket-pulse"
          style={{
            borderRight: "2px solid oklch(0.88 0.18 195 / 0.8)",
            borderTop: "2px solid oklch(0.88 0.18 195 / 0.8)",
            filter: "drop-shadow(0 0 3px oklch(0.88 0.18 195 / 0.6))",
          }}
        />
        <div
          className="pointer-events-none absolute bottom-3 left-3 h-8 w-8 animate-bracket-pulse"
          style={{
            borderLeft: "2px solid oklch(0.88 0.18 195 / 0.8)",
            borderBottom: "2px solid oklch(0.88 0.18 195 / 0.8)",
            filter: "drop-shadow(0 0 3px oklch(0.88 0.18 195 / 0.6))",
          }}
        />
        <div
          className="pointer-events-none absolute bottom-3 right-3 h-8 w-8 animate-bracket-pulse"
          style={{
            borderRight: "2px solid oklch(0.88 0.18 195 / 0.8)",
            borderBottom: "2px solid oklch(0.88 0.18 195 / 0.8)",
            filter: "drop-shadow(0 0 3px oklch(0.88 0.18 195 / 0.6))",
          }}
        />

        <div
          className="pointer-events-none absolute left-4 bottom-4 font-mono text-[10px]"
          style={{ color: "oklch(0.88 0.18 195 / 0.35)", zIndex: 5 }}
        >
          GRID: 0,0
        </div>
        <div
          className="pointer-events-none absolute right-4 bottom-4 font-mono text-[10px]"
          style={{ color: "oklch(0.88 0.18 195 / 0.35)", zIndex: 5 }}
        >
          100,100
        </div>

        {events.map((event) => (
          <div key={event.id}>
            <AlertAnimation x={event.x} y={event.y} />
            <AlertPopup x={event.x} y={event.y} timestamp={event.timestamp} />
          </div>
        ))}

        {events.length === 0 && (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            style={{ zIndex: 6 }}
          >
            <div
              className="px-6 py-4 text-center"
              style={{
                background: "oklch(0.10 0.02 245 / 0.9)",
                border: "1px solid oklch(0.88 0.18 195 / 0.3)",
                backdropFilter: "blur(4px)",
                boxShadow: "0 0 20px oklch(0.88 0.18 195 / 0.1)",
              }}
            >
              <p
                className="text-sm font-mono tracking-wider"
                style={{ color: "oklch(0.88 0.18 195 / 0.7)" }}
              >
                ▸ CLICK MAP TO SIMULATE DETECTION EVENT
              </p>
            </div>
          </div>
        )}

        {showSpeakerFlash && (
          <div
            className="pointer-events-none absolute right-4 top-4 z-20 flex items-center gap-2 px-3 py-2 font-mono text-xs animate-pulse"
            style={{
              background: "oklch(0.88 0.18 195 / 0.15)",
              border: "1px solid oklch(0.88 0.18 195 / 0.5)",
              color: "oklch(0.88 0.18 195)",
              boxShadow: "0 0 12px oklch(0.88 0.18 195 / 0.3)",
            }}
          >
            <Volume2 className="h-4 w-4" />
            <span>AUDIO ACTIVE</span>
          </div>
        )}
      </div>
    </div>
  );
}

function AlertAnimation({ x, y }: { x: number; y: number }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const ringColor = "oklch(0.60 0.26 18)";

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 8,
      }}
    >
      {RING_SIZES.map((size, i) => (
        <div
          key={size}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "50%",
            border: `2px solid ${ringColor}`,
            animation: `pulse-ring-${i + 1} ${1.2 + i * 0.3}s ease-out infinite`,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: ringColor,
          transform: "translate(-50%, -50%)",
          animation: "alert-core 1s ease-in-out infinite",
          zIndex: 2,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 3,
        }}
      >
        <AlertCircle
          className="h-6 w-6"
          style={{ color: "white", filter: "drop-shadow(0 0 4px white)" }}
        />
      </div>
    </div>
  );
}

function AlertPopup({
  x,
  y,
  timestamp,
}: { x: number; y: number; timestamp: Date }) {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<"enter" | "show" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("show"), 50);
    const t2 = setTimeout(() => setPhase("exit"), 3200);
    const t3 = setTimeout(() => setIsVisible(false), 3700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (!isVisible) return null;

  const location = getLocationName(x, y);
  const timeStr = timestamp.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const popupX = x > 75 ? x - 12 : x < 25 ? x + 12 : x;
  const popupY = y > 65 ? y - 18 : y + 16;
  const opacity = phase === "show" ? 1 : 0;
  const translateY = phase === "enter" ? -10 : 0;

  return (
    <div
      data-ocid="alert.modal"
      className="pointer-events-none absolute z-20"
      style={{
        left: `${popupX}%`,
        top: `${popupY}%`,
        transform: `translateX(-50%) translateY(${translateY}px)`,
        opacity,
        transition: "opacity 0.4s ease, transform 0.4s ease",
        minWidth: "260px",
      }}
    >
      <div
        style={{
          position: "relative",
          background: "oklch(0.08 0.02 240 / 0.97)",
          border: "1px solid oklch(0.60 0.26 18 / 0.8)",
          boxShadow:
            "0 0 0 1px oklch(0.60 0.26 18 / 0.2), 0 0 20px oklch(0.60 0.26 18 / 0.4), 0 8px 32px oklch(0.04 0.01 240 / 0.9)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            height: "3px",
            background:
              "linear-gradient(90deg, transparent, oklch(0.65 0.28 18) 20%, oklch(0.65 0.28 18) 80%, transparent)",
            boxShadow: "0 0 8px oklch(0.65 0.28 18)",
          }}
        />

        <div className="p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold tracking-widest uppercase font-mono animate-text-glow"
              style={{ color: "oklch(0.65 0.28 18)" }}
            >
              ⚠ THREAT DETECTED
            </span>
          </div>

          <div
            style={{ height: "1px", background: "oklch(0.60 0.26 18 / 0.3)" }}
          />

          <div className="space-y-1">
            <span
              className="text-[10px] font-mono tracking-wider"
              style={{ color: "oklch(0.88 0.18 195 / 0.5)" }}
            >
              LOCATION
            </span>
            <p
              className="text-sm font-bold font-mono"
              style={{
                color: "oklch(0.92 0.04 200)",
                textShadow: "0 0 4px oklch(0.92 0.04 200 / 0.3)",
              }}
            >
              {location}
            </p>
          </div>

          <div
            className="font-mono text-xs px-2 py-1.5"
            style={{
              background: "oklch(0.60 0.26 18 / 0.08)",
              border: "1px solid oklch(0.60 0.26 18 / 0.2)",
              color: "oklch(0.88 0.18 195 / 0.7)",
            }}
          >
            COORDS: X={x.toFixed(2)}% Y={y.toFixed(2)}%
          </div>

          <div
            className="font-mono text-[10px]"
            style={{ color: "oklch(0.88 0.18 195 / 0.4)" }}
          >
            TIME: {timeStr} | SENSOR: ACOUSTIC
          </div>
        </div>

        {/* Corner brackets */}
        <div
          className="absolute left-0 top-0 h-3 w-3"
          style={{
            borderLeft: "1px solid oklch(0.88 0.18 195 / 0.6)",
            borderTop: "1px solid oklch(0.88 0.18 195 / 0.6)",
          }}
        />
        <div
          className="absolute right-0 top-0 h-3 w-3"
          style={{
            borderRight: "1px solid oklch(0.88 0.18 195 / 0.6)",
            borderTop: "1px solid oklch(0.88 0.18 195 / 0.6)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 h-3 w-3"
          style={{
            borderLeft: "1px solid oklch(0.88 0.18 195 / 0.6)",
            borderBottom: "1px solid oklch(0.88 0.18 195 / 0.6)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 h-3 w-3"
          style={{
            borderRight: "1px solid oklch(0.88 0.18 195 / 0.6)",
            borderBottom: "1px solid oklch(0.88 0.18 195 / 0.6)",
          }}
        />
      </div>
    </div>
  );
}

function getLocationName(x: number, y: number): string {
  if (y < 33) {
    if (x < 33) return "North Wing — Room 101";
    if (x < 66) return "North Wing — Room 102";
    return "North Wing — Room 103";
  }
  if (y < 66) {
    if (x < 25) return "West Wing — Room 201";
    if (x < 50) return "Main Hall — Cafeteria";
    if (x < 75) return "Main Hall — Gymnasium";
    return "East Wing — Room 202";
  }
  if (x < 33) return "South Wing — Room 301";
  if (x < 66) return "South Wing — Library";
  return "South Wing — Room 303";
}
