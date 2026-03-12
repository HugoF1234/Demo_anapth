import { useState, useMemo } from "react";
import { marked } from "marked";
import { exportDocx } from "../services/api";

interface Props {
  report: string | null;
  onReportChange: (report: string) => void;
}

export default function ReportPanel({ report, onReportChange }: Props) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);

  const htmlContent = useMemo(() => {
    if (!report) return "";
    return marked.parse(report, { async: false }) as string;
  }, [report]);

  const handleCopy = async () => {
    if (!report) return;
    await navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportWord = async () => {
    if (!report) return;
    try {
      const blob = await exportDocx(report);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "compte-rendu.docx";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Erreur lors de l'export Word.");
    }
  };

  if (!report) {
    return (
      <div className="report-panel report-empty">
        <p>Le compte-rendu formaté apparaîtra ici après transcription.</p>
      </div>
    );
  }

  return (
    <div className="report-panel">
      <div className="report-header">
        <h2>Compte-rendu</h2>
        <div className="report-actions">
          <button
            className="btn-edit-toggle"
            onClick={() => setEditing(!editing)}
            title={editing ? "Aperçu" : "Modifier"}
          >
            {editing ? "Aperçu" : "Modifier"}
          </button>
          <button className="btn btn-export" onClick={handleExportWord}>
            Exporter .docx
          </button>
          <button className="btn btn-copy" onClick={handleCopy}>
            {copied ? "Copié ✓" : "Copier"}
          </button>
        </div>
      </div>
      {editing ? (
        <textarea
          className="report-textarea"
          value={report}
          onChange={(e) => onReportChange(e.target.value)}
        />
      ) : (
        <div
          className="report-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      )}
    </div>
  );
}
