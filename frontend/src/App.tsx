import { useState, useCallback } from "react";
import RecorderPanel from "./components/RecorderPanel";
import ReportPanel from "./components/ReportPanel";
import { formatTranscription } from "./services/api";
import "./App.css";

export default function App() {
  const [rawTranscription, setRawTranscription] = useState<string | null>(null);
  const [report, setReport] = useState<string | null>(null);
  const [reformatting, setReformatting] = useState(false);

  const handleReset = () => {
    setRawTranscription(null);
    setReport(null);
  };

  const handleReformat = useCallback(async (text: string) => {
    if (!text.trim() || reformatting) return;
    setReformatting(true);
    try {
      const formatted = await formatTranscription(text);
      setReport(formatted);
    } catch {
      alert("Erreur lors de la mise en forme.");
    } finally {
      setReformatting(false);
    }
  }, [reformatting]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Démo</h1>
        <span className="app-subtitle">Dictée anatomopathologique</span>
      </header>
      <main className="app-main">
        <section className="panel panel-left">
          <RecorderPanel
            rawTranscription={rawTranscription}
            onTranscription={setRawTranscription}
            onFormatted={setReport}
            onReset={handleReset}
            onRawChange={setRawTranscription}
            onReformat={handleReformat}
            reformatting={reformatting}
          />
        </section>
        <section className="panel panel-right">
          <ReportPanel report={report} onReportChange={setReport} />
        </section>
      </main>
    </div>
  );
}
