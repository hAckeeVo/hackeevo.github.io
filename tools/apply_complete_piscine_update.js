// tools/apply_complete_piscine_update.js
const fs = require('fs');
const { EXT_TOPICS_RU } = require('./piscine_quests_ext_data.js');
const { EXT_TOPICS_KZ } = require('./piscine_quests_ext_kz.js');

console.log('--- Applying Full Piscine Quests 01-12 & Admin update ---');

// 1. UPDATE more.js: re-number backend topics from 26..30 -> 30..34
let moreCode = fs.readFileSync('more.js', 'utf8');
moreCode = moreCode.replace(/id:\s*26,\s*track:\s*"backend"/g, 'id: 30, track: "backend"');
moreCode = moreCode.replace(/id:\s*27,\s*track:\s*"backend"/g, 'id: 31, track: "backend"');
moreCode = moreCode.replace(/id:\s*28,\s*track:\s*"backend"/g, 'id: 32, track: "backend"');
moreCode = moreCode.replace(/id:\s*29,\s*track:\s*"backend"/g, 'id: 33, track: "backend"');
moreCode = moreCode.replace(/id:\s*30,\s*track:\s*"backend"/g, 'id: 34, track: "backend"');
moreCode = moreCode.replace(/\/\/ ======================================================= 26 \(Backend\)/g, '// ======================================================= 30 (Backend)');
moreCode = moreCode.replace(/\/\/ ======================================================= 27 \(Backend\)/g, '// ======================================================= 31 (Backend)');
moreCode = moreCode.replace(/\/\/ ======================================================= 28 \(Backend\)/g, '// ======================================================= 32 (Backend)');
moreCode = moreCode.replace(/\/\/ ======================================================= 29 \(Backend\)/g, '// ======================================================= 33 (Backend)');
moreCode = moreCode.replace(/\/\/ ======================================================= 30 \(Backend\)/g, '// ======================================================= 34 (Backend)');
fs.writeFileSync('more.js', moreCode, 'utf8');
console.log('✓ more.js backend topics renumbered to 30..34');

// 2. UPDATE widgets.js
let widgetsCode = fs.readFileSync('widgets.js', 'utf8');
widgetsCode = widgetsCode.replace(/26:\s*"Двусторонний конвертер/g, '30: "Двусторонний конвертер');
widgetsCode = widgetsCode.replace(/28:\s*"Интерактивный REST/g, '32: "Интерактивный REST');
widgetsCode = widgetsCode.replace(/29:\s*"Интерактивная песочница/g, '33: "Интерактивная песочница');
widgetsCode = widgetsCode.replace(/if\s*\(tid\s*===\s*26\)\s*return\s*initJsonViz;/g, 'if (tid === 30) return initJsonViz;');
widgetsCode = widgetsCode.replace(/if\s*\(tid\s*===\s*28\)\s*return\s*initApiViz;/g, 'if (tid === 32) return initApiViz;');
widgetsCode = widgetsCode.replace(/if\s*\(tid\s*===\s*29\)\s*return\s*initSqlViz;/g, 'if (tid === 33) return initSqlViz;');
fs.writeFileSync('widgets.js', widgetsCode, 'utf8');
console.log('✓ widgets.js updated');

// 3. UPDATE piscine.js: assign sequential numeric IDs 26, 27, 28, 29 to EXT_TOPICS_RU
EXT_TOPICS_RU[0].id = 26; // Quest 02 (PrintComb)
EXT_TOPICS_RU[1].id = 27; // Quest 11 (Linked Lists)
EXT_TOPICS_RU[2].id = 28; // Quest 12 (Binary Trees)
EXT_TOPICS_RU[3].id = 29; // Raid 02 (Sudoku Solver)

let piscineCode = fs.readFileSync('piscine.js', 'utf8');
const extWidgetsSrc = fs.readFileSync('tools/piscine_quests_ext_widgets.js', 'utf8');

// Update getPiscineRenderer in piscine.js
const oldRenderer = `    if (topicId === 25) return window.initBitsViz;
    return null;`;

const newRenderer = `    if (topicId === 25) return window.initBitsViz;
    if (topicId === 26) return window.initCombViz;
    if (topicId === 27) return window.initListViz;
    if (topicId === 28) return window.initTreeViz;
    if (topicId === 29) return window.initSudokuViz;
    return null;`;

piscineCode = piscineCode.replace(oldRenderer, newRenderer);

// Insert topics into PISCINE_TOPICS in piscine.js
const extTopicsCode = `
  // --- EXTENDED PISCINE QUESTS (Quest 02, 11, 12, Raid 02) ---
  const EXT_QUEST_TOPICS = ${JSON.stringify(EXT_TOPICS_RU, null, 2)};
  EXT_QUEST_TOPICS.forEach(t => PISCINE_TOPICS.push(t));
`;

piscineCode = piscineCode.replace('  NEW_QUEST_TOPICS.forEach(t => PISCINE_TOPICS.push(t));', '  NEW_QUEST_TOPICS.forEach(t => PISCINE_TOPICS.push(t));\n' + extTopicsCode);

// Append widget functions before the closing IIFE
piscineCode = piscineCode.replace(/\}\)\(\);?\s*$/, `\n${extWidgetsSrc}\n})();\n`);
fs.writeFileSync('piscine.js', piscineCode, 'utf8');
console.log('✓ piscine.js updated with Quests 02, 11, 12, Raid 02 and 4 new simulators');

// 4. UPDATE lessons_kz.js
let kzCode = fs.readFileSync('lessons_kz.js', 'utf8');
const vm = require('vm');
const sandbox = { window: {}, String };
vm.createContext(sandbox);
vm.runInContext(kzCode, sandbox);
const existingKz = sandbox.window.TOPICS_KZ || {};

const updatedKz = {};
// 0..25 stay as is
for (let id = 0; id <= 25; id++) {
  if (existingKz[String(id)]) updatedKz[String(id)] = existingKz[String(id)];
}
// Add 26, 27, 28, 29 from EXT_TOPICS_KZ
updatedKz["26"] = EXT_TOPICS_KZ["ext_comb"];
updatedKz["27"] = EXT_TOPICS_KZ["ext_list"];
updatedKz["28"] = EXT_TOPICS_KZ["ext_tree"];
updatedKz["29"] = EXT_TOPICS_KZ["ext_sudoku"];

// Re-map backend 26..30 -> 30..34
for (let id = 26; id <= 30; id++) {
  if (existingKz[String(id)]) {
    updatedKz[String(id + 4)] = existingKz[String(id)];
  }
}

const newKzContent = `// lessons_kz.js: Толық қазақша локализация контенті (0-34 тақырыптар)
// 100% қазақша: Go негіздері (0-13), 01 Edu Piscine Quests 01-12 & Raids (14-29), Backend & Web (30-34)
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
fs.writeFileSync('lessons_kz.js', newKzContent, 'utf8');
console.log('✓ lessons_kz.js updated with 35 topics (0..34) in Kazakh');

// 5. UPDATE app.js TRACKS bounds (14-29, 30-34) and guest background tracking
let appCode = fs.readFileSync('app.js', 'utf8');
appCode = appCode.replace(/14–25/g, '14–29');
appCode = appCode.replace(/26–30/g, '30–34');
appCode = appCode.replace(/t\.id\s*>=\s*14\s*&&\s*t\.id\s*<=\s*25/g, 't.id >= 14 && t.id <= 29');
appCode = appCode.replace(/t\.id\s*>=\s*26\s*&&\s*t\.id\s*<=\s*30/g, 't.id >= 30 && t.id <= 34');

// Connect guest background tracking in fGuest.onsubmit
const oldGuestSubmit = `    store.set("user", name);
    store.set("sb_session", false);
    location.hash = "#/";`;

const newGuestSubmit = `    store.set("user", name);
    store.set("sb_session", false);
    if (window.sbLogGuest) {
      window.sbLogGuest(name);
    }
    location.hash = "#/";`;

appCode = appCode.replace(oldGuestSubmit, newGuestSubmit);
fs.writeFileSync('app.js', appCode, 'utf8');
console.log('✓ app.js updated');

// 6. UPDATE i18n.js
let i18nCode = fs.readFileSync('i18n.js', 'utf8');
i18nCode = i18nCode.replace(/14–25/g, '14–29');
i18nCode = i18nCode.replace(/26–30/g, '30–34');
fs.writeFileSync('i18n.js', i18nCode, 'utf8');
console.log('✓ i18n.js updated');

console.log('--- Full Piscine update applied successfully! ---');

