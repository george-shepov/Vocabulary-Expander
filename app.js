const STORAGE_KEY = 'vocabulary-expander-cards';
const MODE_KEY = 'vocabulary-expander-storage-mode';
const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT UNIQUE NOT NULL,
    meaning TEXT NOT NULL
  );
`;

const state = {
  cards: [],
  cardIndex: 0,
  db: null,
  sqliteReady: false,
};

const ui = {
  addForm: document.getElementById('addForm'),
  word: document.getElementById('word'),
  meaning: document.getElementById('meaning'),
  status: document.getElementById('status'),
  flashcard: document.getElementById('flashcard'),
  nextCard: document.getElementById('nextCard'),
  wordList: document.getElementById('wordList'),
  storageMode: document.getElementById('storageMode'),
  initSqlite: document.getElementById('initSqlite'),
};

function setStatus(message) {
  ui.status.textContent = message;
}

function saveLocal(cards) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function persistSqliteDb() {
  if (!state.db) return;
  const data = state.db.export();
  const binary = Array.from(data, (byte) => String.fromCharCode(byte)).join('');
  const b64 = btoa(binary);
  localStorage.setItem('vocabulary-expander-sqlite', b64);
}

function loadSqliteDb(SQL) {
  const encoded = localStorage.getItem('vocabulary-expander-sqlite');
  if (!encoded) return new SQL.Database();
  const bytes = Uint8Array.from(atob(encoded), (ch) => ch.charCodeAt(0));
  return new SQL.Database(bytes);
}

async function initSqlite() {
  if (!window.initSqlJs) {
    setStatus('SQLite library failed to load. Check your connection or use localStorage mode.');
    return false;
  }

  try {
    const SQL = await window.initSqlJs({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/sql.js@1.12.0/dist/${file}`,
    });
    state.db = loadSqliteDb(SQL);
    state.db.exec(CREATE_TABLE_SQL);
    persistSqliteDb();
    state.sqliteReady = true;
    setStatus('SQLite initialized in browser.');
    return true;
  } catch {
    setStatus('Could not initialize SQLite, using localStorage.');
    return false;
  }
}

function readSqliteCards() {
  if (!state.db) return [];
  const result = state.db.exec('SELECT word, meaning FROM cards ORDER BY word');
  if (!result.length) return [];

  const { values } = result[0];
  return values.map(([word, meaning]) => ({ word, meaning }));
}

function insertSqliteCard(card) {
  if (!state.db) return false;

  try {
    state.db.run('INSERT INTO cards (word, meaning) VALUES (?, ?)', [
      card.word,
      card.meaning,
    ]);
    persistSqliteDb();
    return true;
  } catch {
    return false;
  }
}

function getStorageMode() {
  return localStorage.getItem(MODE_KEY) || 'localStorage';
}

function setStorageMode(mode) {
  localStorage.setItem(MODE_KEY, mode);
}

function renderList() {
  ui.wordList.innerHTML = '';
  for (const card of state.cards) {
    const item = document.createElement('li');
    const word = document.createElement('strong');
    word.textContent = card.word;
    const meaning = document.createElement('span');
    meaning.textContent = card.meaning;
    item.append(word, meaning);
    ui.wordList.appendChild(item);
  }
}

function renderFlashcard() {
  if (!state.cards.length) {
    ui.flashcard.classList.add('empty');
    ui.flashcard.textContent = 'No cards yet.';
    return;
  }

  const card = state.cards[state.cardIndex % state.cards.length];
  ui.flashcard.classList.remove('empty');
  ui.flashcard.innerHTML = '';
  const word = document.createElement('strong');
  word.textContent = card.word;
  const meaning = document.createElement('p');
  meaning.textContent = card.meaning;
  ui.flashcard.append(word, meaning);
}

function refreshCardsFromStore() {
  const mode = getStorageMode();
  if (mode === 'sqlite' && state.sqliteReady) {
    state.cards = readSqliteCards();
  } else {
    state.cards = loadLocal();
  }
  renderList();
  renderFlashcard();
}

ui.nextCard.addEventListener('click', () => {
  if (!state.cards.length) return;
  state.cardIndex += 1;
  renderFlashcard();
});

ui.addForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const card = {
    word: ui.word.value.trim(),
    meaning: ui.meaning.value.trim(),
  };

  if (!card.word || !card.meaning) {
    setStatus('Word and meaning are required.');
    return;
  }

  const mode = getStorageMode();
  if (mode === 'sqlite') {
    if (!state.sqliteReady) {
      const ready = await initSqlite();
      if (!ready) {
        setStorageMode('localStorage');
        ui.storageMode.value = 'localStorage';
      }
    }
  }

  if (getStorageMode() === 'sqlite' && state.sqliteReady) {
    if (!insertSqliteCard(card)) {
      setStatus('Word already exists in SQLite storage.');
      return;
    }
  } else {
    const existing = loadLocal();
    if (existing.some((item) => item.word === card.word)) {
      setStatus('Word already exists in localStorage.');
      return;
    }
    existing.push(card);
    saveLocal(existing);
  }

  ui.addForm.reset();
  refreshCardsFromStore();
  setStatus(`Saved "${card.word}".`);
});

ui.storageMode.addEventListener('change', async (event) => {
  const mode = event.target.value;
  setStorageMode(mode);

  if (mode === 'sqlite' && !state.sqliteReady) {
    await initSqlite();
  }

  refreshCardsFromStore();
  setStatus(`Storage mode: ${getStorageMode()}.`);
});

ui.initSqlite.addEventListener('click', async () => {
  await initSqlite();
  refreshCardsFromStore();
});

(async function bootstrap() {
  const mode = getStorageMode();
  ui.storageMode.value = mode;

  if (mode === 'sqlite') {
    await initSqlite();
  }

  refreshCardsFromStore();
  setStatus(`Ready (${mode}).`);
})();
