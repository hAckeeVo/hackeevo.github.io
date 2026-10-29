// Go Piscine - демо-платформа. Всё хранится в localStorage, сервера нет.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const app = $("#app");
const XP_PER_TASK = 50;

const DEMO_USERS = [["gopher", 1000], ["bitebayev", 950], ["sleepyhead", 900], ["akerke", 850], ["arigana", 800]];

// ---------- storage ----------
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem("gp:" + k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem("gp:" + k, JSON.stringify(v)); } catch { } },
};
const getUser = () => store.get("user", null);
const getDone = (u) => store.get("done:" + u, {});
const getCode = (u, id) => store.get(`code:${u}:${id}`, "");
const xpOf = (u) => Object.keys(getDone(u)).length * XP_PER_TASK;
const topicDone = (t, done) => t.tasks.every(k => done[k.id]);
const allTasks = () => TOPICS.flatMap(t => t.tasks.map(k => ({ ...k, topic: t })));

const esc = s => s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

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

// мини-разметка: ``` блоки, {{inline}}, пустая строка = абзац
function render(text) {
  return text.trim().split(/```/).map((chunk, i) => {
    if (i % 2) return `<pre class="code"><code>${hl(chunk.replace(/^\n/, "").replace(/\s+$/, ""))}</code></pre>`;
    return chunk.trim().split(/\n\s*\n/).filter(Boolean)
      .map(p => `<p>${esc(p.trim()).replace(/\{\{(.+?)\}\}(?!\})/g, "<code>$1</code>")}</p>`).join("");
  }).join("");
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
    const name = $("#n").value.trim().replace(/[^\w.-]/g, "");
    if (!name) return $("#n").focus();
    store.set("user", name);
    location.hash = "#/";
  };
}

function viewDashboard(u) {
  chrome(`<span>dashboard</span>`);
  const done = getDone(u);
  const tasks = allTasks();
  const nDone = Object.keys(done).length;
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
                <span class="n">${String(t.id).padStart(2, "0")}${topicDone(t, done) ? " · пройдена" : ""}</span>
                <h2>${esc(t.title)}</h2>
                <div class="rows">${t.tasks.map(k =>
    `<span><span class="dot ${done[k.id] ? "done" : ""}"></span>${esc(k.title)}</span>`).join("")}</div>
              </a>`).join("")}
          </div>
        </div>
        <aside>
          <div class="side" style="margin-bottom:16px">
            <h3 class="sec">Что дальше</h3>
            ${next
      ? `<p style="margin:0 0 12px">Тема ${next.topic.id}: ${esc(next.topic.title)}<br><span class="empty">${esc(next.title)}</span></p>
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
  const prev = TOPICS.find(t => t.id === topic.id - 1), next = TOPICS.find(t => t.id === topic.id + 1);
  const crumb = `<a href="#/">dashboard</a> / <a href="#/topic/${topic.id}">тема ${topic.id}</a>`;
  chrome(crumb);

  const taskBlock = (k, i) => `
    <section class="sec-block" id="s-t${i}" data-k="${k.id}">
      <div class="kicker">Шаг ${i + 3} · Практика</div>
      <h2>Задача ${i + 1}: ${esc(k.title)} <span class="badge" data-badge="${k.id}"></span></h2>
      ${render(k.desc)}
      <ol class="steps">
        <li>Читайте код ниже сверху вниз - у каждой строки справа есть пояснение.</li>
        <li>Печатайте те же строки в редакторе справа. Отступ - клавиша <kbd>Tab</kbd>.</li>
        <li>Нажмите «Проверить» (или <kbd>Ctrl</kbd>+<kbd>Enter</kbd>).</li>
      </ol>
      <div class="annot">
        ${k.lines.map(([c, e]) => c === "" ? `<div class="gap"></div>` :
    `<div class="ln"><pre><code>${hl(c)}</code></pre><span>${esc(e)}</span></div>`).join("")}
      </div>
      <div class="expect"><b>Ожидаемый вывод</b><pre>${esc(k.output)}</pre></div>
      <details class="hint"><summary>Подсказка</summary><p>${esc(k.hint)}</p></details>
      <button class="btn ghost open" data-open="${k.id}">Открыть в редакторе →</button>
    </section>`;

  app.innerHTML = `
    <div class="learn">
      <section class="left">
        <nav class="chips" id="chips">
          <button data-s="s-theory">Лекция</button>
          <button data-s="s-examples">Примеры</button>
          ${topic.tasks.map((k, i) => `<button data-s="s-t${i}">Задача ${i + 1}</button>`).join("")}
        </nav>
        <div class="scroll" id="scroll">
          <header class="hero">
            <div class="kicker">Тема ${topic.id} из ${TOPICS.length}</div>
            <h1>${esc(topic.title)}</h1>
            <p class="lead">В этой теме: ${esc(topic.about)}.</p>
          </header>
          <section class="sec-block" id="s-theory"><div class="kicker">Шаг 1 · Лекция</div><h2>Что нужно знать</h2>${render(topic.theory)}</section>
          <section class="sec-block" id="s-examples"><div class="kicker">Шаг 2 · Примеры</div><h2>Как это выглядит</h2>${render(topic.examples)}</section>
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
          <pre class="hl" aria-hidden="true"><code id="hl"></code></pre>
          <textarea id="code" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="// Перепечатайте код задачи сюда"></textarea>
        </div>
        <div class="actions">
          <button class="btn" id="run">Проверить</button>
          <button class="btn ghost" id="reset">Очистить</button>
          <span class="grow"></span>
          ${prev ? `<a class="btn ghost" href="#/topic/${prev.id}" title="${esc(prev.title)}">← Тема ${prev.id}</a>` : ""}
          ${next ? `<a class="btn ghost" id="nextTopic" href="#/topic/${next.id}" title="${esc(next.title)}">Тема ${next.id} →</a>` : `<a class="btn ghost" id="nextTopic" href="#/">На дашборд</a>`}
        </div>
        <div class="console" id="out"></div>
      </section>
    </div>`;

  // --- левая панель: навигация и scrollspy
  const scroll = $("#scroll");
  $$("#chips button").forEach(b => b.onclick = () => scrollToSec(b.dataset.s));
  function scrollToSec(id) { scroll.scrollTo({ top: $("#" + id).offsetTop - 8, behavior: "smooth" }); }
  const secIds = ["s-theory", "s-examples", ...topic.tasks.map((_, i) => "s-t" + i)];
  const spy = () => {
    let cur = secIds[0];
    secIds.forEach(id => { if ($("#" + id).offsetTop - 80 <= scroll.scrollTop) cur = id; });
    $$("#chips button").forEach(b => b.classList.toggle("on", b.dataset.s === cur));
  };
  scroll.onscroll = spy; spy();

  // --- редактор
  const ta = $("#code"), gut = $("#gut"), hlEl = $("#hl"), out = $("#out"), hlPre = $(".hl");
  let active = null;
  const paint = () => {
    hlEl.innerHTML = hl(ta.value) + "\n";
    gut.textContent = Array.from({ length: ta.value.split("\n").length }, (_, i) => i + 1).join("\n");
    hlPre.scrollTop = gut.scrollTop = ta.scrollTop; hlPre.scrollLeft = ta.scrollLeft;
  };
  ta.oninput = () => { paint(); if (active) store.set(`code:${u}:${active.id}`, ta.value); };
  ta.onscroll = () => { hlPre.scrollTop = gut.scrollTop = ta.scrollTop; hlPre.scrollLeft = ta.scrollLeft; };
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
      ? `<div class="endcard"><b>Тема ${topic.id} пройдена</b>${next
        ? `<span>Дальше: тема ${next.id} - ${esc(next.title)}. Узнаем ${esc(next.about)}.</span><a class="btn" href="#/topic/${next.id}">Перейти к теме ${next.id} →</a>`
        : `<span>Это была последняя тема. Курс пройден!</span><a class="btn" href="#/">На дашборд</a>`}</div>`
      : `<div class="endcard muted">Решите обе задачи, чтобы открыть следующую тему.${next ? `<a href="#/topic/${next.id}">Пропустить →</a>` : ""}</div>`;
    if (active) { const ok = !!d[active.id]; $("#st").className = "status " + (ok ? "done" : "todo"); $("#st").textContent = ok ? "passed" : "waiting"; }
  }

  function open(id, scrollLeft = true) {
    active = topic.tasks.find(k => k.id === id);
    $$("#seg button").forEach(b => b.classList.toggle("on", b.dataset.k === id));
    ta.value = getCode(u, id); paint();
    out.innerHTML = `<div class="h">Результат</div><span class="empty">Нажмите «Проверить» (Ctrl+Enter)</span>`;
    refreshBadges();
    if (scrollLeft) scrollToSec("s-t" + topic.tasks.indexOf(active));
    ta.focus();
  }
  $$("#seg button").forEach(b => b.onclick = () => open(b.dataset.k));
  $$("[data-open]").forEach(b => b.onclick = () => open(b.dataset.open, false));
  $("#reset").onclick = () => { ta.value = ""; ta.oninput(); out.innerHTML = `<div class="h">Результат</div><span class="empty">Редактор очищен</span>`; ta.focus(); };

  function check() {
    if (!ta.value.trim()) { out.innerHTML = `<div class="h">Результат</div><div class="bad">Редактор пуст. Перепечатайте код из задачи слева.</div>`; return; }
    const code = ta.value.replace(/\/\/.*$/gm, "");
    const results = active.checks.map(c => ({ ok: c.re.test(code), msg: c.msg }));
    const pass = results.every(r => r.ok);
    const done = getDone(u), was = !!done[active.id], wasTopic = topicDone(topic, done);
    let html = `<div class="h">Результат</div>` + results.map(r =>
      `<div class="row ${r.ok ? "ok" : "bad"}"><span>${r.ok ? "✓" : "✗"}</span><span>${r.ok ? "проверка пройдена" : esc(r.msg)}</span></div>`).join("");
    if (pass) {
      html += `<div class="ok" style="margin-top:10px">Тест пройден. +${was ? 0 : XP_PER_TASK} XP</div><pre>${esc(active.output)}</pre>`;
      done[active.id] = true; store.set("done:" + u, done);
      const other = topic.tasks.find(k => !done[k.id]);
      if (other) html += `<button class="btn" id="go" style="margin-top:12px">Следующая задача →</button>`;
    } else html += `<div class="bad" style="margin-top:10px">Что-то не совпало. Сравните свой код с кодом слева и попробуйте ещё раз.</div>`;
    out.innerHTML = html;
    chrome(crumb); refreshBadges();
    const go = $("#go"); if (go) go.onclick = () => open(topic.tasks.find(k => !getDone(u)[k.id]).id);
    if (pass && !wasTopic && topicDone(topic, done)) setTimeout(() => celebrate(topic), 450);
  }
  $("#run").onclick = check;

  open(topic.tasks.find(k => !done[k.id])?.id ?? topic.tasks[0].id, false);
  ta.blur();
}

function celebrate(topic) {
  const next = TOPICS.find(t => t.id === topic.id + 1);
  const el = document.createElement("div");
  el.className = "overlay";
  el.innerHTML = `
    <div class="modal">
      <div class="trophy">★</div>
      ${next ? `
        <h2>Поздравляем! Тема ${topic.id} пройдена</h2>
        <p class="m-sub">${esc(topic.title)} - готово. Вы заработали ${topic.tasks.length * XP_PER_TASK} XP.</p>
        <div class="next"><span>Следующая тема ${next.id}</span><b>${esc(next.title)}</b><em>Узнаем ${esc(next.about)}.</em></div>
        <div class="m-actions"><a class="btn" href="#/topic/${next.id}">Перейти к теме ${next.id} →</a><a class="btn ghost" href="#/">На дашборд</a></div>`
      : `
        <h2>Курс пройден!</h2>
        <p class="m-sub">Вы завершили все ${TOPICS.length} тем и освоили основы Go. Отличная работа!</p>
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
