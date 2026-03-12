import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { useSoundFeedback } from "../hooks/useSoundFeedback";
import { transcribeAudio, formatTranscription } from "../services/api";
import { useState, useCallback, useRef, useEffect } from "react";
import Pipeline from "./Pipeline";
import type { PipelineStep } from "./Pipeline";

interface Props {
  rawTranscription: string | null;
  onTranscription: (raw: string) => void;
  onFormatted: (report: string) => void;
  onReset: () => void;
  onRawChange: (raw: string) => void;
  onReformat: (text: string) => void;
  reformatting: boolean;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function RecorderPanel({
  rawTranscription,
  onTranscription,
  onFormatted,
  onReset,
  onRawChange,
  onReformat,
  reformatting,
}: Props) {
  const { state, audioBlob, duration, startRecording, stopRecording, reset } =
    useAudioRecorder();
  const { playStart, playStop, playStepDone, playAllDone } = useSoundFeedback();
  const [step, setStep] = useState<PipelineStep>("idle");
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const holdingRef = useRef(false);
  const processedBlobRef = useRef<Blob | null>(null);

  const handleStart = useCallback(async () => {
    if (processing || holdingRef.current || state === "recording") return;
    holdingRef.current = true;
    playStart();
    setStep("recording");
    setError(null);
    onReset();
    await startRecording();
  }, [processing, state, startRecording, playStart, onReset]);

  const handleStop = useCallback(() => {
    if (!holdingRef.current || state !== "recording") return;
    holdingRef.current = false;
    playStop();
    stopRecording();
  }, [state, stopRecording, playStop]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "TEXTAREA" || tag === "INPUT") return;
      e.preventDefault();
      handleStart();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "TEXTAREA" || tag === "INPUT") return;
      e.preventDefault();
      handleStop();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [handleStart, handleStop]);

  useEffect(() => {
    if (state !== "stopped" || !audioBlob) return;
    if (processedBlobRef.current === audioBlob) return;
    processedBlobRef.current = audioBlob;

    let cancelled = false;

    const process = async () => {
      setProcessing(true);
      try {
        setStep("uploading");
        await new Promise((r) => setTimeout(r, 400));
        playStepDone();

        setStep("transcribing");
        const raw = await transcribeAudio(audioBlob);
        if (cancelled) return;
        onTranscription(raw);
        playStepDone();

        setStep("formatting");
        const [formatted] = await Promise.all([
          formatTranscription(raw),
          new Promise((r) => setTimeout(r, 3000)),
        ]);
        if (cancelled) return;
        onFormatted(formatted);
        playStepDone();

        await new Promise((r) => setTimeout(r, 1000));
        if (cancelled) return;
        setStep("done");
        playAllDone();
      } catch (err: unknown) {
        if (cancelled) return;
        setStep("error");
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        if (!cancelled) setProcessing(false);
      }
    };

    process();
    return () => { cancelled = true; };
  }, [state, audioBlob, onTranscription, onFormatted]);

  const handleReset = () => {
    reset();
    setError(null);
    setStep("idle");
    processedBlobRef.current = null;
    onReset();
  };

  const isRecording = state === "recording";

  return (
    <div className="recorder-panel">
      <div
        className={`rec-zone ${isRecording ? "rec-zone--active" : ""}`}
        onMouseDown={handleStart}
        onMouseUp={handleStop}
        onMouseLeave={handleStop}
        onTouchStart={handleStart}
        onTouchEnd={handleStop}
      >
        <div className="rec-zone-content">
          <svg className="rec-mic-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="1" width="6" height="11" rx="3" />
            <path d="M5 10a7 7 0 0 0 14 0" />
            <line x1="12" y1="17" x2="12" y2="21" />
            <line x1="8" y1="21" x2="16" y2="21" />
          </svg>
          <span className="rec-hint">
            {isRecording
              ? formatDuration(duration)
              : processing
                ? "Traitement en cours…"
                : step === "done"
                  ? "Espace pour redicter"
                  : "Maintenir espace pour dicter"}
          </span>
        </div>
        {isRecording && <div className="rec-glow" />}
      </div>

      <div className="section-label">Workflow</div>
      <Pipeline currentStep={step} />
      {error && <p className="error-message">{error}</p>}

      <div className="section-label-row">
        <span className="section-label" style={{ margin: 0 }}>Transcription brute</span>
        {rawTranscription && (
          <button
            className="btn-reformat"
            onClick={() => onReformat(rawTranscription)}
            disabled={reformatting}
            title="Relancer la mise en forme"
          >
            {reformatting ? "…" : "↻"}
          </button>
        )}
      </div>
      <div className="transcription-raw">
        {rawTranscription ? (
          <textarea
            className="raw-textarea"
            value={rawTranscription}
            onChange={(e) => onRawChange(e.target.value)}
          />
        ) : (
          <p className="placeholder-text">La transcription apparaîtra ici…</p>
        )}
      </div>

      {step === "done" && (
        <button className="btn btn-new" onClick={handleReset}>
          Nouvelle rédaction
        </button>
      )}
    </div>
  );
}
