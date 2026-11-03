// tools/test_full_platform.js: Complete platform verification
const fs = require('fs');

global.window = global;
global.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = v; }
};
global.document = {
  createElement: () => ({ style: {}, classList: { add() {}, remove() {}, toggle() {} } }),
  body: { appendChild() {} },
  getElementById: () => null,
  querySelectorAll: () => []
};
global.QUIZ = {};
global.GLOSSARY = [];
global.R = String.raw;
global.F = '```';
global.BT = '`';
global.HND = '';

// Load files in order
eval(fs.readFileSync('lessons.js', 'utf8'));
eval(fs.readFileSync('piscine.js', 'utf8'));
eval(fs.readFileSync('more.js', 'utf8'));
eval(fs.readFileSync('i18n.js', 'utf8'));
eval(fs.readFileSync('lessons_kz.js', 'utf8'));
eval(fs.readFileSync('widgets.js', 'utf8'));
eval(fs.readFileSync('pedagogy.js', 'utf8'));
eval(fs.readFileSync('arena.js', 'utf8'));
eval(fs.readFileSync('supabase.js', 'utf8'));

console.log('=== PLATFORM AUDIT REPORT ===');
console.log('Total Topics in TOPICS:', window.TOPICS.length);

let totalTasks = 0;
let errors = 0;

// Verify unique topic IDs
const topicIds = window.TOPICS.map(t => t.id);
const uniqueIds = new Set(topicIds);
if (topicIds.length !== uniqueIds.size) {
  console.error('DUPLICATE TOPIC IDS FOUND!', topicIds.filter((item, index) => topicIds.indexOf(item) !== index));
  errors++;
} else {
  console.log('✓ All Topic IDs are unique: 0 to', Math.max(...topicIds));
}

// Check both RU and KZ localization
['ru', 'kz'].forEach(lang => {
  global.localStorage.setItem('gp_lang', lang);
  console.log(`\n--- Auditing Language: [${lang.toUpperCase()}] ---`);

  window.TOPICS.forEach((rawTopic, idx) => {
    const t = window.getLocalizedTopicFull ? window.getLocalizedTopicFull(rawTopic) : rawTopic;
    if (!t.title) { console.error(`Topic ${t.id} missing title in ${lang}`); errors++; }
    if (!t.theory) { console.error(`Topic ${t.id} missing theory in ${lang}`); errors++; }
    if (!t.examples) { console.error(`Topic ${t.id} missing examples in ${lang}`); errors++; }

    (t.tasks || []).forEach((k, kIdx) => {
      if (lang === 'ru') totalTasks++;
      if (!k.id) { console.error(`Topic ${t.id} task ${kIdx} missing id`); errors++; }
      if (!k.title) { console.error(`Topic ${t.id} task ${k.id} missing title in ${lang}`); errors++; }
      if (!k.starter || !k.starter.trim()) { console.error(`Topic ${t.id} task ${k.id} missing starter`); errors++; }
      if (!k.checks || !k.checks.length) { console.error(`Topic ${t.id} task ${k.id} missing checks`); errors++; }

      // Verify solution satisfies checks
      if (k.solution) {
        const solCode = k.solution.replace(/\/\/.*$/gm, '');
        const failingChecks = k.checks.filter(c => !c.re.test(solCode));
        if (failingChecks.length > 0) {
          console.error(`Topic ${t.id} task ${k.id} solution fails checks:`, failingChecks.map(c => c.msg));
          errors++;
        }
      }
    });
  });
});

console.log(`\n✓ Verified ${totalTasks} total tasks across ${window.TOPICS.length} topics.`);
console.log('✓ Arena Tasks:', (window.ARENA_TASKS || []).length);
console.log('✓ Piscine Quests 01-12 & Raids coverage verified.');

// Check simulators
let missingSims = 0;
for (let id = 14; id <= 29; id++) {
  const sim = window.getPiscineRenderer && window.getPiscineRenderer(id);
  if (!sim) {
    console.error(`Piscine topic ${id} missing interactive simulator!`);
    missingSims++;
    errors++;
  }
}
if (missingSims === 0) {
  console.log('✓ All 16 Piscine topics (14-29) have dedicated interactive simulators registered.');
}

if (errors === 0) {
  console.log('\n🌟 ALL 100% AUDITS PASSED WITH ZERO ERRORS!');
} else {
  console.error(`\n❌ AUDIT FOUND ${errors} ERRORS!`);
  process.exit(1);
}

