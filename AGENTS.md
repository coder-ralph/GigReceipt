<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## GigReceipt Project Instructions

- **Stack:** Next.js 16, TypeScript, Tailwind CSS, Ollama, Zod, and Dexie/IndexedDB.
- **AI extraction:** Use a vision-capable Ollama model and validate extracted data using the existing Zod schema.
- **Privacy:** Keep receipt images and expense records in browser-local storage. Do not introduce cloud storage or external AI APIs without an explicit requirement.
- **Reliability:** Treat model output as untrusted. Allow users to review and correct extracted details, and never assume missing receipt values.
- **Development:** Run `npx tsc --noEmit`, `npm run lint`, and `npm run build` after relevant changes.
- **Scope:** Avoid unrelated redesigns and preserve the existing UI unless a change requires them.