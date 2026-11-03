// tools/kz_builder.js: Сборщик lessons_kz.js
const fs = require('fs');
const path = require('path');

const p1 = require('./kz_part1.js');
const p2 = require('./kz_part2.js');
const p3 = require('./kz_part3.js');
const p4 = require('./kz_part4.js');

const allTopics = { ...p1, ...p2, ...p3, ...p4 };

console.log('Total KZ topics ready to build:', Object.keys(allTopics).length);

const outPath = path.resolve(__dirname, '..', 'lessons_kz.js');

const fileContent = `// lessons_kz.js: Толық қазақша локализация контенті (0-24 тақырыптар)
// 100% қазақша: тақырыптар, теория, мысалдар, шағын-тесттер және тапсырмалар
(function () {
  const R = String.raw;

  const TOPICS_KZ = ${JSON.stringify(allTopics, null, 2)};

  window.TOPICS_KZ = TOPICS_KZ;

  window.getLocalizedTopicFull = function (topic) {
    if (!topic) return topic;
    const lang = (window.getLang && window.getLang()) || "ru";
    if (lang !== "kz" || !window.TOPICS_KZ || !window.TOPICS_KZ[topic.id]) {
      return topic;
    }
    const kz = window.TOPICS_KZ[topic.id];
    return {
      ...topic,
      title: kz.title || topic.title,
      about: kz.about || topic.about,
      theory: kz.theory || topic.theory,
      examples: kz.examples || topic.examples,
      widgetTitle: kz.widgetTitle || topic.widgetTitle,
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

  window.getLocalizedTopic = function (topic) {
    return window.getLocalizedTopicFull(topic);
  };
})();
`;

fs.writeFileSync(outPath, fileContent, 'utf8');
console.log('Successfully wrote', outPath, 'size:', fs.statSync(outPath).size);

