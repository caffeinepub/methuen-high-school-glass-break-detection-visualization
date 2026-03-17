import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

interface ControlPanelProps {
  onTriggerEvent: (x: number, y: number) => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
}

const GUIDE_LINES = [
  "> Click map to place alert",
  "> Button triggers random location",
  "> Toggle audio on/off",
  "> Alerts clear after 5 seconds",
];

const RADAR_RING_SIZES = [75, 55, 35];

export function ControlPanel({
  onTriggerEvent,
  audioEnabled,
  onToggleAudio,
}: ControlPanelProps) {
  const [isTriggering, setIsTriggering] = useState(false);
  const [radarAngle, setRadarAngle] = useState(0);

  const handleRandomTrigger = () => {
    setIsTriggering(true);
    setRadarAngle((prev) => prev + 137);
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    onTriggerEvent(x, y);
    setTimeout(() => setIsTriggering(false), 600);
  };

  return (
    <div
      className="overflow-hidden"
      style={{
        background: "oklch(0.10 0.015 250)",
        border: "1px solid oklch(0.88 0.18 195 / 0.2)",
        boxShadow: "0 4px 24px oklch(0.06 0.01 250 / 0.8)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          background: "oklch(0.11 0.02 245)",
          borderBottom: "1px solid oklch(0.88 0.18 195 / 0.15)",
        }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{
            background: "oklch(0.65 0.28 18)",
            boxShadow: "0 0 6px oklch(0.65 0.28 18)",
          }}
        />
        <span
          className="text-xs font-bold tracking-widest uppercase font-mono"
          style={{
            color: "oklch(0.88 0.18 195)",
            textShadow: "0 0 6px oklch(0.88 0.18 195 / 0.5)",
          }}
        >
          COMMAND INTERFACE
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Radar graphic */}
        <div className="flex items-center justify-center py-2">
          <div
            className="relative h-24 w-24"
            style={{
              background: "oklch(0.08 0.02 240)",
              border: "1px solid oklch(0.75 0.20 140 / 0.3)",
              borderRadius: "50%",
              boxShadow:
                "0 0 12px oklch(0.75 0.20 140 / 0.2), inset 0 0 20px oklch(0.75 0.20 140 / 0.05)",
              overflow: "hidden",
            }}
          >
            {RADAR_RING_SIZES.map((size) => (
              <div
                key={size}
                className="absolute rounded-full"
                style={{
                  width: `${size}%`,
                  height: `${size}%`,
                  left: `${(100 - size) / 2}%`,
                  top: `${(100 - size) / 2}%`,
                  border: "1px solid oklch(0.75 0.20 140 / 0.25)",
                }}
              />
            ))}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(oklch(0.75 0.20 140 / 0.15) 1px, transparent 1px), linear-gradient(90deg, oklch(0.75 0.20 140 / 0.15) 1px, transparent 1px)",
                backgroundSize: "50% 50%",
                backgroundPosition: "center",
              }}
            />
            <div
              className="absolute left-1/2 top-1/2 h-[45%] w-[2px] origin-bottom"
              style={{
                background:
                  "linear-gradient(0deg, oklch(0.75 0.20 140 / 0.9), transparent)",
                transform: `translateX(-50%) rotate(${radarAngle}deg)`,
                transition: "transform 0.4s ease-out",
                boxShadow: "0 0 4px oklch(0.75 0.20 140 / 0.5)",
              }}
            />
            <div
              className="absolute inset-0 rounded-full animate-radar-sweep"
              style={{
                background:
                  "conic-gradient(from 0deg, oklch(0.75 0.20 140 / 0) 270deg, oklch(0.75 0.20 140 / 0.15) 360deg)",
              }}
            />
            <div
              className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: "oklch(0.75 0.20 140)",
                boxShadow: "0 0 6px oklch(0.75 0.20 140)",
              }}
            />
          </div>
        </div>

        {/* Trigger button */}
        <button
          type="button"
          data-ocid="control.primary_button"
          onClick={handleRandomTrigger}
          disabled={isTriggering}
          className="relative w-full overflow-hidden font-mono text-sm font-bold tracking-widest uppercase transition-all duration-150 disabled:opacity-70"
          style={{
            padding: "14px 24px",
            background: isTriggering
              ? "oklch(0.70 0.28 18)"
              : "oklch(0.60 0.26 18)",
            color: "white",
            border: "1px solid oklch(0.70 0.28 18 / 0.8)",
            boxShadow: isTriggering
              ? "0 0 30px oklch(0.65 0.28 18 / 0.8), 0 0 60px oklch(0.65 0.28 18 / 0.4)"
              : "0 0 16px oklch(0.60 0.26 18 / 0.5), 0 0 32px oklch(0.60 0.26 18 / 0.2)",
            textShadow: "0 0 8px white",
            cursor: isTriggering ? "not-allowed" : "pointer",
            animation: !isTriggering
              ? "glow-pulse 2s ease-in-out infinite"
              : "none",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(oklch(1 0 0 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.04) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative flex items-center justify-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span>
              {isTriggering ? "TRIGGERING..." : "TRIGGER RANDOM ALERT"}
            </span>
          </div>
        </button>

        {/* Audio toggle */}
        <div
          className="flex items-center justify-between p-3"
          style={{
            background: "oklch(0.12 0.02 248)",
            border: "1px solid oklch(0.88 0.18 195 / 0.12)",
          }}
        >
          <div className="flex items-center gap-3">
            {audioEnabled ? (
              <Volume2
                className="h-4 w-4"
                style={{ color: "oklch(0.88 0.18 195)" }}
              />
            ) : (
              <VolumeX
                className="h-4 w-4"
                style={{ color: "oklch(0.55 0.05 210)" }}
              />
            )}
            <div>
              <Label
                htmlFor="audio-toggle"
                className="text-xs font-mono font-medium tracking-wider uppercase cursor-pointer"
                style={{
                  color: audioEnabled
                    ? "oklch(0.88 0.18 195)"
                    : "oklch(0.55 0.05 210)",
                }}
              >
                Audio Alerts
              </Label>
              <p
                className="text-[10px] font-mono"
                style={{ color: "oklch(0.55 0.05 210)" }}
              >
                {audioEnabled ? "STATUS: ENABLED" : "STATUS: DISABLED"}
              </p>
            </div>
          </div>
          <Switch
            data-ocid="control.switch"
            id="audio-toggle"
            checked={audioEnabled}
            onCheckedChange={onToggleAudio}
          />
        </div>

        {/* Instructions */}
        <div
          className="p-3 space-y-1.5"
          style={{
            background: "oklch(0.12 0.02 248)",
            border: "1px solid oklch(0.88 0.18 195 / 0.08)",
          }}
        >
          <p
            className="text-[10px] font-mono font-bold tracking-widest uppercase"
            style={{ color: "oklch(0.88 0.18 195 / 0.5)" }}
          >
            OPERATION GUIDE
          </p>
          {GUIDE_LINES.map((line) => (
            <p
              key={line}
              className="text-[11px] font-mono"
              style={{ color: "oklch(0.88 0.18 195 / 0.35)" }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
