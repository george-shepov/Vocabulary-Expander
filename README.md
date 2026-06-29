# Vocabulary-Expander

Simple browser app for learning unfamiliar words from any text.

## Features

- Load English content from:
  - plain text (`.txt`)
  - markdown (`.md`, `.markdown`)
  - Word (`.docx`)
  - PDF (`.pdf`)
- Choose sample texts (short, medium, long classic-style excerpt) to test vocabulary level.
- Render text into selectable words.
- Click any word to generate a flashcard with:
  - English explanation (English-English mode)
  - synonyms
  - antonyms
  - usage examples
- Optional translations to:
  - Russian
  - Spanish
  - French
  - German
  - Chinese
  - Ukrainian

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
