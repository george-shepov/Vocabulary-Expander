# Vocabulary Expander

Browser-based vocabulary assessment and learning app for estimating receptive vocabulary, collecting unfamiliar words from any text, and turning those words into flashcards.

## Features

- Estimate general receptive English vocabulary with a 20-question, frequency-banded prototype
- Penalize incorrect guesses while allowing an explicit “I do not know” answer
- Report an approximate range rather than a falsely precise word count
- Keep an app-local vocabulary estimate and unfamiliar-word learning queue
- Load English content from:
  - plain text (`.txt`)
  - markdown (`.md`, `.markdown`)
  - Word (`.docx`)
  - PDF (`.pdf`)
- Render text into selectable words
- Click an unfamiliar word to save it and generate a flashcard with:
  - English explanation
  - synonyms
  - antonyms
  - usage examples
- Optional translations to Russian, Spanish, French, German, Chinese, and Ukrainian
- Installable application shell with offline caching for local assets

## Estimator limitation

The current 20-question assessment is a practical prototype. It should report a broad approximate range, not claim a validated or exact vocabulary count. A production-grade estimate would require a larger frequency-calibrated question bank, representative user testing, and confidence-interval analysis.

## Relationship to FieldKit

Vocabulary Expander remains its own application and repository. FieldKit may list it in the suite launcher, but FieldKit does not own or merge this app’s question bank, storage, or release lifecycle.

## Run

```bash
npm install
npm start
```

Then open `http://127.0.0.1:4173/index.html` in a browser.

## Validation

```bash
npm test
```
