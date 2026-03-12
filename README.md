# Anapath – Dictée anatomopathologique

Application de dictée médicale pour anatomopathologistes. Dictez au micro, obtenez un compte-rendu structuré et formaté automatiquement grâce à Voxtral (transcription) et Mistral (mise en forme intelligente).

## Prérequis (macOS)

- **Python 3.9+** (inclus avec macOS / Xcode CLI tools)
- **Node.js 18+** et **npm** : `brew install node`

## Installation rapide

```bash
# 1. Cloner le repo
git clone https://github.com/HugoF1234/Demo_anapath.git
cd Demo_anapath

cp .env.example .env

cd backend
pip3 install -r requirements.txt
cd ..

cd frontend
npm install
cd ..
```

## Lancement

```bash
# Commande unique (lance backend + frontend, tue les anciens processus)
./start.sh
```

Ou manuellement dans deux terminaux :

```bash
# Terminal 1 – Backend (http://localhost:8000)
cd backend && python3 -m uvicorn main:app --reload

# Terminal 2 – Frontend (http://localhost:5173)
cd frontend && npm run dev
```

Ouvrir **http://localhost:5173** dans le navigateur.

## Utilisation

1. **Maintenir la barre espace** (ou cliquer dans la zone micro) pour dicter
2. **Relâcher** pour arrêter — le traitement se lance automatiquement
3. Le workflow défile : Envoi → Transcription → Lexia Intelligence → Terminé
4. Le **compte-rendu formaté** apparaît à droite
5. Modifier la transcription brute ou le compte-rendu si besoin
6. **Exporter en .docx** ou **Copier** le résultat

## Architecture

| Couche | Technologie |
|--------|-------------|
| Frontend | React 19 + TypeScript (Vite) |
| Backend | Python 3 + FastAPI |
| Transcription | Voxtral Mini (API Mistral Audio) |
| Mise en forme | Mistral Large (Chat) |

## Structure

```
├── backend/
│   ├── main.py              # Serveur FastAPI (endpoints /transcribe, /format, /export)
│   ├── config.py            # Gestion clés API via .env
│   ├── transcription.py     # Appel Voxtral
│   ├── formatting.py        # Prompt métier + appel Mistral
│   ├── export_docx.py       # Génération Word
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── App.tsx           # Layout principal
│       ├── components/       # RecorderPanel, ReportPanel, Pipeline
│       ├── hooks/            # useAudioRecorder, useSoundFeedback
│       └── services/api.ts   # Client HTTP
├── regles_metier_anapath.md  # Règles métier (référence)
├── start.sh                  # Script de lancement
├── .env.example              # Template variables d'environnement
└── .gitignore
```
