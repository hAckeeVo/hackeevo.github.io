// tools/apply_quests_update.js
const fs = require('fs');
const path = require('path');
const { QUEST_TOPICS_RU } = require('./piscine_quests_data.js');
const { QUEST_TOPICS_KZ } = require('./piscine_quests_kz.js');

console.log('--- Applying Piscine Quests 05-10 update ---');

// 1. UPDATE more.js: change backend topic IDs 20..24 -> 26..30
let moreCode = fs.readFileSync('more.js', 'utf8');
moreCode = moreCode.replace(/id:\s*20,\s*track:\s*"backend"/g, 'id: 26, track: "backend"');
moreCode = moreCode.replace(/id:\s*21,\s*track:\s*"backend"/g, 'id: 27, track: "backend"');
moreCode = moreCode.replace(/id:\s*22,\s*track:\s*"backend"/g, 'id: 28, track: "backend"');
moreCode = moreCode.replace(/id:\s*23,\s*track:\s*"backend"/g, 'id: 29, track: "backend"');
moreCode = moreCode.replace(/id:\s*24,\s*track:\s*"backend"/g, 'id: 30, track: "backend"');
moreCode = moreCode.replace(/\/\/ ======================================================= 20 \(Backend\)/g, '// ======================================================= 26 (Backend)');
moreCode = moreCode.replace(/\/\/ ======================================================= 21 \(Backend\)/g, '// ======================================================= 27 (Backend)');
moreCode = moreCode.replace(/\/\/ ======================================================= 22 \(Backend\)/g, '// ======================================================= 28 (Backend)');
moreCode = moreCode.replace(/\/\/ ======================================================= 23 \(Backend\)/g, '// ======================================================= 29 (Backend)');
moreCode = moreCode.replace(/\/\/ ======================================================= 24 \(Backend\)/g, '// ======================================================= 30 (Backend)');
fs.writeFileSync('more.js', moreCode, 'utf8');
console.log('✓ more.js updated (backend topics now IDs 26..30)');

// 2. UPDATE widgets.js: map backend widgets to 26, 28, 29
let widgetsCode = fs.readFileSync('widgets.js', 'utf8');
widgetsCode = widgetsCode.replace(/20:\s*"Двусторонний конвертер/g, '26: "Двусторонний конвертер');
widgetsCode = widgetsCode.replace(/22:\s*"Интерактивный REST/g, '28: "Интерактивный REST');
widgetsCode = widgetsCode.replace(/23:\s*"Интерактивная песочница/g, '29: "Интерактивная песочница');
widgetsCode = widgetsCode.replace(/if\s*\(tid\s*===\s*20\)\s*return\s*initJsonViz;/g, 'if (tid === 26) return initJsonViz;');
widgetsCode = widgetsCode.replace(/if\s*\(tid\s*===\s*22\)\s*return\s*initApiViz;/g, 'if (tid === 28) return initApiViz;');
widgetsCode = widgetsCode.replace(/if\s*\(tid\s*===\s*23\)\s*return\s*initSqlViz;/g, 'if (tid === 29) return initSqlViz;');
fs.writeFileSync('widgets.js', widgetsCode, 'utf8');
console.log('✓ widgets.js updated');

// 3. UPDATE piscine.js: append QUEST_TOPICS_RU and widget code
let piscineCode = fs.readFileSync('piscine.js', 'utf8');
const widgetsSrc = fs.readFileSync('tools/piscine_quests_widgets.js', 'utf8');

// Find insertion point before PISCINE_TOPICS closing bracket
const insertPiscineTopicsStr = QUEST_TOPICS_RU.map(t => {
  return JSON.stringify(t, null, 2);
}).join(',\n');

// Replace PISCINE_TOPICS closing and renderer registration
const oldRenderer = `  window.getPiscineRenderer = function (topicId) {
    if (topicId === 14) return initQuadViz;
    if (topicId === 15) return initPointerViz;
    if (topicId === 16) return initRuneViz;
    if (topicId === 17) return initRecursionViz;
    if (topicId === 18) return initMathViz;
    if (topicId === 19) return initChessViz;
    return null;
  };`;

const newRenderer = `  window.getPiscineRenderer = function (topicId) {
    if (topicId === 14) return initQuadViz;
    if (topicId === 15) return initPointerViz;
    if (topicId === 16) return initRuneViz;
    if (topicId === 17) return initRecursionViz;
    if (topicId === 18) return initMathViz;
    if (topicId === 19) return initChessViz;
    if (topicId === 20) return window.initStringViz;
    if (topicId === 21) return window.initArgsViz;
    if (topicId === 22) return window.initSplitViz;
    if (topicId === 23) return window.initFileViz;
    if (topicId === 24) return window.initDoOpViz;
    if (topicId === 25) return window.initBitsViz;
    return null;
  };`;

piscineCode = piscineCode.replace(oldRenderer, newRenderer);

// Insert new topics before the end of PISCINE_TOPICS array
const targetMarker = '  // Добавляем темы бассейна в общий список';
const newTopicsCode = `
  // --- QUESTS 05..10 ADDITIONS ---
  const NEW_QUEST_TOPICS = ${fs.readFileSync('tools/piscine_quests_data.js', 'utf8').replace(/const R = String\.raw;[\s\S]*?const QUEST_TOPICS_RU = /, '').replace(/;\s*\/\/ Export for builder[\s\S]*$/, '')};
  NEW_QUEST_TOPICS.forEach(t => PISCINE_TOPICS.push(t));

${targetMarker}`;

piscineCode = piscineCode.replace(targetMarker, newTopicsCode);

// Append widget functions before the closing IIFE
piscineCode = piscineCode.replace(/\}\)\(\);?\s*$/, `\n${widgetsSrc}\n})();\n`);
fs.writeFileSync('piscine.js', piscineCode, 'utf8');
console.log('✓ piscine.js updated with Quests 05..10 and 6 interactive visualizers');

// 4. UPDATE lessons_kz.js: move old 20..24 to 26..30, and add new 20..25
let kzCode = fs.readFileSync('lessons_kz.js', 'utf8');

// Parse TOPICS_KZ from lessons_kz.js
const vm = require('vm');
const sandbox = { window: {}, String };
vm.createContext(sandbox);
vm.runInContext(kzCode, sandbox);
const existingKz = sandbox.window.TOPICS_KZ || {};

// Re-map backend 20..24 -> 26..30
const updatedKz = {};
for (let id = 0; id <= 19; id++) {
  if (existingKz[String(id)]) updatedKz[String(id)] = existingKz[String(id)];
}
// Add new 20..25
for (let id = 20; id <= 25; id++) {
  if (QUEST_TOPICS_KZ[String(id)]) {
    updatedKz[String(id)] = QUEST_TOPICS_KZ[String(id)];
  }
}
// Map backend to 26..30
for (let id = 20; id <= 24; id++) {
  if (existingKz[String(id)]) {
    updatedKz[String(id + 6)] = existingKz[String(id)];
  }
}

// Rebuild lessons_kz.js
const newKzFileContent = `// lessons_kz.js: Толық қазақша локализация контенті (0-30 тақырыптар)
// 100% қазақша: Go негіздері (0-13), 01 Edu Piscine Quests 01-10 (14-25), Backend & Web (26-30)
(function () {
  const R = String.raw;

  const TOPICS_KZ = ${JSON.stringify(updatedKz, null, 2)};

  window.LESSONS_KZ = TOPICS_KZ;

  window.getLocalizedTopicFull = function (topic) {
    if (!topic) return topic;
    const isKZ = (window.getLang && window.getLang()) === "kz";
    if (!isKZ) return topic;

    const kz = TOPICS_KZ[String(topic.id)];
    if (!kz) return topic;

    return {
      ...topic,
      title: kz.title || topic.title,
      about: kz.about || topic.about,
      theory: kz.theory || topic.theory,
      examples: kz.examples || topic.examples,
      quiz: kz.quiz || topic.quiz,
      tasks: (topic.tasks || []).map(k => {
        const kzTask = kz.tasks && kz.tasks[k.id];
        if (!kzTask) return k;
        return {
          ...k,
          title: kzTask.title || k.title,
          desc: kzTask.desc || k.desc,
          plan: kzTask.plan || k.plan,
          hint: kzTask.hint || k.hint,
          lines: k.lines ? k.lines.map((l, i) => {
            const kzLine = kzTask.lines && kzTask.lines[i];
            return kzLine && kzLine[1] ? [l[0], kzLine[1]] : l;
          }) : k.lines,
          checks: k.checks ? k.checks.map((c, i) => {
            const kzMsg = kzTask.checks && kzTask.checks[i];
            return kzMsg ? { ...c, msg: kzMsg } : c;
          }) : k.checks
        };
      })
    };
  };

  window.TOPICS_KZ = TOPICS_KZ;
  window.getLocalizedTopic = function (topic) {
    return window.getLocalizedTopicFull(topic);
  };
})();
`;
fs.writeFileSync('lessons_kz.js', newKzFileContent, 'utf8');
console.log('✓ lessons_kz.js updated with all 31 topics (0..30) in Kazakh');

// 5. UPDATE app.js TRACKS and i18n
let appCode = fs.readFileSync('app.js', 'utf8');
appCode = appCode.replace(/topics:\s*TOPICS\.filter\(t\s*=>\s*t\.track\s*===\s*"piscine"\s*\|\|\s*\(t\.id\s*>=\s*14\s*&&\s*t\.id\s*<=\s*19\)\)/g, 'topics: TOPICS.filter(t => t.track === "piscine" || (t.id >= 14 && t.id <= 25))');
appCode = appCode.replace(/topics:\s*TOPICS\.filter\(t\s*=>\s*t\.track\s*===\s*"backend"\s*\|\|\s*\(t\.id\s*>=\s*20\s*&&\s*t\.id\s*<=\s*24\)\)/g, 'topics: TOPICS.filter(t => t.track === "backend" || (t.id >= 26 && t.id <= 30))');
appCode = appCode.replace(/14–19/g, '14–25');
appCode = appCode.replace(/20–24/g, '26–30');
fs.writeFileSync('app.js', appCode, 'utf8');
console.log('✓ app.js updated');

// 6. UPDATE i18n.js
let i18nCode = fs.readFileSync('i18n.js', 'utf8');
i18nCode = i18nCode.replace(/14–19/g, '14–25');
i18nCode = i18nCode.replace(/20–24/g, '26–30');
fs.writeFileSync('i18n.js', i18nCode, 'utf8');
console.log('✓ i18n.js updated');

console.log('--- Quests update script finished successfully ---');

