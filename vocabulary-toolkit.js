(() => {
  'use strict';

  const PROFILE_KEY = 'gs_vocab_profile_v1';
  const SCHEMA_VERSION = 1;

  const BANKS = {
    general: {
      title: 'General English estimate',
      description: 'Twenty frequency-banded questions estimate receptive vocabulary up to roughly 10,000 word families.',
      kind: 'estimate',
      questions: [
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
      ]
    },
    developer: {
      title: 'Developer terminology',
      description: 'Measures recognition of common software-engineering and systems terms. This is a domain score, not a word-count estimate.',
      kind: 'domain',
      questions: [
        { word: 'idempotent', sentence: 'The endpoint should be idempotent.', answer: 'Repeated calls have the same intended effect as one call', distractors: ['It always returns an error', 'It runs only once', 'It requires encryption'] },
        { word: 'immutable', sentence: 'The record is immutable after creation.', answer: 'It cannot be changed after it is created', distractors: ['It cannot be read', 'It is stored temporarily', 'It has no identifier'] },
        { word: 'latency', sentence: 'Users noticed increased latency.', answer: 'Delay before a response or operation completes', distractors: ['Number of users', 'Amount of storage', 'Level of encryption'] },
        { word: 'throughput', sentence: 'The service improved its throughput.', answer: 'Amount of work completed in a period of time', distractors: ['Time to first response', 'Code readability', 'Database size'] },
        { word: 'coupling', sentence: 'The modules have tight coupling.', answer: 'They depend heavily on one another', distractors: ['They use identical names', 'They run on separate networks', 'They have no shared behavior'] },
        { word: 'cohesion', sentence: 'The class has high cohesion.', answer: 'Its responsibilities are closely related', distractors: ['It contains many unrelated methods', 'It uses several databases', 'It has no dependencies'] },
        { word: 'serialization', sentence: 'The object requires serialization.', answer: 'Converting data into a storable or transmittable format', distractors: ['Sorting records alphabetically', 'Encrypting every field', 'Removing duplicate objects'] },
        { word: 'normalization', sentence: 'The schema needs normalization.', answer: 'Organizing relational data to reduce redundancy and anomalies', distractors: ['Increasing server memory', 'Converting all values to text', 'Compressing a database backup'] },
        { word: 'deadlock', sentence: 'Two transactions entered a deadlock.', answer: 'Each waits for a resource held by the other', distractors: ['Both transactions completed', 'A server lost power', 'A table contains no rows'] },
        { word: 'race condition', sentence: 'The bug was caused by a race condition.', answer: 'Outcome depends on unpredictable timing between operations', distractors: ['A loop runs too slowly', 'Two variables share a name', 'The build has no tests'] },
        { word: 'memoization', sentence: 'Memoization improved the function.', answer: 'Caching results for previously used inputs', distractors: ['Writing comments automatically', 'Running code in parallel', 'Removing recursion'] },
        { word: 'polymorphism', sentence: 'The design uses polymorphism.', answer: 'Different types can be used through a common interface', distractors: ['Every class has one method', 'All variables are global', 'The code avoids inheritance'] },
        { word: 'encapsulation', sentence: 'Encapsulation protects the component state.', answer: 'Internal details are hidden behind a controlled interface', distractors: ['All data is public', 'Code is split into files', 'Values are compressed'] },
        { word: 'eventual consistency', sentence: 'The replicas provide eventual consistency.', answer: 'Replicas may differ temporarily but converge later', distractors: ['Every read is immediately identical', 'The database never replicates', 'Writes are always rejected'] },
        { word: 'backpressure', sentence: 'The stream applies backpressure.', answer: 'A slower consumer signals the producer to reduce its rate', distractors: ['The server deletes old data', 'The client retries forever', 'The network increases bandwidth'] },
        { word: 'observability', sentence: 'The platform needs better observability.', answer: 'Ability to understand internal state from logs, metrics, and traces', distractors: ['Ability to hide source code', 'Ability to compile faster', 'Ability to reduce file size'] },
        { word: 'sargable', sentence: 'Rewrite the predicate to be sargable.', answer: 'Structured so an index can efficiently support the search', distractors: ['Valid only in stored procedures', 'Guaranteed to return one row', 'Encrypted before execution'] },
        { word: 'circuit breaker', sentence: 'The client uses a circuit breaker.', answer: 'It stops repeated calls to a failing dependency for a period', distractors: ['It restarts the operating system', 'It encrypts network traffic', 'It balances database tables'] },
        { word: 'orchestration', sentence: 'The workflow uses orchestration.', answer: 'Central coordination of multiple services or tasks', distractors: ['Removing all dependencies', 'Writing code without functions', 'Storing files in one folder'] },
        { word: 'deterministic', sentence: 'The test must be deterministic.', answer: 'The same input and conditions produce the same result', distractors: ['It runs only in production', 'It never uses data', 'It executes at random'] }
      ]
    },
    legal: {
      title: 'Legal terminology',
      description: 'Measures recognition of common legal and court terms. This is a domain score, not legal advice.',
      kind: 'domain',
      questions: [
        { word: 'jurisdiction', sentence: 'The court questioned its jurisdiction.', answer: 'Legal authority to hear and decide a matter', distractors: ['A witness statement', 'A filing fee', 'A negotiated sentence'] },
        { word: 'affidavit', sentence: 'She submitted an affidavit.', answer: 'A written statement sworn or affirmed as true', distractors: ['An unsigned draft', 'A court calendar', 'A private settlement'] },
        { word: 'standing', sentence: 'The plaintiff must establish standing.', answer: 'A sufficient legal interest to bring the claim', distractors: ['Permission to remain in the courtroom', 'A final judgment', 'A criminal sentence'] },
        { word: 'remand', sentence: 'The appellate court ordered a remand.', answer: 'Sending the matter back to a lower court or agency', distractors: ['Permanently sealing the case', 'Replacing the judge', 'Charging a filing fee'] },
        { word: 'waiver', sentence: 'The court considered whether there was a waiver.', answer: 'Intentional relinquishment of a known right', distractors: ['Automatic appeal', 'Mandatory hearing', 'Written accusation'] },
        { word: 'injunction', sentence: 'The party requested an injunction.', answer: 'A court order requiring or prohibiting conduct', distractors: ['A jury instruction', 'A witness subpoena only', 'A criminal indictment'] },
        { word: 'discovery', sentence: 'The parties exchanged discovery.', answer: 'Pretrial process for obtaining information and evidence', distractors: ['Final sentencing', 'Selection of a judge', 'Publication of an opinion'] },
        { word: 'precedent', sentence: 'The brief relied on precedent.', answer: 'Earlier authority used to guide a later decision', distractors: ['A private conversation', 'A court reporter', 'A filing deadline'] },
        { word: 'moot', sentence: 'The court found the request moot.', answer: 'No longer presenting a live controversy requiring a decision', distractors: ['Automatically criminal', 'Filed in the wrong font', 'Supported by every party'] },
        { word: 'prohibition', sentence: 'The relator sought a writ of prohibition.', answer: 'An extraordinary order preventing a lower tribunal from acting without authority', distractors: ['A request for money damages only', 'A routine discovery demand', 'A jury verdict form'] }
      ]
    }
  };

  function safeParse(value, fallback) {
    try { return JSON.parse(value); } catch (_) { return fallback; }
  }

  function loadProfile() {
    const parsed = safeParse(localStorage.getItem(PROFILE_KEY), {});
    return {
      schemaVersion: SCHEMA_VERSION,
      updatedAt: parsed.updatedAt || null,
      receptiveEstimate: Number.isFinite(parsed.receptiveEstimate) ? parsed.receptiveEstimate : null,
      receptiveRange: Array.isArray(parsed.receptiveRange) ? parsed.receptiveRange : null,
      assessments: parsed.assessments && typeof parsed.assessments === 'object' ? parsed.assessments : {},
      learningWords: Array.isArray(parsed.learningWords) ? parsed.learningWords : []
    };
  }

  function saveProfile(profile) {
    profile.schemaVersion = SCHEMA_VERSION;
    profile.updatedAt = new Date().toISOString();
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('vocabulary-profile-updated', { detail: profile }));
    return profile;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
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

  function formatDate(value) {
    if (!value) return 'Not completed';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Not completed' : date.toLocaleDateString();
  }

  function rangeForEstimate(estimate) {
    const lower = Math.max(0, Math.round((estimate - 1000) / 500) * 500);
    const upper = Math.min(12000, Math.round((estimate + 1000) / 500) * 500);
    return [lower, upper];
  }

  function scoreAssessment(bankKey, responses) {
    const bank = BANKS[bankKey];
    const correct = responses.filter(item => item.status === 'correct').length;
    const wrong = responses.filter(item => item.status === 'wrong').length;
    const unknown = responses.filter(item => item.status === 'unknown').length;
    const adjusted = Math.max(0, correct - wrong / 3);
    const result = {
      bank: bankKey,
      correct,
      wrong,
      unknown,
      total: bank.questions.length,
      adjusted: Number(adjusted.toFixed(2)),
      completedAt: new Date().toISOString()
    };
    if (bank.kind === 'estimate') {
      result.estimate = Math.round((adjusted * 500) / 100) * 100;
      result.range = rangeForEstimate(result.estimate);
    } else {
      result.percent = Math.max(0, Math.round((adjusted / bank.questions.length) * 100));
    }
    return result;
  }

  function mount(root, config = {}) {
    if (!root) return;
    const settings = {
      defaultBank: config.defaultBank || 'general',
      showReader: config.showReader !== false,
      sourceLabel: config.sourceLabel || document.title || 'vocabulary-toolkit',
      fullAppHref: config.fullAppHref || '',
      homeHref: config.homeHref || '',
      sampleText: config.sampleText || 'Paste a passage, article, job description, court filing, or study material here. Select words you do not know to build a shared learning queue.'
    };

    let bankKey = BANKS[settings.defaultBank] ? settings.defaultBank : 'general';
    let questions = [];
    let currentIndex = 0;
    let responses = [];
    let running = false;

    root.classList.add('vocab-toolkit');
    root.innerHTML = `
      <div class="vocab-toolbar">
        ${settings.homeHref ? `<a class="vocab-link" href="${escapeHtml(settings.homeHref)}">← Back</a>` : ''}
        ${settings.fullAppHref ? `<a class="vocab-link" href="${escapeHtml(settings.fullAppHref)}">Open full Vocabulary Expander ↗</a>` : ''}
      </div>
      <section class="vocab-profile-card" id="vocabProfileCard"></section>
      <section class="vocab-card">
        <div class="vocab-section-head">
          <div>
            <h2>Vocabulary assessment</h2>
            <p>Choose “I do not know” instead of guessing. Wrong guesses are penalized to reduce inflated results.</p>
          </div>
          <button class="vocab-secondary" id="vocabResetProfile" type="button">Reset profile</button>
        </div>
        <div class="vocab-bank-tabs" id="vocabBankTabs"></div>
        <div id="vocabAssessmentBody"></div>
      </section>
      ${settings.showReader ? `
      <section class="vocab-card">
        <h2>Unknown-word collector</h2>
        <p>Paste text, then tap unfamiliar words. The queue is shared with FieldKit and Developer Interview Prep on the same browser.</p>
        <textarea id="vocabReaderInput" rows="7">${escapeHtml(settings.sampleText)}</textarea>
        <div class="vocab-actions">
          <button class="vocab-primary" id="vocabRenderReader" type="button">Render words</button>
          <button class="vocab-secondary" id="vocabClearWords" type="button">Clear learning queue</button>
        </div>
        <div id="vocabReaderOutput" class="vocab-reader-output"></div>
        <div id="vocabLearningQueue"></div>
      </section>` : ''}
    `;

    const profileCard = root.querySelector('#vocabProfileCard');
    const bankTabs = root.querySelector('#vocabBankTabs');
    const assessmentBody = root.querySelector('#vocabAssessmentBody');

    function renderProfile() {
      const profile = loadProfile();
      const general = profile.assessments.general;
      const developer = profile.assessments.developer;
      const legal = profile.assessments.legal;
      const estimate = Number.isFinite(profile.receptiveEstimate)
        ? `${profile.receptiveEstimate.toLocaleString()} word families`
        : 'Not estimated';
      const range = Array.isArray(profile.receptiveRange)
        ? `${profile.receptiveRange[0].toLocaleString()}–${profile.receptiveRange[1].toLocaleString()}`
        : '—';
      profileCard.innerHTML = `
        <div>
          <span class="vocab-eyebrow">Shared vocabulary profile</span>
          <h2>${escapeHtml(estimate)}</h2>
          <p>Approximate receptive range: <strong>${escapeHtml(range)}</strong>. Last updated: ${escapeHtml(formatDate(profile.updatedAt))}.</p>
        </div>
        <div class="vocab-metrics">
          <div><strong>${general?.estimate?.toLocaleString?.() || '—'}</strong><span>General estimate</span></div>
          <div><strong>${Number.isFinite(developer?.percent) ? `${developer.percent}%` : '—'}</strong><span>Developer terms</span></div>
          <div><strong>${Number.isFinite(legal?.percent) ? `${legal.percent}%` : '—'}</strong><span>Legal terms</span></div>
          <div><strong>${profile.learningWords.length}</strong><span>Words to learn</span></div>
        </div>
      `;
      renderLearningQueue();
    }

    function renderTabs() {
      bankTabs.innerHTML = Object.entries(BANKS).map(([key, bank]) => `
        <button type="button" class="vocab-tab ${key === bankKey ? 'active' : ''}" data-bank="${key}">${escapeHtml(bank.title)}</button>
      `).join('');
      bankTabs.querySelectorAll('[data-bank]').forEach(button => {
        button.addEventListener('click', () => {
          if (running && !window.confirm('Leave the current assessment and discard its unanswered progress?')) return;
          bankKey = button.dataset.bank;
          running = false;
          responses = [];
          currentIndex = 0;
          renderTabs();
          renderAssessmentIntro();
        });
      });
    }

    function renderAssessmentIntro() {
      const bank = BANKS[bankKey];
      const profile = loadProfile();
      const previous = profile.assessments[bankKey];
      const previousText = previous
        ? bank.kind === 'estimate'
          ? `Previous estimate: ${previous.estimate.toLocaleString()} (${previous.range[0].toLocaleString()}–${previous.range[1].toLocaleString()})`
          : `Previous adjusted score: ${previous.percent}%`
        : 'No previous result.';
      assessmentBody.innerHTML = `
        <div class="vocab-intro">
          <h3>${escapeHtml(bank.title)}</h3>
          <p>${escapeHtml(bank.description)}</p>
          <p class="vocab-muted">${escapeHtml(previousText)}</p>
          <button class="vocab-primary" id="vocabStartAssessment" type="button">Start ${bank.questions.length}-question assessment</button>
        </div>
      `;
      assessmentBody.querySelector('#vocabStartAssessment').addEventListener('click', startAssessment);
    }

    function startAssessment() {
      questions = shuffle(BANKS[bankKey].questions.map(question => ({ ...question })));
      currentIndex = 0;
      responses = [];
      running = true;
      renderQuestion();
    }

    function renderQuestion() {
      const question = questions[currentIndex];
      const options = shuffle([question.answer, ...question.distractors]);
      assessmentBody.innerHTML = `
        <div class="vocab-progress"><span>${currentIndex + 1} of ${questions.length}</span><progress value="${currentIndex + 1}" max="${questions.length}"></progress></div>
        <article class="vocab-question">
          <p class="vocab-sentence">${escapeHtml(question.sentence).replace(new RegExp(`\\b${question.word.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\b`, 'i'), `<strong>${escapeHtml(question.word)}</strong>`)}</p>
          <div class="vocab-options">
            ${options.map(option => `<button type="button" data-answer="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join('')}
            <button type="button" class="unknown" data-unknown="true">I do not know</button>
          </div>
        </article>
      `;
      assessmentBody.querySelectorAll('[data-answer]').forEach(button => {
        button.addEventListener('click', () => answerQuestion(button.dataset.answer === question.answer ? 'correct' : 'wrong', question));
      });
      assessmentBody.querySelector('[data-unknown]').addEventListener('click', () => answerQuestion('unknown', question));
    }

    function answerQuestion(status, question) {
      responses.push({ word: question.word, status });
      if (status !== 'correct') rememberWord(question.word, `${settings.sourceLabel}:${bankKey}-assessment`);
      currentIndex += 1;
      if (currentIndex < questions.length) renderQuestion();
      else finishAssessment();
    }

    function finishAssessment() {
      running = false;
      const result = scoreAssessment(bankKey, responses);
      const profile = loadProfile();
      profile.assessments[bankKey] = result;
      if (result.estimate !== undefined) {
        profile.receptiveEstimate = result.estimate;
        profile.receptiveRange = result.range;
      }
      saveProfile(profile);
      const primary = result.estimate !== undefined
        ? `${result.estimate.toLocaleString()} word families`
        : `${result.percent}% adjusted recognition`;
      const detail = result.estimate !== undefined
        ? `Report this as approximately ${result.range[0].toLocaleString()}–${result.range[1].toLocaleString()}, not as an exact count.`
        : 'This domain score measures recognition of terminology, not production skill.';
      assessmentBody.innerHTML = `
        <div class="vocab-result">
          <span class="vocab-eyebrow">Result</span>
          <h3>${escapeHtml(primary)}</h3>
          <p>${escapeHtml(detail)}</p>
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
      if (!container) return;
      const words = loadProfile().learningWords;
      container.innerHTML = `
        <div class="vocab-section-head queue-head"><h3>Learning queue</h3><span>${words.length} saved</span></div>
        <div class="vocab-chip-list">
          ${words.length ? words.slice(0, 80).map(item => `<button type="button" data-remove-word="${escapeHtml(item.word)}" title="Remove from queue">${escapeHtml(item.word)} ×</button>`).join('') : '<span class="vocab-muted">No unfamiliar words saved yet.</span>'}
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
      if (!window.confirm('Delete the shared vocabulary estimate, domain scores, and learning queue from this browser?')) return;
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

    renderTabs();
    renderAssessmentIntro();
    renderProfile();
    if (settings.showReader) renderReader();
  }

  window.VocabularyToolkit = {
    PROFILE_KEY,
    BANKS,
    loadProfile,
    saveProfile,
    rememberWord,
    removeLearningWord,
    mount
  };
})();
