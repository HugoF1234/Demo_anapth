import { useEffect, useRef } from "react";

interface Props {
  getAnalyser: () => AnalyserNode | null;
  active: boolean;
}

const BAR_COUNT = 4;
const BAR_WIDTH = 3;
const BAR_GAP = 5;

export default function AudioVisualizer({ getAnalyser, active }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(rafRef.current);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const draw = () => {
      const canvas = canvasRef.current;
      const analyser = getAnalyser();
      if (!canvas || !analyser) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      // Global average level from all frequencies
      let total = 0;
      for (let i = 0; i < bufferLength; i++) total += dataArray[i];
      const avg = total / bufferLength / 255;

      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const totalWidth = BAR_COUNT * BAR_WIDTH + (BAR_COUNT - 1) * BAR_GAP;
      const startX = (w - totalWidth) / 2;

      for (let i = 0; i < BAR_COUNT; i++) {
        // Each bar gets a slight random variation around the global level
        const variation = 0.7 + Math.random() * 0.6;
        const value = Math.min(1, avg * variation);
        const barH = Math.max(3, value * h * 0.85);
        const x = startX + i * (BAR_WIDTH + BAR_GAP);
        const y = (h - barH) / 2;

        ctx.fillStyle = `rgba(37, 99, 235, ${0.5 + value * 0.5})`;
        ctx.beginPath();
        ctx.roundRect(x, y, BAR_WIDTH, barH, 1.5);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, getAnalyser]);

  return <canvas ref={canvasRef} className="audio-visualizer" />;
}
