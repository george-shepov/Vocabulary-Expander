const sampleTexts = {
  short: `A curious student opened a worn notebook and discovered unfamiliar words in every paragraph.
Instead of skipping them, she paused, explored each meaning, and slowly transformed confusion into confidence.`,
  medium: `Chapter-style sample:\n\nThe village library had one strict rule: readers must carry a pencil. Whenever they met an unusual word, they wrote it down, guessed its meaning from context, and verified it later. Over months, their vocabulary quietly expanded, and stories that once felt difficult became inviting and vivid.`,
  long: `Classic-book style excerpt:\n\nIt is a truth universally acknowledged, that a learner in possession of an ordinary dictionary, must be in want of context. Words do not live alone; they travel with tone, intention, and history. A patient reader notices how one expression can be ironic in one chapter and sincere in the next. By tracking these shifts, the reader gains not only definitions, but judgment. This is why deliberate vocabulary practice matters: each new word broadens what can be felt, understood, and expressed.`
};

const dictionaryApiUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const translationApiUrl = 'https://api.mymemory.translated.net/get';

const textInput = document.getElementById('text-input');
const tokenizedText = document.getElementById('tokenized-text');
const flashcards = document.getElementById('flashcards');
const languageSelector = document.getElementById('language-selector');
const fileInput = document.getElementById('file-input');
const sampleSelector = document.getElementById('sample-text-selector');
const parserPaths = {
  pdfModule:
    window.VOCAB_PARSER_PATHS?.pdfModule || './node_modules/pdfjs-dist/legacy/build/pdf.mjs',
  pdfWorker:
    window.VOCAB_PARSER_PATHS?.pdfWorker ||
    './node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs'
};
let pdfjsImport;

function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function collectMeaningData(apiResponse) {
  const firstMeaning = apiResponse?.[0]?.meanings?.[0];
  const definition = firstMeaning?.definitions?.[0]?.definition || 'Definition not found.';

  const synonyms = new Set();
  const antonyms = new Set();
  const examples = [];

  for (const entry of apiResponse || []) {
    for (const meaning of entry.meanings || []) {
      (meaning.synonyms || []).forEach((word) => synonyms.add(word));
      (meaning.antonyms || []).forEach((word) => antonyms.add(word));
      for (const item of meaning.definitions || []) {
        (item.synonyms || []).forEach((word) => synonyms.add(word));
        (item.antonyms || []).forEach((word) => antonyms.add(word));
        if (item.example) {
          examples.push(item.example);
        }
      }
    }
  }

  return {
    definition,
    synonyms: Array.from(synonyms).slice(0, 5),
    antonyms: Array.from(antonyms).slice(0, 5),
    examples: examples.slice(0, 3)
  };
}

async function fetchWordInfo(word) {
  try {
    const response = await fetch(`${dictionaryApiUrl}${encodeURIComponent(word)}`);
    if (!response.ok) {
      return {
        definition: 'Definition unavailable from dictionary service.',
        synonyms: [],
        antonyms: [],
        examples: []
      };
    }
    const data = await response.json();
    return collectMeaningData(data);
  } catch {
    return {
      definition: 'Definition unavailable (network issue).',
      synonyms: [],
      antonyms: [],
      examples: []
    };
  }
}

async function fetchTranslation(word, language) {
  if (language === 'en') {
    return 'English-English mode enabled';
  }

  const query = new URLSearchParams({
    q: word,
    langpair: `en|${language}`
  });

  try {
    const response = await fetch(`${translationApiUrl}?${query}`);
    if (!response.ok) {
      return 'Translation unavailable.';
    }
    const payload = await response.json();
    return payload?.responseData?.translatedText || 'Translation unavailable.';
  } catch {
    return 'Translation unavailable (network issue).';
  }
}

function renderSelectableText(text) {
  tokenizedText.innerHTML = '';
  // Keep natural words together across alphabets (Unicode letters + apostrophes/hyphens).
  const fragments = text.match(/\p{L}[-\p{L}'’]*|[^\p{L}]+/gu) || [];

  for (const fragment of fragments) {
    if (/^\p{L}/u.test(fragment)) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'word-token';
      button.textContent = fragment;
      button.dataset.word = fragment.toLowerCase();
      tokenizedText.appendChild(button);
    } else {
      tokenizedText.appendChild(document.createTextNode(fragment));
    }
  }
}

function createList(items, emptyFallback) {
  if (!items.length) {
    return `<p class="muted">${escapeHtml(emptyFallback)}</p>`;
  }

  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

async function addFlashcard(word) {
  const [info, translation] = await Promise.all([
    fetchWordInfo(word),
    fetchTranslation(word, languageSelector.value)
  ]);

  const card = document.createElement('article');
  card.className = 'flashcard';
  card.innerHTML = `
    <h3>${escapeHtml(word)}</h3>
    <p><strong>Explanation:</strong> ${escapeHtml(info.definition)}</p>
    <p><strong>Translation:</strong> ${escapeHtml(translation)}</p>
    <p><strong>Synonyms:</strong></p>
    ${createList(info.synonyms, 'No synonyms returned.')}
    <p><strong>Antonyms:</strong></p>
    ${createList(info.antonyms, 'No antonyms returned.')}
    <p><strong>Examples:</strong></p>
    ${createList(info.examples, 'No examples returned.')}
  `;

  flashcards.prepend(card);
}

async function extractTextFromFile(file) {
  const name = file.name.toLowerCase();
  const buffer = await file.arrayBuffer();

  if (name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.markdown')) {
    return new TextDecoder().decode(buffer);
  }

  if (name.endsWith('.docx')) {
    if (typeof mammoth === 'undefined') {
      throw new Error('DOCX parser failed to load.');
    }
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    return result.value;
  }

  if (name.endsWith('.pdf')) {
    pdfjsImport = pdfjsImport || import(parserPaths.pdfModule);
    const pdfjsLib = await pdfjsImport;
    pdfjsLib.GlobalWorkerOptions.workerSrc = parserPaths.pdfWorker;

    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const pages = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => item.str).join(' '));
    }

    return pages.join('\n\n');
  }

  throw new Error('Unsupported file format. Use .txt, .md, .docx, or .pdf.');
}

document.getElementById('render-text').addEventListener('click', () => {
  renderSelectableText(textInput.value.trim());
});

document.getElementById('load-sample').addEventListener('click', () => {
  const choice = sampleSelector.value;
  if (!choice) {
    return;
  }

  textInput.value = sampleTexts[choice];
  renderSelectableText(textInput.value);
});

tokenizedText.addEventListener('click', (event) => {
  const button = event.target.closest('.word-token');
  if (!button) {
    return;
  }
  addFlashcard(button.dataset.word);
});

fileInput.addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  try {
    const extracted = await extractTextFromFile(file);
    textInput.value = extracted;
    renderSelectableText(extracted);
  } catch (error) {
    textInput.value = `Could not load file: ${error.message}`;
    tokenizedText.innerHTML = '';
  }
});
