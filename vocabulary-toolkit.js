(() => {
  'use strict';

  const PROFILE_KEY = 'vocabulary_expander_profile_v1';
  const SCHEMA_VERSION = 1;

  const QUESTIONS = [
    { word: 'policy', sentence: 'The company changed its policy.', answer: 'Official rule or plan', distractors: ['Financial loss', 'Physical location', 'Public celebration'], band: 1 },
    { word: 'prevent', sentence: 'The new barrier may prevent entry.', answer: 'Stop something from happening', distractors: ['Make something more expensive', 'Describe something carefully', 'Permit something temporarily'], band: 1 },
    { word: 'concept', sentence: 'She understood the basic concept.', answer: 'General idea', distractors: ['Physical object', 'Historical document', 'Personal obligation'], band: 2 },
    { word: 'evidence', sentence: 'The court examined the evidence.', answer: 'Information supporting whether something is true', distractors: ['Proposed punishment', 'Personal disagreement', 'Official meeting schedule'], band: 2 },
    { word: 'adequate', sentence: 'The available space was adequate.', answer: 'Sufficient for the purpose', distractors: ['Extremely expensive', 'Carefully hidden', 'Permanently damaged'], band: 3 },
    { word: 'accurate', sentence: 'The measurements were accurate.', answer: 'Correct and precise', distractors: ['Difficult to obtain', 'Recorded secretly', 'Larger than expected'], band: 3 },
    { word: 'facility', sentence: 'They inspected the facility.', answer: 'Place designed for a particular activity', distractors: ['Written agreement', 'Transportation schedule', 'Group of elected officials'], band: 4 },
    { word: 'mixture', sentence: 'The mixture was heated slowly.', answer: 'Combination of different substances', distractors: ['Tool used for measurement', 'Written instructions', 'Storage container'], band: 4 },
    { word: 'mutual', sentence: 'Their respect was mutual.', answer: 'Shared by both sides', distractors: ['Required by law', 'Based on financial need', 'Kept completely secret'], band: 5 },
    { word: 'heritage', sentence: 'The town protected its heritage.', answer: 'Traditions and history inherited from the past', distractors: ['Future development plans', 'Agricultural equipment', 'Local transportation network'], band: 5 },
    { word: 'renowned', sentence: 'The scientist became renowned.', answer: 'Widely known and respected', distractors: ['Frequently criticized', 'Financially dependent', 'Legally responsible'], band: 6 },
    { word: 'retreat', sentence: 'The soldiers began to retreat.', answer: 'Move away from danger or an opponent', distractors: ['Establish a permanent base', 'Exchange equipment', 'Request information'], band: 6 },
    { word: 'discourse', sentence: 'Her discourse was difficult to follow.', answer: 'Extended discussion or communication', distractors: ['Physical movement', 'Financial calculation', 'Formal punishment'], band: 7 },
    { word: 'neutral', sentence: 'The mediator remained neutral.', answer: 'Not supporting either side', distractors: ['Unable to communicate', 'Personally responsible', 'Strongly opposed'], band: 7 },
    { word: 'subsidiary', sentence: 'The subsidiary submitted its report.', answer: 'Company controlled by another company', distractors: ['Legal witness', 'Government department', 'Temporary committee'], band: 8 },
    { word: 'sensitive', sentence: 'This material is sensitive to heat.', answer: 'Easily affected by something', distractors: ['Expensive to produce', 'Impossible to transport', 'Made from natural ingredients'], band: 8 },
    { word: 'jurisdiction', sentence: 'The matter falls under federal jurisdiction.', answer: 'Official legal authority', distractors: ['Financial assistance', 'Public criticism', 'Scientific classification'], band: 9 },
    { word: 'sanctions', sentence: 'The country imposed sanctions.', answer: 'Penalties intended to influence behavior', distractors: ['Trade agreements', 'Military celebrations', 'Emergency elections'], band: 9 },
    { word: 'monopoly', sentence: 'The investigation concerned a monopoly.', answer: 'Exclusive control of a market', distractors: ['Temporary partnership', 'Public disagreement', 'System of taxation'], band: 10 },
    { word: 'obsession', sentence: 'His obsession disrupted his work.', answer: 'Persistent and excessive preoccupation', distractors: ['Temporary employment', 'Reasonable concern', 'Professional qualification'], band: 10 }
  ];

  function safeParse(value, fallback) {
    try { return JSON.parse(value); } catch (_) { return fallback; }
  }

  function loadProfile() {
    const parsed = safeParse(localStorage.getItem(PROFILE_KEY), {}) || {};
    return {
      schemaVersion: SCHEMA_VERSION,
      updatedAt: parsed.updatedAt || null,
      estimate: Number.isFinite(parsed.estimate) ? parsed.estimate : null,
      range: Array.isArray(parsed.range) ? parsed.range : null,
      assessment: parsed.assessment && typeof parsed.assessment === 'object' ? parsed.assessment : null,
      learningWords: Array.isArray(parsed.learningWords) ? parsed.learningWords : []
    };
  }

  function saveProfile(profile) {
    profile.schemaVersion = SCHEMA_VERSION;
    profile.updatedAt = new Date().toISOString();
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('vocabulary-expander-profile-updated', { detail: profile }));
    return profile;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[char]));
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function rememberWord(word, source = 'reader') {
    const normalized = String(word || '').trim().toLowerCase();
    if (!normalized) return loadProfile();

    const profile = loadProfile();
    const existing = profile.learningWords.find(item => item.word === normalized);
    if (existing) {
      existing.lastSeenAt = new Date().toISOString();
      existing.count = (existing.count || 1) + 1;
      existing.sources = Array.isArray(existing.sources) ? existing.sources : [];
      if (source && !existing.sources.includes(source)) existing.sources.push(source);
    } else {
      profile.learningWords.unshift({
        word: normalized,
        addedAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
        count: 1,
        sources: [source]
      });
    }

    profile.learningWords = profile.learningWords.slice(0, 500);
    return saveProfile(profile);
  }

  function removeLearningWord(word) {
    const normalized = String(word || '').trim().toLowerCase();
    const profile = loadProfile();
    profile.learningWords = profile.learningWords.filter(item => item.word !== normalized);
    return saveProfile(profile);
  }

  function rangeForEstimate(estimate) {
    return [
      Math.max(0, Math.round((estimate - 1000) / 500) * 500),
      Math.min(12000, Math.round((estimate + 1000) / 500) * 500)
    ];
  }

  function scoreAssessment(responses) {
    const correct = responses.filter(item => item.status === 'correct').length;
    const wrong = responses.filter(item => item.status === 'wrong').length;
    const unknown = responses.filter(item => item.status === 'unknown').length;
    const adjusted = Math.max(0, correct - wrong / 3);
    const estimate = Math.round((adjusted * 500) / 100) * 100;

    return {
      correct,
      wrong,
      unknown,
      total: QUESTIONS.length,
      adjusted: Number(adjusted.toFixed(2)),
      estimate,
      range: rangeForEstimate(estimate),
      completedAt: new Date().toISOString()
    };
  }

  function emphasizeWord(sentence, word) {
    const safeSentence = escapeHtml(sentence);
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return safeSentence.replace(new RegExp(`\\b${escapedWord}\\b`, 'i'), `<strong>${escapeHtml(word)}</strong>`);
  }

  function mount(root, config = {}) {
    if (!root) return;

    const settings = {
      showReader: config.showReader === true,
      sourceLabel: config.sourceLabel || 'Vocabulary-Expander',
      sampleText: config.sampleText || 'Paste a passage here, then select words you do not recognize.'
    };

    let questions = [];
    let responses = [];
    let currentIndex = 0;

    root.classList.add('vocab-toolkit');
    root.innerHTML = `
      <section class="vocab-profile-card" id="vocabProfileCard"></section>
      <section class="vocab-card">
        <div class="vocab-section-head">
          <div>
            <h2>Vocabulary-size estimate</h2>
            <p>Choose “I do not know” instead of guessing. Incorrect guesses reduce the adjusted score.</p>
          </div>
          <button class="vocab-secondary" id="vocabResetProfile" type="button">Reset result</button>
        </div>
        <div id="vocabAssessmentBody"></div>
      </section>
      ${settings.showReader ? `
        <section class="vocab-card">
          <h2>Unknown-word collector</h2>
          <textarea id="vocabReaderInput" rows="7">${escapeHtml(settings.sampleText)}</textarea>
          <div class="vocab-actions">
            <button class="vocab-primary" id="vocabRenderReader" type="button">Render words</button>
            <button class="vocab-secondary" id="vocabClearWords" type="button">Clear learning queue</button>
          </div>
          <div id="vocabReaderOutput" class="vocab-reader-output"></div>
        </section>
      ` : ''}
      <section class="vocab-card">
        <div id="vocabLearningQueue"></div>
      </section>
    `;

    const profileCard = root.querySelector('#vocabProfileCard');
    const assessmentBody = root.querySelector('#vocabAssessmentBody');

    function renderProfile() {
      const profile = loadProfile();
      const estimate = Number.isFinite(profile.estimate)
        ? `${profile.estimate.toLocaleString()} word families`
        : 'Not estimated';
      const range = Array.isArray(profile.range)
        ? `${profile.range[0].toLocaleString()}–${profile.range[1].toLocaleString()}`
        : '—';

      profileCard.innerHTML = `
        <div>
          <span class="vocab-eyebrow">Vocabulary Expander profile</span>
          <h2>${escapeHtml(estimate)}</h2>
          <p>Approximate receptive range: <strong>${escapeHtml(range)}</strong>. This is a short prototype, not a validated diagnostic.</p>
        </div>
        <div class="vocab-metrics">
          <div><strong>${profile.assessment?.correct ?? '—'}</strong><span>Correct</span></div>
          <div><strong>${profile.assessment?.wrong ?? '—'}</strong><span>Wrong</span></div>
          <div><strong>${profile.assessment?.unknown ?? '—'}</strong><span>Unknown</span></div>
          <div><strong>${profile.learningWords.length}</strong><span>Words to learn</span></div>
        </div>
      `;

      renderLearningQueue();
    }

    function renderAssessmentIntro() {
      const previous = loadProfile().assessment;
      assessmentBody.innerHTML = `
        <div class="vocab-intro">
          <h3>20-question receptive vocabulary prototype</h3>
          <p>The questions sample progressively less-common words. The result is reported as a range because a short test cannot support an exact word count.</p>
          <p class="vocab-muted">${previous ? `Previous estimate: ${previous.range[0].toLocaleString()}–${previous.range[1].toLocaleString()} word families.` : 'No previous result.'}</p>
          <button class="vocab-primary" id="vocabStartAssessment" type="button">Start assessment</button>
        </div>
      `;
      assessmentBody.querySelector('#vocabStartAssessment').addEventListener('click', startAssessment);
    }

    function startAssessment() {
      questions = shuffle(QUESTIONS.map(question => ({ ...question })));
      responses = [];
      currentIndex = 0;
      renderQuestion();
    }

    function renderQuestion() {
      const question = questions[currentIndex];
      const options = shuffle([question.answer, ...question.distractors]);

      assessmentBody.innerHTML = `
        <div class="vocab-progress">
          <span>${currentIndex + 1} of ${questions.length}</span>
          <progress value="${currentIndex + 1}" max="${questions.length}"></progress>
        </div>
        <article class="vocab-question">
          <p class="vocab-sentence">${emphasizeWord(question.sentence, question.word)}</p>
          <div class="vocab-options">
            ${options.map(option => `<button type="button" data-answer="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join('')}
            <button type="button" class="unknown" data-unknown="true">I do not know</button>
          </div>
        </article>
      `;

      assessmentBody.querySelectorAll('[data-answer]').forEach(button => {
        button.addEventListener('click', () => {
          answerQuestion(button.dataset.answer === question.answer ? 'correct' : 'wrong', question);
        });
      });
      assessmentBody.querySelector('[data-unknown]').addEventListener('click', () => answerQuestion('unknown', question));
    }

    function answerQuestion(status, question) {
      responses.push({ word: question.word, status });
      if (status !== 'correct') rememberWord(question.word, `${settings.sourceLabel}:assessment`);
      currentIndex += 1;
      if (currentIndex < questions.length) renderQuestion();
      else finishAssessment();
    }

    function finishAssessment() {
      const result = scoreAssessment(responses);
      const profile = loadProfile();
      profile.estimate = result.estimate;
      profile.range = result.range;
      profile.assessment = result;
      saveProfile(profile);

      assessmentBody.innerHTML = `
        <div class="vocab-result">
          <span class="vocab-eyebrow">Estimated receptive vocabulary</span>
          <h3>${result.estimate.toLocaleString()} word families</h3>
          <p>Report this as approximately <strong>${result.range[0].toLocaleString()}–${result.range[1].toLocaleString()}</strong>, not as an exact count.</p>
          <div class="vocab-metrics compact">
            <div><strong>${result.correct}</strong><span>Correct</span></div>
            <div><strong>${result.wrong}</strong><span>Wrong</span></div>
            <div><strong>${result.unknown}</strong><span>Unknown</span></div>
          </div>
          <button class="vocab-primary" id="vocabRetake" type="button">Retake assessment</button>
        </div>
      `;
      assessmentBody.querySelector('#vocabRetake').addEventListener('click', startAssessment);
      renderProfile();
    }

    function renderReader() {
      const input = root.querySelector('#vocabReaderInput');
      const output = root.querySelector('#vocabReaderOutput');
      if (!input || !output) return;

      const fragments = input.value.match(/\p{L}[-\p{L}'’]*|[^\p{L}]+/gu) || [];
      output.innerHTML = '';
      for (const fragment of fragments) {
        if (/^\p{L}/u.test(fragment)) {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'vocab-word';
          button.textContent = fragment;
          button.addEventListener('click', () => {
            rememberWord(fragment, `${settings.sourceLabel}:reader`);
            button.classList.add('selected');
            renderProfile();
          });
          output.appendChild(button);
        } else {
          output.appendChild(document.createTextNode(fragment));
        }
      }
    }

    function renderLearningQueue() {
      const container = root.querySelector('#vocabLearningQueue');
      const words = loadProfile().learningWords;
      container.innerHTML = `
        <div class="vocab-section-head queue-head">
          <div><h3>Words to learn</h3><p class="vocab-muted">Unknown assessment words and words selected from reading appear here.</p></div>
          <span>${words.length} saved</span>
        </div>
        <div class="vocab-chip-list">
          ${words.length
            ? words.slice(0, 80).map(item => `<button type="button" data-remove-word="${escapeHtml(item.word)}" title="Remove from queue">${escapeHtml(item.word)} ×</button>`).join('')
            : '<span class="vocab-muted">No unfamiliar words saved yet.</span>'}
        </div>
      `;

      container.querySelectorAll('[data-remove-word]').forEach(button => {
        button.addEventListener('click', () => {
          removeLearningWord(button.dataset.removeWord);
          renderProfile();
        });
      });
    }

    root.querySelector('#vocabResetProfile').addEventListener('click', () => {
      if (!window.confirm('Delete the vocabulary estimate and learning queue from this browser?')) return;
      localStorage.removeItem(PROFILE_KEY);
      renderProfile();
      renderAssessmentIntro();
    });

    root.querySelector('#vocabRenderReader')?.addEventListener('click', renderReader);
    root.querySelector('#vocabClearWords')?.addEventListener('click', () => {
      const profile = loadProfile();
      profile.learningWords = [];
      saveProfile(profile);
      renderProfile();
    });

    renderAssessmentIntro();
    renderProfile();
    if (settings.showReader) renderReader();
  }

  window.VocabularyToolkit = {
    PROFILE_KEY,
    QUESTIONS,
    loadProfile,
    saveProfile,
    rememberWord,
    removeLearningWord,
    mount
  };
})();
