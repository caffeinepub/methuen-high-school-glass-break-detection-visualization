import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import type { GlassBreakEvent } from "../App";

interface EventLogProps {
  events: GlassBreakEvent[];
  onClearEvents: () => void;
}

export function EventLog({ events, onClearEvents }: EventLogProps) {
  const newestIdRef = useRef<string | null>(null);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

  const getLocation = (x: number, y: number): string => {
    if (y < 33) {
      if (x < 33) return "N-WING/R101";
      if (x < 66) return "N-WING/R102";
      return "N-WING/R103";
    }
    if (y < 66) {
      if (x < 25) return "W-WING/R201";
      if (x < 50) return "MAIN/CAFE";
      if (x < 75) return "MAIN/GYM";
      return "E-WING/R202";
    }
    if (x < 33) return "S-WING/R301";
    if (x < 66) return "S-WING/LIB";
    return "S-WING/R303";
  };

  useEffect(() => {
    if (events.length > 0) {
      newestIdRef.current = events[0].id;
    }
  }, [events]);

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
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: "oklch(0.11 0.02 245)",
          borderBottom: "1px solid oklch(0.88 0.18 195 / 0.15)",
        }}
      >
        <div className="flex items-center gap-2">
          <Terminal
            className="h-4 w-4"
            style={{ color: "oklch(0.88 0.18 195)" }}
          />
          <span
            className="text-xs font-bold tracking-widest uppercase font-mono"
            style={{
              color: "oklch(0.88 0.18 195)",
              textShadow: "0 0 6px oklch(0.88 0.18 195 / 0.5)",
            }}
          >
            EVENT LOG
          </span>
          {events.length > 0 && (
            <span
              className="font-mono text-[10px] px-1.5 py-0.5"
              style={{
                background: "oklch(0.60 0.26 18 / 0.2)",
                border: "1px solid oklch(0.60 0.26 18 / 0.4)",
                color: "oklch(0.65 0.28 18)",
              }}
            >
              {events.length}
            </span>
          )}
        </div>
        {events.length > 0 && (
          <button
            type="button"
            data-ocid="eventlog.delete_button"
            onClick={onClearEvents}
            className="flex items-center gap-1.5 px-2 py-1 font-mono text-[10px] tracking-wider uppercase transition-all hover:opacity-80"
            style={{
              color: "oklch(0.60 0.26 18 / 0.7)",
              border: "1px solid oklch(0.60 0.26 18 / 0.3)",
              background: "oklch(0.60 0.26 18 / 0.05)",
            }}
          >
            <Trash2 className="h-3 w-3" />
            CLEAR
          </button>
        )}
      </div>

      <div className="p-3">
        {events.length === 0 ? (
          <div
            data-ocid="eventlog.empty_state"
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <div
              className="mb-3 font-mono text-xs"
              style={{ color: "oklch(0.88 0.18 195 / 0.25)" }}
            >
              <p>┌─────────────────────┐</p>
              <p>│ NO EVENTS LOGGED │</p>
              <p>│ SYSTEM MONITORING │</p>
              <p>└─────────────────────┘</p>
            </div>
            <p
              className="text-[10px] font-mono tracking-wider"
              style={{ color: "oklch(0.88 0.18 195 / 0.2)" }}
            >
              AWAITING DETECTION...
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[280px] pr-1">
            <div className="space-y-1.5">
              {events.map((event, index) => {
                const isNewest = index === 0;
                return (
                  <div
                    key={event.id}
                    data-ocid={`eventlog.item.${index + 1}`}
                    className="relative overflow-hidden"
                    style={{
                      background: "oklch(0.12 0.02 248)",
                      borderLeft: `3px solid ${
                        isNewest
                          ? "oklch(0.65 0.28 18)"
                          : "oklch(0.60 0.26 18 / 0.4)"
                      }`,
                      border: `1px solid oklch(0.60 0.26 18 / ${
                        isNewest ? "0.3" : "0.1"
                      })`,
                      borderLeftWidth: "3px",
                      animation: isNewest
                        ? "new-event-flash 1.5s ease-out forwards"
                        : undefined,
                    }}
                  >
                    {isNewest && (
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background: "oklch(0.60 0.26 18 / 0.1)",
                          animation: "new-event-flash 1.5s ease-out forwards",
                        }}
                      />
                    )}

                    <div className="px-3 py-2 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-mono text-[10px] font-bold tracking-wider"
                            style={{
                              color: isNewest
                                ? "oklch(0.65 0.28 18)"
                                : "oklch(0.60 0.26 18 / 0.7)",
                              textShadow: isNewest
                                ? "0 0 4px oklch(0.65 0.28 18 / 0.5)"
                                : undefined,
                            }}
                          >
                            [ALERT-
                            {String(events.length - index).padStart(3, "0")}]
                          </span>
                          {isNewest && (
                            <span
                              className="font-mono text-[9px] px-1 py-0.5 animate-pulse"
                              style={{
                                background: "oklch(0.65 0.28 18 / 0.2)",
                                color: "oklch(0.65 0.28 18)",
                                border: "1px solid oklch(0.65 0.28 18 / 0.4)",
                              }}
                            >
                              NEW
                            </span>
                          )}
                        </div>
                        <span
                          className="font-mono text-[10px]"
                          style={{ color: "oklch(0.88 0.18 195 / 0.4)" }}
                        >
                          {formatTime(event.timestamp)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span
                          className="font-mono text-[11px]"
                          style={{ color: "oklch(0.88 0.18 195 / 0.7)" }}
                        >
                          {getLocation(event.x, event.y)}
                        </span>
                        <span
                          className="font-mono text-[10px]"
                          style={{ color: "oklch(0.88 0.18 195 / 0.3)" }}
                        >
                          ({event.x.toFixed(1)}, {event.y.toFixed(1)})
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
