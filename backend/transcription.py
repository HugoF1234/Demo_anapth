import httpx

from config import get_settings

VOXTRAL_API_URL = "https://api.mistral.ai/v1/audio/transcriptions"


async def transcribe_audio(audio_bytes: bytes, filename: str) -> str:
    """Send audio to Voxtral and return raw transcription."""
    settings = get_settings()

    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            VOXTRAL_API_URL,
            headers={"Authorization": f"Bearer {settings.voxtral_api_key}"},
            files={"file": (filename, audio_bytes, "audio/webm")},
            data={
                "model": "voxtral-mini-latest",
                "language": "fr",
            },
        )
        response.raise_for_status()
        data = response.json()

    return data.get("text", "")
