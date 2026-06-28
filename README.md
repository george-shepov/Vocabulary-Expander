# Vocabulary-Expander

Phone-first vocabulary flashcard app that runs directly in the browser.

## Features
- Mobile-first responsive UI
- Add words and meanings quickly
- Flashcard view to rotate through saved words
- Storage modes:
  - `localStorage` (default)
  - embedded SQLite in browser via `sql.js` (optional)

## Run
No build step is required.

Open `/home/runner/work/Vocabulary-Expander/Vocabulary-Expander/index.html` in a browser.

## Notes
- SQLite mode stores the SQLite database bytes in browser `localStorage`.
- If SQLite fails to load, the app automatically falls back to `localStorage`.
