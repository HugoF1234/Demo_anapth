const API_BASE = import.meta.env.VITE_API_URL ?? "";

export interface TranscriptionResult {
  raw_transcription: string;
}

export interface FormatResult {
  formatted_report: string;
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("file", audioBlob, "recording.webm");

  const response = await fetch(`${API_BASE}/transcribe`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Erreur inconnue" }));
    throw new Error(error.detail ?? `Erreur HTTP ${response.status}`);
  }

  const data: TranscriptionResult = await response.json();
  return data.raw_transcription;
}

export async function formatTranscription(rawText: string): Promise<string> {
  const response = await fetch(`${API_BASE}/format`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ raw_text: rawText }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Erreur inconnue" }));
    throw new Error(error.detail ?? `Erreur HTTP ${response.status}`);
  }

  const data: FormatResult = await response.json();
  return data.formatted_report;
}

export async function exportDocx(formattedReport: string): Promise<Blob> {
  const response = await fetch(`${API_BASE}/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ formatted_report: formattedReport }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Erreur inconnue" }));
    throw new Error(error.detail ?? `Erreur HTTP ${response.status}`);
  }

  return response.blob();
}
