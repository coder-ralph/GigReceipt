# GigReceipt

**Turn receipt photos into organized expenses with local AI.**

GigReceipt is a local-first receipt and expense organizer built with Next.js, TypeScript, and Ollama. It extracts transaction details from receipt images, lets users review the results, stores expense records in browser-local IndexedDB, and exports them to CSV.

## Features

- Upload JPEG, PNG, and WebP receipt images.
- Extract merchant, date, total, currency, category, payment method, and notes with a local vision model.
- Review and correct extracted values before saving.
- Store receipt images and expense records in IndexedDB.
- Edit and delete saved expenses.
- Export expense records to CSV.
- Handle unavailable models and extraction errors.

## Requirements

- Node.js compatible with the installed Next.js version.
- npm.
- Ollama installed locally.
- An Ollama vision model compatible with image input.

## Getting started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

On Windows PowerShell, you can use:

```powershell
Copy-Item .env.example .env.local
```

Configure `OLLAMA_MODEL` to match an installed vision model.

Download a model if necessary:

```bash
ollama pull gemma4
```

Start Ollama, then start the application:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `OLLAMA_BASE_URL` | `http://127.0.0.1:11434` | Local Ollama API address |
| `OLLAMA_MODEL` | `gemma4` | Installed vision model |

## Privacy and storage

The application sends receipt images to the configured Ollama endpoint for extraction. In the intended local setup, that endpoint runs on the user's computer.

Confirmed expense records and receipt images are stored in the browser's IndexedDB database. They are not automatically synchronized to another device or cloud database.

Browser storage can be cleared by the user or browser, so important records should be exported regularly.

## Deployment limitations

Deploying the Next.js frontend to a hosting platform does not make a developer's local Ollama instance accessible to remote visitors. A hosted deployment requires a separate, securely configured inference architecture.

Do not expose an unauthenticated Ollama proxy to the public internet.

## Project status

Hacktoberfest 2026 — Week 2: Side Hustle challenge.

This project is an MVP in development. Extraction quality depends on receipt image quality and the selected model. Users should verify all extracted amounts and dates.
