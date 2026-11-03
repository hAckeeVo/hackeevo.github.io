// tools/audit_i18n.js
const fs = require('fs');

global.window = global;
global.localStorage = {
  store: {},
  getItem(k) { return this.store[k] || 'ru'; },
  setItem(k, v) { this.store[k] = v; }
};
global.location = { reload() {} };
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

eval(fs.readFileSync('lessons.js', 'utf8'));
eval(fs.readFileSync('piscine.js', 'utf8'));
eval(fs.readFileSync('more.js', 'utf8'));
eval(fs.readFileSync('i18n.js', 'utf8'));
eval(fs.readFileSync('lessons_kz.js', 'utf8'));

console.log('=== AUDIT KZ LOCALIZATION ===');
window.setLang('kz');

let untranslated = [];
let missingKzTheory = [];
let missingKzTasks = [];

window.TOPICS.forEach(rawTopic => {
  const t = window.getLocalizedTopicFull(rawTopic);
  
  // Check theory for Russian words
  if (/Что нужно знать|Как это выглядит|В этой теме|Любая программа|У каждого значения/i.test(t.theory)) {
    missingKzTheory.push({ id: t.id, title: t.title });
  }

  (t.tasks || []).forEach(k => {
    // Check if task title or desc is in Russian
    if (/Создайте|Напишите|Выведите|Объявите|Проверьте|Сложите|Разделите|Сделайте|Заведите/i.test(k.title) || 
        /Создайте|Напишите|Выведите|Объявите|Проверьте|Сложите|Разделите|Сделайте|Заведите/i.test(k.desc)) {
      missingKzTasks.push({ topicId: t.id, taskId: k.id, title: k.title });
    }
  });
});

console.log('Topics with Russian theory in KZ mode:', missingKzTheory.length);
if (missingKzTheory.length > 0) console.log(missingKzTheory);

console.log('Tasks with Russian title/desc in KZ mode:', missingKzTasks.length);
if (missingKzTasks.length > 0) console.log(missingKzTasks);

console.log('\n=== AUDIT RU LOCALIZATION (checking for leftover Kazakh in RU mode) ===');
window.setLang('ru');

let leftoverKzInRu = [];
window.TOPICS.forEach(rawTopic => {
  const t = window.getLocalizedTopicFull(rawTopic);
  // Check for Kazakh specific letters in Russian mode: ә, і, ң, ғ, ү, ұ, қ, ө, һ
  const kzRegex = /[әіңғүұқөһӘІҢҒҮҰҚӨҺ]/;
  if (kzRegex.test(t.title) || kzRegex.test(t.theory) || kzRegex.test(t.about)) {
    // Exclude deliberate Kazakh examples like "Сәлем!"
    const cleanedTheory = t.theory.replace(/Сәлем/g, '');
    if (kzRegex.test(t.title) || kzRegex.test(cleanedTheory) || kzRegex.test(t.about)) {
      leftoverKzInRu.push({ id: t.id, title: t.title });
    }
  }
});

console.log('Topics with leftover KZ in RU mode:', leftoverKzInRu.length);
if (leftoverKzInRu.length > 0) console.log(leftoverKzInRu);
