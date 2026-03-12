from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import io

from transcription import transcribe_audio
from formatting import format_transcription
from export_docx import markdown_to_docx

app = FastAPI(title="Anapath – Dictée médicale", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TranscriptionResponse(BaseModel):
    raw_transcription: str


class FormatRequest(BaseModel):
    raw_text: str


class FormatResponse(BaseModel):
    formatted_report: str


class ExportRequest(BaseModel):
    formatted_report: str
    title: str = "Compte-rendu anatomopathologique"


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe(file: UploadFile = File(...)):
    """Step 1: Transcribe audio via Voxtral."""
    if not file.content_type or not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="Le fichier doit être un fichier audio.")

    audio_bytes = await file.read()
    if len(audio_bytes) == 0:
        raise HTTPException(status_code=400, detail="Fichier audio vide.")

    try:
        raw_text = await transcribe_audio(audio_bytes, file.filename or "recording.webm")
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Erreur transcription Voxtral : {exc}")

    return TranscriptionResponse(raw_transcription=raw_text)


@app.post("/format", response_model=FormatResponse)
async def format_text(req: FormatRequest):
    """Step 2: Format raw transcription via Mistral."""
    if not req.raw_text.strip():
        raise HTTPException(status_code=400, detail="Texte vide.")

    try:
        formatted = await format_transcription(req.raw_text)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Erreur formatting Mistral : {exc}")

    return FormatResponse(formatted_report=formatted)


@app.post("/export")
async def export_docx(req: ExportRequest):
    """Step 3: Export formatted report as .docx."""
    try:
        doc_bytes = markdown_to_docx(req.formatted_report, req.title)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Erreur export Word : {exc}")

    buffer = io.BytesIO(doc_bytes)
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": "attachment; filename=compte-rendu.docx"},
    )
