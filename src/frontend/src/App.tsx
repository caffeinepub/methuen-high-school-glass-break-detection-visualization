import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { ControlPanel } from "./components/ControlPanel";
import { EventLog } from "./components/EventLog";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { MapView } from "./components/MapView";

export interface GlassBreakEvent {
  id: string;
  x: number;
  y: number;
  timestamp: Date;
}

function App() {
  const [events, setEvents] = useState<GlassBreakEvent[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const handleTriggerEvent = (x: number, y: number) => {
    const newEvent: GlassBreakEvent = {
      id: `event-${Date.now()}-${Math.random()}`,
      x,
      y,
      timestamp: new Date(),
    };
    setEvents((prev) => [newEvent, ...prev].slice(0, 10));
  };

  const handleClearEvents = () => setEvents([]);
  const handleToggleAudio = () => setAudioEnabled((prev) => !prev);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div
        className="flex min-h-screen flex-col"
        style={{ background: "oklch(0.09 0.015 250)" }}
      >
        <Header />

        <main className="flex-1 container mx-auto px-4 py-6 lg:py-8">
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            {/* Main Map */}
            <div>
              <MapView
                events={events}
                onTriggerEvent={handleTriggerEvent}
                audioEnabled={audioEnabled}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <ControlPanel
                onTriggerEvent={handleTriggerEvent}
                audioEnabled={audioEnabled}
                onToggleAudio={handleToggleAudio}
              />
              <EventLog events={events} onClearEvents={handleClearEvents} />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
