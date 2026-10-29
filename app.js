// Go Piscine - демо-платформа. Всё хранится в localStorage, сервера нет.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const app = $("#app");
const XP_PER_TASK = 50, XP_ASSISTED = 25, XP_QUIZ = 20;

const DEMO_USERS = [["gopher", 1000], ["bitebayev", 950], ["sleepyhead", 900], ["akerke", 850], ["arigana", 800]];

// ---------- storage ----------
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem("gp:" + k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem("gp:" + k, JSON.stringify(v)); } catch { } },
};
const getUser = () => store.get("user", null);
const getDone = (u) => store.get("done:" + u, {});
const getCode = (u, id, starter) => store.get(`code:${u}:${id}`, null) || starter;
// задача: 50 XP (25, если открывали ответ), мини-тест: 20 XP. Ключи тестов начинаются с "q".
const xpOf = (u) => Object.entries(getDone(u)).reduce((s, [k, v]) => s + (k[0] === "q" ? XP_QUIZ : v === "a" ? XP_ASSISTED : XP_PER_TASK), 0);
const topicDone = (t, done) => t.tasks.every(k => done[k.id]);
const topicXp = (t, done) => t.tasks.reduce((s, k) => s + (done[k.id] === "a" ? XP_ASSISTED : done[k.id] ? XP_PER_TASK : 0), 0) + (done["q" + t.id] ? XP_QUIZ : 0);
const allTasks = () => TOPICS.flatMap(t => t.tasks.map(k => ({ ...k, topic: t })));
const tLabel = t => t.id === 0 ? "Введение" : "Тема " + t.id;
const isMobile = () => matchMedia("(max-width: 860px)").matches;

const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// ---------- оформление: тема и размер шрифта ----------
const FS = [0.9, 1, 1.15, 1.3];
function applyPrefs() {
  document.documentElement.dataset.theme = store.get("theme", "dark");
  document.documentElement.style.setProperty("--fs", FS[store.get("fs", 1)]);
  window.gpPrefs?.();
}
$("#theme").onclick = () => { store.set("theme", store.get("theme", "dark") === "dark" ? "light" : "dark"); applyPrefs(); };
$("#fsm").onclick = () => { store.set("fs", Math.max(0, store.get("fs", 1) - 1)); applyPrefs(); };
$("#fsp").onclick = () => { store.set("fs", Math.min(FS.length - 1, store.get("fs", 1) + 1)); applyPrefs(); };
applyPrefs();

// ---------- подсветка Go ----------
const GO_RE = /(\/\/.*)|("(?:\\.|[^"\\\n])*")|(`[^`]*`)|\b(package|import|func|var|const|if|else|for|range|switch|case|default|return|break|continue)\b|\b(int|float64|string|bool|byte|rune)\b|\b(true|false|nil)\b|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_]\w*)(?=\()/g;
function hl(code) {
  let out = "", last = 0, m;
  GO_RE.lastIndex = 0;
  while ((m = GO_RE.exec(code))) {
    out += esc(code.slice(last, m.index));
    const cls = m[1] ? "c" : (m[2] || m[3]) ? "s" : m[4] ? "k" : m[5] ? "t" : m[6] ? "b" : m[7] ? "n" : "f";
    out += `<span class="tk-${cls}">${esc(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  return out + esc(code.slice(last));
}

// ---------- мини-разметка: ``` блоки, {{inline}}, пустая строка = абзац ----------
// термины из глоссария подчёркиваются при первом упоминании в блоке текста
function glossify(escaped, seen) {
  const found = [];
  let text = escaped;
  for (const [stem, def] of GLOSSARY) {
    if (seen.has(stem)) continue;
    const re = new RegExp("(?<!\\p{L})(" + stem + "\\p{L}*)", "iu");
    if (re.test(text)) { seen.add(stem); text = text.replace(re, (_, w) => { found.push([w, def]); return "\u0001" + (found.length - 1) + "\u0002"; }); }
  }
  return text.replace(/\u0001(\d+)\u0002/g, (_, i) => `<span class="term" tabindex="0" data-def="${esc(found[i][1])}">${found[i][0]}</span>`);
}
function inline(p, seen = new Set()) {
  return p.split(/(\{\{.+?\}\}(?!\}))/).map((part, i) =>
    i % 2 ? `<code>${esc(part.slice(2, -2))}</code>` : glossify(esc(part), seen)).join("");
}
function render(text) {
  const seen = new Set();
  return text.trim().split(/```/).map((chunk, i) => {
    if (i % 2) {
      const raw = chunk.replace(/^\n/, "").replace(/\s+$/, "");
      const copy = /fmt\.|func |:=|package |\bfor\b|switch|\bif\b/.test(raw)
        ? `<button class="copy" data-copy="${encodeURIComponent(raw)}">Копировать</button>` : "";
      return `<div class="codewrap">${copy}<pre class="code"><code>${hl(raw)}</code></pre></div>`;
    }
    return chunk.trim().split(/\n\s*\n/).filter(Boolean).map(p => `<p>${inline(p.trim(), seen)}</p>`).join("");
  }).join("");
}

// всплывающие определения терминов и кнопки «Копировать»
const tip = document.body.appendChild(Object.assign(document.createElement("div"), { id: "tip" }));
function showTip(el) {
  tip.innerHTML = `<b>${esc(el.textContent)}</b>${esc(el.dataset.def)}`;
  tip.classList.add("on");
  const r = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
  tip.style.left = Math.min(Math.max(8, r.left), innerWidth - w - 8) + "px";
  tip.style.top = (r.top - h - 8 < 8 ? r.bottom + 8 : r.top - h - 8) + "px";
}
const hideTip = () => tip.classList.remove("on");
document.addEventListener("mouseover", e => { const t = e.target.closest?.(".term"); if (t) showTip(t); });
document.addEventListener("mouseout", e => { if (e.target.closest?.(".term")) hideTip(); });
document.addEventListener("focusin", e => { const t = e.target.closest?.(".term"); if (t) showTip(t); });
document.addEventListener("focusout", hideTip);
document.addEventListener("click", e => {
  const t = e.target.closest?.(".term"); if (t) showTip(t); else hideTip();
  const c = e.target.closest?.("[data-copy]");
  if (c) {
    const text = decodeURIComponent(c.dataset.copy);
    const done = () => { c.textContent = "Скопировано ✓"; c.classList.add("ok"); setTimeout(() => { c.textContent = "Копировать"; c.classList.remove("ok"); }, 1400); };
    (navigator.clipboard?.writeText(text) ?? Promise.reject()).then(done, () => {
      const t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); done(); } catch { } t.remove();
    });
  }
});

// ---------- разбор ошибок для новичков ----------
const isSkeleton = (c, i, k) => c === "package main" || c === 'import "fmt"' || c === "func main() {" || i === k.lines.length - 1;
const isCloser = c => ["}", "})"].includes(c.trim());

function diagnose(src) {
  const tips = [];
  const nc = src.replace(/\/\/.*$/gm, "");                              // без комментариев
  const c = nc.replace(/"(?:\\.|[^"\\\n])*"/g, '""');                   // ещё и без содержимого строк
  const n = re => (c.match(re) || []).length;
  if ((nc.match(/(?<!\\)"/g) || []).length % 2) tips.push("Нечётное число кавычек <code>\"</code> - одну из них забыли закрыть.");
  if (n(/\{/g) > n(/\}/g)) tips.push("Не хватает закрывающей скобки <code>}</code> - у каждой <code>{</code> должна быть пара.");
  else if (n(/\{/g) < n(/\}/g)) tips.push("Лишняя закрывающая скобка <code>}</code>.");
  if (n(/\(/g) !== n(/\)/g)) tips.push("Круглые скобки <code>( )</code> не сходятся по количеству.");
  if (/'[^'\n]{2,}'/.test(nc)) tips.push("Текст в Go пишется в двойных кавычках <code>\"...\"</code>, а не в одинарных.");
  if (/\bfmt\.(println|printf|print)\b/.test(c)) tips.push("Имя функции пишется с большой буквы: <code>fmt.Println</code>.");
  if (/\bFmt\./.test(c)) tips.push("Пакет называется <code>fmt</code> - с маленькой буквы.");
  if (/(^|[^.\w])(Println|Printf)\(/m.test(c)) tips.push("Перед <code>Println</code> нужно писать <code>fmt.</code> - получится <code>fmt.Println(...)</code>.");
  if (/^\s*(Package|Import|Func|Var|Const|For|If|Else|Return)\b/m.test(c)) tips.push("Ключевые слова Go пишутся с маленькой буквы: <code>package</code>, <code>import</code>, <code>func</code>, <code>if</code>, <code>for</code>.");
  if (/\bif\b[^{\n]*[^=!<>:]=[^=][^{\n]*\{/.test(c)) tips.push("В условии сравнение пишется двумя знаками: <code>==</code>. Одно <code>=</code> - это присваивание.");
  if (/\bfor\b[^{\n;]*:=[^;{\n]*,[^;{\n]*\{/.test(c) && !/\brange\b/.test(c)) tips.push("В <code>for</code> части разделяются точкой с запятой <code>;</code>, а не запятой.");
  if (/\}\s*\n\s*else\b/.test(c)) tips.push("<code>else</code> пишется на той же строке, что и закрывающая скобка: <code>} else {</code>.");
  if (/\bfunction\b|\bdef\b|\bprint\s*\(|\bconsole\.log/.test(c)) tips.push("Это не Go: функции объявляются словом <code>func</code>, а вывод делается через <code>fmt.Println</code>.");
  // присваивание переменной, которую ещё не создали
  const declared = new Set();
  for (const m of c.matchAll(/([\w\s,]+?)\s*:=/g)) m[1].split(",").forEach(x => declared.add(x.trim().split(/\s+/).pop()));
  for (const m of c.matchAll(/\b(?:var|const)\s+(\w+)/g)) declared.add(m[1]);
  for (const m of c.matchAll(/\bfunc\s+\w*\s*\(([^)]*)\)/g)) m[1].split(",").forEach(x => declared.add(x.trim().split(/\s+/)[0]));
  const seen = new Set();
  for (const m of c.matchAll(/^[ \t]*([A-Za-z_]\w*)\s*=\s*[^=]/gm))
    if (!declared.has(m[1]) && !seen.has(m[1])) { seen.add(m[1]); tips.push(`Переменная <code>${esc(m[1])}</code> ещё не создана. Создавайте через <code>:=</code> (например, <code>${esc(m[1])} := ...</code>), а одиночное <code>=</code> только меняет существующую.`); }
  return tips;
}

// сравнение с образцом слева: какие строки отличаются и чего не хватает
function analyze(src, k) {
  const norm = s => s.replace(/\/\/.*$/, "").replace(/\s+/g, "");
  const sol = new Set(k.lines.map(l => l[0].replace(/\s+/g, "")).filter(Boolean));
  const bad = [], have = new Set();
  src.split("\n").forEach((l, i) => { const n = norm(l); if (!n) return; have.add(n); if (!sol.has(n)) bad.push(i); });
  const missing = k.lines.filter(([c], i) => c.trim() && !isSkeleton(c, i, k) && !isCloser(c) && !have.has(c.replace(/\s+/g, ""))).map(l => l[0].trim());
  return { bad, missing, tips: diagnose(src) };
}

// подсказки трёх уровней: намёк -> шаги -> первая строка
function hintLevels(k) {
  const core = k.lines.map(([c, e], i) => ({ c, e, i })).filter(x => x.c.trim() && !isSkeleton(x.c, x.i, k) && !isCloser(x.c));
  return [
    esc(k.hint),
    "Что нужно сделать по шагам: " + core.map((x, n) => `${n + 1}) ${esc(x.e)}`).join(" "),
    `Почти ответ - первая нужная строка: <code>${esc(core[0].c.trim())}</code>` + (core.length > 1 ? ". Остальные строки - в таблице выше." : "."),
  ];
}

// ---------- chrome ----------
function chrome(crumbHtml) {
  const u = getUser();
  $("#crumb").innerHTML = crumbHtml || "";
  $("#user").hidden = $("#logout").hidden = $("#xp").hidden = !u;
  if (u) { $("#user").textContent = "@" + u; $("#xp").textContent = xpOf(u) + " XP"; }
}
$("#logout").onclick = () => { store.set("user", null); location.hash = "#/login"; };

// ---------- views ----------
function viewLogin() {
  chrome("login");
  app.innerHTML = `
    <div class="login">
      <div class="robot">01</div>
      <h1>Go Piscine</h1>
      <p>Учебная платформа по основам Go. Введите логин.</p>
      <form class="card" id="f">
        <label for="n">Логин</label>
        <input id="n" autocomplete="off" maxlength="20" placeholder="например, Omar" autofocus>
        <button class="btn" type="submit">Войти</button>
      </form>
    </div>`;
  $("#f").onsubmit = e => {
    e.preventDefault();
    const name = $("#n").value.trim().replace(/[^\p{L}\p{N}_. -]/gu, "").replace(/\s+/g, " ");
    if (!name) return $("#n").focus();
    store.set("user", name);
    location.hash = "#/";
  };
}

function viewDashboard(u) {
  chrome(`<span>dashboard</span>`);
  const done = getDone(u);
  const tasks = allTasks();
  const nDone = tasks.filter(t => done[t.id]).length;
  const pct = Math.round(nDone / tasks.length * 100);
  const board = [...DEMO_USERS.filter(([n]) => n !== u), [u, xpOf(u)]].sort((a, b) => b[1] - a[1]);
  const next = tasks.find(t => !done[t.id]);

  app.innerHTML = `
    <div class="wrap">
      <h1>Добро пожаловать, ${esc(u)}!</h1>
      <p class="sub">${TOPICS.length} тем · ${tasks.length} задач · выполнено ${nDone} (${pct}%)</p>
      <div class="progress"><i style="width:${pct}%"></i></div>
      <div class="grid">
        <div>
          <h3 class="sec">Темы</h3>
          <div class="topics">
            ${TOPICS.map(t => `
              <a class="topic ${topicDone(t, done) ? "complete" : ""}" href="#/topic/${t.id}">
                <span class="n">${t.id === 0 ? "введение" : String(t.id).padStart(2, "0")}${topicDone(t, done) ? " · пройдена" : ""}</span>
                <h2>${esc(t.title)}</h2>
                <div class="rows">${t.tasks.map(k =>
    `<span><span class="dot ${done[k.id] ? "done" : ""}"></span>${esc(k.title)}</span>`).join("")}
                  <span><span class="dot ${done["q" + t.id] ? "done" : ""}"></span>Мини-тест</span></div>
              </a>`).join("")}
          </div>
        </div>
        <aside>
          <div class="side" style="margin-bottom:16px">
            <h3 class="sec">Что дальше</h3>
            ${next
      ? `<p style="margin:0 0 12px">${tLabel(next.topic)}: ${esc(next.topic.title)}<br><span class="empty">${esc(next.title)}</span></p>
                 <a class="btn" style="display:inline-block;text-decoration:none" href="#/topic/${next.topic.id}">Продолжить →</a>`
      : `<p style="margin:0">Все задачи решены. Отличная работа!</p>`}
          </div>
          <div class="side">
            <h3 class="sec">Лидерборд</h3>
            <ol class="lb">
              ${board.map(([n, x], i) => `<li class="${n === u ? "me" : ""}"><span>${i + 1}. ${esc(n)}</span><span>${x} XP</span></li>`).join("")}
            </ol>
            <p class="note">Выполняйте задания и продвигайтесь вперёд.</p>
          </div>
        </aside>
      </div>
    </div>`;
}

function viewTopic(u, tid) {
  const topic = TOPICS.find(t => t.id === tid);
  if (!topic) return (location.hash = "#/");
  const done = getDone(u);
  const idx = TOPICS.indexOf(topic), prev = TOPICS[idx - 1], next = TOPICS[idx + 1];
  const crumb = `<a href="#/">dashboard</a> / <a href="#/topic/${topic.id}">${topic.id === 0 ? "введение" : "тема " + topic.id}</a>`;
  chrome(crumb);
  const hasQuiz = !!topic.quiz;
  const stepBase = hasQuiz ? 4 : 3;

  const quizBlock = () => !hasQuiz ? "" : `
    <section class="sec-block quiz" id="s-quiz">
      <div class="kicker">Шаг 3 · Мини-тест</div>
      <h2>Проверьте себя</h2>
      <p>Выберите правильный ответ. Это не экзамен, а способ закрепить материал (+${XP_QUIZ} XP).</p>
      ${topic.quiz.map((q, qi) => `
        <div class="qq" data-qi="${qi}">
          <div class="qtext">${qi + 1}. ${inline(q.q)}</div>
          <div class="opts">${q.o.map((t, oi) => ({ t, ok: oi === 0 })).sort(() => Math.random() - .5)
      .map(o => `<button class="opt" data-ok="${o.ok ? 1 : 0}">${inline(o.t)}</button>`).join("")}</div>
          <div class="why"></div>
        </div>`).join("")}
      <div class="quiz-done" id="qdone"></div>
    </section>`;

  const taskBlock = (k, i) => `
    <section class="sec-block" id="s-t${i}" data-k="${k.id}">
      <div class="kicker">Шаг ${i + stepBase} · Практика</div>
      <h2>Задача ${i + 1}: ${esc(k.title)} <span class="badge" data-badge="${k.id}"></span></h2>
      ${render(k.desc)}
      <div class="note-box">Часть кода уже введена в редактор справа - остаётся лишь дополнить его, чтобы программа стала полной.</div>
      <ol class="steps">
        <li>Читайте код ниже сверху вниз - у каждой строки справа есть пояснение.</li>
        <li>Печатайте недостающие строки в редакторе справа или просто кликните по строке ниже - она вставится сама. Отступ - клавиша <kbd>Tab</kbd>.</li>
        <li>Нажмите «Проверить» (или <kbd>Ctrl</kbd>+<kbd>Enter</kbd>).</li>
      </ol>
      <div class="annot">
        ${k.lines.map(([c, e], i) => c === "" ? `<div class="gap"></div>` :
        `<div class="ln${isSkeleton(c, i, k) ? "" : " click"}" data-k="${k.id}" data-i="${i}"><pre><code>${hl(c)}</code></pre><span>${esc(e)}</span></div>`).join("")}
      </div>
      <div class="expect"><b>Ожидаемый вывод</b><pre>${esc(k.output)}</pre></div>
      <div class="hintbox" data-hint="${k.id}"></div>
      <button class="btn ghost open" data-open="${k.id}">Открыть в редакторе →</button>
    </section>`;

  app.innerHTML = `
    <div class="learn" data-pane="left">
      <section class="left">
        <nav class="chips" id="chips">
          <button data-s="s-theory">Лекция</button>
          <button data-s="s-examples">Примеры</button>
          ${hasQuiz ? `<button data-s="s-quiz">Тест</button>` : ""}
          ${topic.tasks.map((k, i) => `<button data-s="s-t${i}">Задача ${i + 1}</button>`).join("")}
        </nav>
        <div class="scroll" id="scroll">
          <header class="hero">
            <div class="kicker">${topic.id === 0 ? "Введение" : `Тема ${topic.id} из ${TOPICS.length - 1}`}</div>
            <h1>${esc(topic.title)}</h1>
            <p class="lead">В этой теме: ${esc(topic.about)}.</p>
          </header>
          <section class="sec-block" id="s-theory"><div class="kicker">Шаг 1 · Лекция</div><h2>Что нужно знать</h2>${render(topic.theory)}</section>
          <section class="sec-block" id="s-examples"><div class="kicker">Шаг 2 · Примеры</div><h2>Как это выглядит</h2>${render(topic.examples)}</section>
          ${quizBlock()}
          ${topic.tasks.map(taskBlock).join("")}
          <div class="endpad" id="endpad"></div>
        </div>
      </section>
      <section class="right">
        <div class="bar">
          <div class="seg" id="seg">
            ${topic.tasks.map((k, i) => `<button data-k="${k.id}">Задача ${i + 1}<i></i></button>`).join("")}
          </div>
          <span class="file">main.go</span>
          <span class="status todo" id="st">waiting</span>
        </div>
        <div class="editor">
          <div class="gutter" id="gut"></div>
          <div class="bands"><div class="in" id="bands"></div></div>
          <pre class="hl" aria-hidden="true"><code id="hl"></code></pre>
          <textarea id="code" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea>
        </div>
        <div class="actions">
          <button class="btn" id="run">Проверить</button>
          <button class="btn ghost" id="reset">Сбросить</button>
          <span class="grow"></span>
          ${prev ? `<a class="btn ghost" href="#/topic/${prev.id}" title="${esc(prev.title)}">← ${tLabel(prev)}</a>` : ""}
          ${next ? `<a class="btn ghost" id="nextTopic" href="#/topic/${next.id}" title="${esc(next.title)}">${tLabel(next)} →</a>` : `<a class="btn ghost" id="nextTopic" href="#/">На дашборд</a>`}
        </div>
        <div class="console" id="out"></div>
      </section>
      <nav class="mobbar"><button data-p="left" class="on">Учебник</button><button data-p="right">Код</button></nav>
    </div>`;

  // --- мобильная версия: переключатель «Учебник / Код»
  const learn = $(".learn");
  const setPane = p => { learn.dataset.pane = p; $$(".mobbar button").forEach(b => b.classList.toggle("on", b.dataset.p === p)); };
  $$(".mobbar button").forEach(b => b.onclick = () => setPane(b.dataset.p));
  const toEditor = () => { if (isMobile()) setPane("right"); };

  // --- левая панель: навигация и scrollspy
  const scroll = $("#scroll");
  $$("#chips button").forEach(b => b.onclick = () => scrollToSec(b.dataset.s));
  function scrollToSec(id) { scroll.scrollTo({ top: $("#" + id).offsetTop - 8, behavior: "smooth" }); }
  const secIds = ["s-theory", "s-examples", ...(hasQuiz ? ["s-quiz"] : []), ...topic.tasks.map((_, i) => "s-t" + i)];
  const spy = () => {
    let cur = secIds[0];
    secIds.forEach(id => { if ($("#" + id).offsetTop - 80 <= scroll.scrollTop) cur = id; });
    $$("#chips button").forEach(b => b.classList.toggle("on", b.dataset.s === cur));
  };
  scroll.onscroll = spy; spy();

  // --- мини-тест
  if (hasQuiz) {
    const quizDone = () => !!getDone(u)["q" + topic.id];
    const showWhy = (qq, ok, text) => { const w = $(".why", qq); w.className = "why on" + (ok ? "" : " no"); w.innerHTML = text; };
    if (quizDone()) {
      $$(".qq").forEach(qq => {
        $$(".opt", qq).forEach(o => { o.disabled = true; if (o.dataset.ok === "1") o.classList.add("right"); });
        showWhy(qq, true, inline(topic.quiz[+qq.dataset.qi].why));
      });
      $("#qdone").textContent = "Тест пройден ✓";
    }
    $("#s-quiz").addEventListener("click", e => {
      const b = e.target.closest(".opt"); if (!b || b.disabled) return;
      const qq = b.closest(".qq"), q = topic.quiz[+qq.dataset.qi];
      if (b.dataset.ok === "1") {
        b.classList.add("right"); $$(".opt", qq).forEach(x => x.disabled = true);
        showWhy(qq, true, inline(q.why)); qq.dataset.solved = "1";
        if ($$(".qq").every(x => x.dataset.solved)) {
          const d = getDone(u), first = !d["q" + topic.id];
          d["q" + topic.id] = true; store.set("done:" + u, d); chrome(crumb);
          $("#qdone").textContent = first ? `Тест пройден! +${XP_QUIZ} XP` : "Тест пройден ✓";
        }
      } else { b.classList.add("wrong"); b.disabled = true; showWhy(qq, false, "Не совсем. Подумайте ещё и выберите другой вариант."); }
    });
  }

  // --- подсказки трёх уровней
  function renderHints(k) {
    const box = $(`[data-hint="${k.id}"]`), lv = hintLevels(k), n = store.get(`hint:${u}:${k.id}`, 0);
    box.innerHTML = lv.slice(0, n).map((h, i) => `<p class="hl-item"><b>Подсказка ${i + 1} из ${lv.length}</b>${h}</p>`).join("") +
      (n < lv.length ? `<button class="more" data-more="${k.id}">${n ? "Ещё подсказка" : "Нужна подсказка?"} (${n + 1}/${lv.length})</button>`
        : `<span class="empty">Все подсказки открыты. Если не получается - после двух неудачных проверок справа появится «Показать ответ».</span>`);
  }
  topic.tasks.forEach(renderHints);
  scroll.addEventListener("click", e => {
    const m = e.target.closest("[data-more]");
    if (m) { const k = topic.tasks.find(x => x.id === m.dataset.more); store.set(`hint:${u}:${k.id}`, store.get(`hint:${u}:${k.id}`, 0) + 1); renderHints(k); }
  });

  // --- редактор
  const ta = $("#code"), gut = $("#gut"), hlEl = $("#hl"), out = $("#out"), hlPre = $(".hl"), bandsEl = $("#bands");
  let active = null;
  const sync = () => { hlPre.scrollTop = gut.scrollTop = ta.scrollTop; hlPre.scrollLeft = ta.scrollLeft; bandsEl.style.transform = `translateY(${-ta.scrollTop}px)`; };
  const paint = () => {
    hlEl.innerHTML = hl(ta.value) + "\n";
    gut.textContent = Array.from({ length: ta.value.split("\n").length }, (_, i) => i + 1).join("\n");
    sync();
  };
  const setBands = (lines) => {   // красные полосы на строках с ошибкой
    const cs = getComputedStyle(ta), lh = parseFloat(cs.lineHeight), pt = parseFloat(cs.paddingTop);
    bandsEl.innerHTML = lines.map(i => `<div class="band" style="top:${pt + i * lh}px;height:${lh}px"></div>`).join("");
  };
  window.gpPrefs = () => setBands([]);
  ta.oninput = () => { paint(); setBands([]); if (active) store.set(`code:${u}:${active.id}`, ta.value); };
  ta.onscroll = sync;
  ta.onkeydown = e => {
    const s = ta.selectionStart;
    if (e.key === "Tab") { e.preventDefault(); ta.setRangeText("    ", s, ta.selectionEnd, "end"); ta.oninput(); }
    else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); check(); }
    else if (e.key === "Enter") { // автоотступ
      e.preventDefault();
      const before = ta.value.slice(0, s), line = before.slice(before.lastIndexOf("\n") + 1);
      const indent = line.match(/^\s*/)[0] + (/\{\s*$/.test(line) ? "    " : "");
      ta.setRangeText("\n" + indent, s, ta.selectionEnd, "end"); ta.oninput();
    } else if (e.key === "}") { // «}» на пустой строке сдвигаем влево
      const before = ta.value.slice(0, s), line = before.slice(before.lastIndexOf("\n") + 1);
      if (/^ +$/.test(line)) { e.preventDefault(); const cut = Math.min(4, line.length); ta.setRangeText("}", s - cut, ta.selectionEnd, "end"); ta.oninput(); }
    }
  };

  function refreshBadges() {
    const d = getDone(u);
    topic.tasks.forEach(k => {
      const b = $(`[data-badge="${k.id}"]`); b.textContent = d[k.id] ? "решено" : ""; b.className = "badge" + (d[k.id] ? " ok" : "");
      const s = $(`#seg [data-k="${k.id}"] i`); s.textContent = d[k.id] ? "✓" : "";
    });
    const complete = topicDone(topic, d);
    $("#nextTopic").classList.toggle("primary", complete);
    $("#endpad").innerHTML = complete
      ? `<div class="endcard"><b>${tLabel(topic)} пройден${topic.id === 0 ? "о" : "а"}</b>${next
        ? `<span>Дальше: ${tLabel(next).toLowerCase()} - ${esc(next.title)}. Узнаем ${esc(next.about)}.</span><a class="btn" href="#/topic/${next.id}">Перейти: ${tLabel(next).toLowerCase()} →</a>`
        : `<span>Это была последняя тема. Курс пройден!</span><a class="btn" href="#/">На дашборд</a>`}</div>`
      : `<div class="endcard muted">Решите ${topic.tasks.length > 1 ? "обе задачи" : "задачу"}, чтобы открыть следующую тему.${next ? `<a href="#/topic/${next.id}">Пропустить →</a>` : ""}</div>`;
    if (active) { const ok = !!d[active.id]; $("#st").className = "status " + (ok ? "done" : "todo"); $("#st").textContent = ok ? "passed" : "waiting"; }
  }

  function open(id, scrollLeft = true) {
    active = topic.tasks.find(k => k.id === id);
    $$("#seg button").forEach(b => b.classList.toggle("on", b.dataset.k === id));
    ta.value = getCode(u, id, active.starter); paint(); setBands([]);
    const at = ta.value.indexOf("Пишите решение здесь");
    if (at >= 0) { const e = ta.value.indexOf("\n", at); ta.setSelectionRange(e, e); }
    out.innerHTML = `<div class="h">Результат</div><span class="empty">Нажмите «Проверить» (Ctrl+Enter)</span>`;
    refreshBadges();
    if (scrollLeft) scrollToSec("s-t" + topic.tasks.indexOf(active));
    if (!isMobile()) ta.focus();
  }
  $$("#seg button").forEach(b => b.onclick = () => open(b.dataset.k));
  $$("[data-open]").forEach(b => b.onclick = () => { open(b.dataset.open, false); toEditor(); });
  $("#reset").onclick = () => { ta.value = active.starter; ta.oninput(); out.innerHTML = `<div class="h">Результат</div><span class="empty">Код сброшен к каркасу</span>`; if (!isMobile()) ta.focus(); };

  // клик по строке образца вставляет её в редактор
  function insertLine(k, i) {
    if (!active || active.id !== k.id) open(k.id, false);
    const line = k.lines[i][0], mainIdx = k.lines.findIndex(l => l[0] === "func main() {");
    let v = ta.value, caret;
    if (i < mainIdx) {                              // строка относится к функции выше main
      const at = v.indexOf("func main() {");
      if (at < 0) return;
      const ins = line + (line.trim() === "}" ? "\n\n" : "\n");
      v = v.slice(0, at) + ins + v.slice(at); caret = at + ins.length;
    } else {                                        // строка внутри main
      const s = ta.selectionStart, ls = v.lastIndexOf("\n", s - 1) + 1;
      let le = v.indexOf("\n", s); if (le < 0) le = v.length;
      const cur = v.slice(ls, le), lastBrace = v.lastIndexOf("\n}");
      if (/Пишите решение здесь/.test(cur)) { v = v.slice(0, ls) + line + v.slice(le); caret = ls + line.length; }
      else { const at = lastBrace >= 0 && le > lastBrace ? lastBrace : le; v = v.slice(0, at) + "\n" + line + v.slice(at); caret = at + 1 + line.length; }
    }
    ta.value = v; ta.setSelectionRange(caret, caret); ta.oninput();
    toEditor(); if (!isMobile()) ta.focus();
  }
  scroll.addEventListener("click", e => {
    const ln = e.target.closest(".ln.click");
    if (ln) insertLine(topic.tasks.find(x => x.id === ln.dataset.k), +ln.dataset.i);
  });

  function check() {
    if (ta.value.trim() === active.starter.trim()) { out.innerHTML = `<div class="h">Результат</div><div class="bad">Вы ещё ничего не дописали. Напечатайте код из задачи слева внутрь func main.</div>`; setBands([]); return; }
    const code = ta.value.replace(/\/\/.*$/gm, "");
    const results = active.checks.map(c => ({ ok: c.re.test(code), msg: c.msg }));
    const pass = results.every(r => r.ok);
    const done = getDone(u), was = !!done[active.id], wasTopic = topicDone(topic, done);
    let html = `<div class="h">Результат</div>` + results.map(r =>
      `<div class="row ${r.ok ? "ok" : "bad"}"><span>${r.ok ? "✓" : "✗"}</span><span>${r.ok ? "проверка пройдена" : esc(r.msg)}</span></div>`).join("");
    let showAnswer = false;
    if (pass) {
      const assisted = !!store.get(`assist:${u}:${active.id}`, false);
      const gain = was ? 0 : (assisted ? XP_ASSISTED : XP_PER_TASK);
      html += `<div class="ok" style="margin-top:10px">Тест пройден. +${gain} XP${assisted && !was ? " (ответ был открыт)" : ""}</div><pre>${esc(active.output)}</pre>`;
      if (!was) { done[active.id] = assisted ? "a" : true; store.set("done:" + u, done); }
      setBands([]);
      const other = topic.tasks.find(k => !done[k.id]);
      if (other) html += `<button class="btn" id="go" style="margin-top:12px">Следующая задача →</button>`;
    } else {
      const tries = store.get(`tries:${u}:${active.id}`, 0) + 1; store.set(`tries:${u}:${active.id}`, tries);
      const a = analyze(ta.value, active);
      setBands(a.bad);
      const tips = [];
      if (a.bad.length) tips.push(`Подсвеченные красным строки (${a.bad.map(i => i + 1).join(", ")}) отличаются от образца слева.`);
      if (a.missing.length) tips.push("Не хватает строки: " + a.missing.slice(0, 2).map(m => `<code>${esc(m)}</code>`).join(", ") + ".");
      tips.push(...a.tips);
      html += `<div class="bad" style="margin-top:10px">Что-то не совпало. Сравните свой код с кодом слева и попробуйте ещё раз.</div>`;
      if (tips.length) html += `<div class="tips"><b>Возможные причины</b><ul>${tips.map(t => `<li>${t}</li>`).join("")}</ul></div>`;
      showAnswer = tries >= 2 && !was;
      if (showAnswer) html += `<div class="assist"><button class="btn ghost small" id="showAns">Показать ответ</button><small>Ответ вставится в редактор, а XP за задачу будет ${XP_ASSISTED} вместо ${XP_PER_TASK}.</small></div>`;
    }
    out.innerHTML = html;
    chrome(crumb); refreshBadges();
    const go = $("#go"); if (go) go.onclick = () => open(topic.tasks.find(k => !getDone(u)[k.id]).id);
    const ans = $("#showAns");
    if (ans) ans.onclick = () => {
      store.set(`assist:${u}:${active.id}`, true);
      ta.value = active.solution; ta.oninput();
      out.innerHTML = `<div class="h">Результат</div><span class="empty">Ответ вставлен в редактор. Нажмите «Проверить», чтобы засчитать задачу.</span>`;
    };
    if (pass && !wasTopic && topicDone(topic, done)) setTimeout(() => celebrate(topic), 450);
  }
  $("#run").onclick = check;

  open(topic.tasks.find(k => !done[k.id])?.id ?? topic.tasks[0].id, false);
  ta.blur();
}

function celebrate(topic) {
  const idx = TOPICS.indexOf(topic), next = TOPICS[idx + 1];
  const xp = topicXp(topic, getDone(getUser()));
  const el = document.createElement("div");
  el.className = "overlay";
  el.innerHTML = `
    <div class="modal">
      <div class="trophy">★</div>
      ${next ? `
        <h2>Поздравляем! ${tLabel(topic)} пройден${topic.id === 0 ? "о" : "а"}</h2>
        <p class="m-sub">${esc(topic.title)} - готово. Вы заработали ${xp} XP.</p>
        <div class="next"><span>Следующая: ${tLabel(next).toLowerCase()}</span><b>${esc(next.title)}</b><em>Узнаем ${esc(next.about)}.</em></div>
        <div class="m-actions"><a class="btn" href="#/topic/${next.id}">Перейти: ${tLabel(next).toLowerCase()} →</a><a class="btn ghost" href="#/">На дашборд</a></div>`
      : `
        <h2>Курс пройден!</h2>
        <p class="m-sub">Вы завершили все темы и освоили основы Go. Отличная работа!</p>
        <div class="m-actions"><a class="btn" href="#/">На дашборд</a></div>`}
    </div>`;
  document.body.appendChild(el);
  const close = () => el.remove();
  el.onclick = e => { if (e.target === el || e.target.closest("a")) close(); };
  addEventListener("hashchange", close, { once: true });
}

// ---------- router ----------
function route() {
  $$(".overlay").forEach(o => o.remove());
  window.gpPrefs = null;
  const u = getUser(), h = location.hash || "#/";
  if (!u) { if (h !== "#/login") { location.hash = "#/login"; return; } return viewLogin(); }
  if (h === "#/login") { location.hash = "#/"; return; }
  let m = h.match(/^#\/topic\/(\d+)/);
  if (m) return viewTopic(u, +m[1]);
  m = h.match(/^#\/task\/(\w+)/); // старые ссылки
  if (m) { const t = TOPICS.find(t => t.tasks.some(k => k.id === m[1])); if (t) { location.hash = "#/topic/" + t.id; return; } }
  viewDashboard(u);
}
addEventListener("hashchange", route);
route();
