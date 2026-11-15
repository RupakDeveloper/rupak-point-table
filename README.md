# Dropzone — Free Fire Point Table Studio

A no-login React/Vite point-table builder with manual score entry, editable tournament branding, PNG/PDF export, and optional Gemini vision extraction.

## Run locally
1. Install Node.js 20 or newer.
2. In this folder run `npm install`
3. Run `npm run dev`

## Enable AI screenshot reading
The manual builder and exports work without an API key. AI extraction uses Google's Gemini 2.5 Flash vision endpoint through the included Vercel serverless function.

1. Create a Gemini API key in Google AI Studio.
2. For local development, create `.env` with `GEMINI_API_KEY=your_key` and run using Vercel CLI (`vercel dev`) so `/api/parse-results` is available.
3. On Vercel, open Project → Settings → Environment Variables and add `GEMINI_API_KEY`, then redeploy.

Never put the API key in `VITE_` variables or frontend source. Keep it server-side.

## Included assets
- `public/assets/creator-portrait.png`: supplied creator portrait, used as the default brand avatar/logo.
- `public/assets/eagle-reference-template.jpg`: supplied reference artwork used as the base point-table poster.

## Notes
- AI output is a draft. Verify names and scores before publishing; no vision model can guarantee accurate reading of severely blurred or obstructed values.
- This first version keeps scoring simple: total = placement points + (kills × kill point value). You can change the kill point value.
- Match-count selector is included; per-match entry grids and advanced tie-break configuration can be added in the next iteration.
