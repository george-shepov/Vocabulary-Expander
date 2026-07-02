# Vocabulary Expander

Browser-based vocabulary assessment and learning app for estimating receptive vocabulary, collecting unfamiliar words from any text, and turning those words into flashcards.

## Features

- Estimate general receptive English vocabulary with a 20-question, frequency-banded prototype
- Report an approximate range rather than a falsely precise word count
- Measure domain terminology separately:
  - software development
  - legal/court vocabulary
- Store one shared browser profile under `gs_vocab_profile_v1`
- Share the estimate, domain scores, and unfamiliar-word queue with:
  - FieldKit
  - Developer Interview Prep
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

## Shared integration module

`vocabulary-toolkit.js` and `vocabulary-toolkit.css` provide the reusable assessment/profile UI consumed by the other applications.

```html
<link rel="stylesheet" href="/Vocabulary-Expander/vocabulary-toolkit.css">
<div id="vocabularyToolkit"></div>
<script src="/Vocabulary-Expander/vocabulary-toolkit.js"></script>
<script>
  VocabularyToolkit.mount(document.getElementById('vocabularyToolkit'), {
    defaultBank: 'developer',
    showReader: true,
    sourceLabel: 'My App'
  });
</script>
```

The general estimate is intentionally described as a prototype. A production-grade claim would require a larger validated question bank, calibration data, and confidence-interval analysis.

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
