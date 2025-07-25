"use client";
import React, { useState, useEffect, useRef } from "react";
import DrumMachineGrid from "./components/display";
import BpmSlider from "./components/bpmslider";
import BpmDisplay from "./components/bpmdisplay";
import TimeSignatureSelector from "./components/time";

const DEFAULT_BPM = 120;
const INSTRUMENTS = [
  { name: "Kick", file: "/kick.mp3" },
  { name: "Snare", file: "/snare.wav" },
  { name: "Hat", file: "/hat.wav" },
  { name: "Crash", file: "/crash.wav" },
];

// Time signature mapping
const TIME_SIGNATURE_MAP = {
  "4/4": { sections: 4, stepsPerSection: 4 },
  "3/4": { sections: 3, stepsPerSection: 4 },
  "5/4": { sections: 5, stepsPerSection: 4 },
  "7/8": { sections: 7, stepsPerSection: 2 },
};

export default function Home() {
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const [timeSignature, setTimeSignature] = useState<keyof typeof TIME_SIGNATURE_MAP>("4/4");
  const [playing, setPlaying] = useState(false);
  const [sliderActive, setSliderActive] = useState(false);
  const wasPlayingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Web Audio API context and buffers
  const audioContext = useRef<AudioContext | null>(null);
  const [buffers, setBuffers] = useState<{ [name: string]: AudioBuffer }>({});

  // Get section info from map
  const { sections, stepsPerSection } = TIME_SIGNATURE_MAP[timeSignature as keyof typeof TIME_SIGNATURE_MAP] || { sections: 4, stepsPerSection: 4 };
  const steps = sections * stepsPerSection;

  // 2D grid: instruments x steps
  const [grid, setGrid] = useState(() =>
    Array(INSTRUMENTS.length)
      .fill(0)
      .map(() => Array(steps).fill(false))
  );

  // Setup AudioContext and preload buffers
  useEffect(() => {
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    audioContext.current = new AudioCtx();
    const ctx = audioContext.current;
    let isMounted = true; 
    const loadBuffers = async () => {
      const newBuffers: { [name: string]: AudioBuffer } = {};
      for (const inst of INSTRUMENTS) {
        const res = await fetch(inst.file);
        const arrayBuffer = await res.arrayBuffer();
        newBuffers[inst.name] = await ctx.decodeAudioData(arrayBuffer);
      }
      if (isMounted) setBuffers(newBuffers);
    };
    loadBuffers();
    return () => {
      isMounted = false;
      ctx.close();
    };
  }, []);

  // Reset grid if steps change
  useEffect(() => {
    setGrid(Array(INSTRUMENTS.length).fill(0).map(() => Array(steps).fill(false)));
    setCurrentStep(0);
  }, [steps]);

  // Playback loop
  useEffect(() => {
    if (!playing || sliderActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    // Each step is a 16th note: interval = 60000 / (bpm * 4)
    const interval = 60000 / (bpm * 4);
    intervalRef.current = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps);
    }, interval);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [playing, bpm, sliderActive, steps]);

  // Play sounds on step change using Web Audio API
  useEffect(() => {
    if (!playing) return;
    const ctx = audioContext.current;
    if (!ctx) return;
    INSTRUMENTS.forEach((inst, row) => {
      if (grid[row][currentStep] && buffers[inst.name]) {
        const source = ctx.createBufferSource();
        source.buffer = buffers[inst.name];
        source.connect(ctx.destination);
        source.start();
      }
    });
  }, [currentStep, playing, grid, buffers]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleStartStop();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggle = (row: number, col: number) => {
    setGrid(g => {
      const newGrid = g.map(arr => [...arr]);
      newGrid[row][col] = !newGrid[row][col];
      return newGrid;
    });
  };

  const handleSliderPointerDown = () => {
    if (playing) {
      wasPlayingRef.current = true;
      setPlaying(false);
    } else {
      wasPlayingRef.current = false;
    }
    setSliderActive(true);
  };

  const handleSliderPointerUp = () => {
    setSliderActive(false);
    if (wasPlayingRef.current) {
      setPlaying(true);
    }
  };

  const handleStartStop = () => {
    setPlaying(p => {
      if (p) {
        setCurrentStep(0); // Reset to beginning when stopping
        return false;
      } else {
        setCurrentStep(0); // Also reset to beginning when starting
        return true;
      }
    });
  };

  const handleReset = () => {
    setGrid(Array(INSTRUMENTS.length).fill(0).map(() => Array(steps).fill(false)));
    setCurrentStep(0);
    setPlaying(false);
  };

  return (
    <div style={{ width: "100vw", minHeight: "100vh", overflow: "auto", WebkitOverflowScrolling: "touch", background: "#b3d8f7" }}>
      <main style={{ minWidth: 1600, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 1600, margin: "0 auto", position: "relative" }}>
          {/* App name box top left */}
          <div style={{ position: "absolute", top: 0, left: 0, background: "#fff8ec", border: "2px solid #000", borderRadius: 12, padding: "1rem 1.5rem", minHeight: 48, boxShadow: "0 2px 8px #b0b0b033", zIndex: 1000, fontWeight: 900, fontSize: "2rem", letterSpacing: 1 }}>
            <h1 style={{ fontWeight: 900, fontSize: "2rem", letterSpacing: 1, margin: 0 }}>
              beatronome: no bs drum machine
            </h1>
          </div>
          <div style={{ position: "absolute", top: 0, right: 0, background: "#fff8ec", border: "2px solid #000", borderRadius: 12, padding: "1rem 1.5rem", minHeight: 48, boxShadow: "0 2px 8px #b0b0b033", zIndex: 1000, fontWeight: 500 }}>
            <span style={{ fontWeight: 700, fontSize: "1.3rem", letterSpacing: 1 }}>
              Made with love by Alan Cai.
            </span>
            <div style={{ marginTop: 8 }}>
              alanc@vt.edu | <a href="https://www.linkedin.com/in/alan-cai16/" target="_blank" style={{ color: "#1976d2", textDecoration: "underline" }}>
                linkedin
              </a>
            </div>
          </div>
          <div style={{ marginTop: 100 }}>
            <DrumMachineGrid
              instruments={INSTRUMENTS}
              steps={steps}
              grid={grid}
              currentStep={currentStep}
              onToggle={handleToggle}
              sectionLength={stepsPerSection}
              sections={sections}
            />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <BpmSlider
            value={bpm}
            onChange={setBpm}
            onPointerDown={handleSliderPointerDown}
            onPointerUp={handleSliderPointerUp}
          />
          <BpmDisplay
            bpm={bpm}
            min={10}
            max={240}
            onChange={setBpm}
          />
          <TimeSignatureSelector
            value={timeSignature}
            onChange={v => setTimeSignature(v as keyof typeof TIME_SIGNATURE_MAP)}
          />
        </div>
        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <button
            onClick={handleStartStop}
            style={{
              fontSize: "2rem",
              padding: "1rem 3rem",
              borderRadius: "16px",
              border: "3px solid #000",
              background: playing ? "#e0e0e0" : "#4CAF50",
              color: playing ? "#000" : "#fff",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
            }}
          >
            {playing ? "Stop" : "Start"}
          </button>
          <button
            onClick={handleReset}
            style={{
              fontSize: "2rem",
              padding: "1rem 3rem",
              borderRadius: "16px",
              border: "3px solid #000",
              background: "#f44336",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
            }}
          >
            Reset
          </button>
        </div>
      </main>
    </div>
  );
}
