// Go Piscine - учебная платформа. Темы: Основы Go -> 01 Edu Piscine -> Backend.
if (window.TOPICS) TOPICS.sort((a, b) => a.id - b.id);
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const app = $("#app");
const XP_PER_TASK = 50, XP_ASSISTED = 25, XP_QUIZ = 20, XP_HARD = 75, XP_HARD_ASSISTED = 35;

const DEMO_USERS = [["gopher", 1000], ["bitebayev", 950], ["sleepyhead", 900], ["akerke", 850], ["arigana", 800]];

// ---------- storage ----------
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem("gp:" + k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem("gp:" + k, JSON.stringify(v)); } catch { } },
};
const getUser = () => store.get("user", null);
const getDone = (u) => store.get("done:" + u, {});
const getCode = (u, id, starter) => {
  const v = store.get(`code:${u}:${id}`, null);
  return (v && v.trim().length > 0) ? v : (starter || "");
};
// задача: 50 XP (25, если открывали ответ), мини-тест: 20 XP. Ключи тестов начинаются с "q".
// задачи со звёздочкой (hard) стоят 75 XP, с открытым ответом - 35
const XP_PARSONS = 15, XP_BUGHUNT = 15;
const xpFor = (k, v) => !v ? 0 : k.hard ? (v === "a" ? XP_HARD_ASSISTED : XP_HARD) : (v === "a" ? XP_ASSISTED : XP_PER_TASK);
const taskById = id => TOPICS.flatMap(t => t.tasks).find(k => k.id === id);
const xpOf = (u) => Object.entries(getDone(u)).reduce((s, [k, v]) => {
  if (!v) return s;
  if (k[0] === "q") return s + XP_QUIZ;
  if (k.startsWith("parsons_")) return s + XP_PARSONS;
  if (k.startsWith("bughunt_")) return s + XP_BUGHUNT;
  return s + xpFor(taskById(k) || {}, v);
}, 0);
const topicDone = (t, done) => t.tasks.every(k => done[k.id]);
// тема считается пройденной, когда решены все задачи и пройден мини-тест
const topicComplete = (t, done) => topicDone(t, done) && (!t.quiz || !!done["q" + t.id]);
const topicXp = (t, done) => t.tasks.reduce((s, k) => s + xpFor(k, done[k.id]), 0) + (done["q" + t.id] ? XP_QUIZ : 0) + (done["parsons_" + t.id] ? XP_PARSONS : 0) + (done["bughunt_" + t.id] ? XP_BUGHUNT : 0);

// ---------- блокировки и промокоды ----------
const PROMO_CODES = ["1465", "01EDU", "PISCINE", "MENTOR", "HACKEEVO", "2026", "FREE"];
const isUnlocked = () => store.get("promoUnlocked", false);

// тема открыта, если предыдущая пройдена целиком ИЛИ активирован промокод
const topicLock = (t, done) => {
  if (isUnlocked()) return null;
  const idx = TOPICS.indexOf(t);
  const prev = TOPICS[idx - 1];
  return prev && !topicComplete(prev, done) ? prev : null;
};

// причина, по которой задача закрыта (или null)
const taskLock = (t, k, done) => {
  if (!t || !k) return null;
  if (isUnlocked()) return null;
  const isKZ = (window.getLang && window.getLang()) === "kz";
  if (t.quiz && !done["q" + t.id]) return isKZ ? "Алдымен жоғарыдағы шағын-тестті тапсырыңыз (3-қадам)." : "Сначала пройдите мини-тест выше (шаг 3).";
  const idx = (t.tasks || []).findIndex(x => x.id === k.id);
  const prev = idx > 0 ? t.tasks[idx - 1] : null;
  if (prev && !done[prev.id]) return isKZ ? `Алдымен «${prev.title}» тапсырмасын шешіңіз.` : `Сначала решите задачу «${prev.title}».`;
  return null;
};

// следующий шаг для кнопки «Продолжить»
function nextStep(done) {
  const isKZ = (window.getLang && window.getLang()) === "kz";
  for (const rawT of TOPICS) {
    if (topicComplete(rawT, done)) continue;
    const t = window.getLocalizedTopicFull ? window.getLocalizedTopicFull(rawT) : rawT;
    if (rawT.quiz && !done["q" + rawT.id]) return { topic: t, label: isKZ ? "Шағын-тест" : "Мини-тест" };
    const k = t.tasks.find(k => !done[k.id]);
    return { topic: t, label: k ? k.title : (isKZ ? "Тақырыпты аяқтау" : "Завершить тему") };
  }
  return null;
}
const allTasks = () => TOPICS.flatMap(t => t.tasks.map(k => ({ ...k, topic: t })));
const tLabel = t => {
  const isKZ = (window.getLang && window.getLang()) === "kz";
  return t.id === 0 ? (isKZ ? "Кіріспе" : "Введение") : (isKZ ? t.id + "-тақырып" : "Тема " + t.id);
};
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
const GO_RE = /(\/\/.*)|("(?:\\.|[^"\\\n])*")|(`[^`]*`)|\b(package|import|func|var|const|if|else|for|range|switch|case|default|return|break|continue|type|struct|map|defer)\b|\b(int|float64|string|bool|byte|rune|error)\b|\b(true|false|nil)\b|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_]\w*)(?=\()/g;
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
  const isKZ = (window.getLang && window.getLang()) === "kz";
  const seen = new Set();
  return text.trim().split(/```/).map((chunk, i) => {
    if (i % 2) {
      const raw = chunk.replace(/^\n/, "").replace(/\s+$/, "");
      const copy = /fmt\.|func |:=|package |\bfor\b|switch|\bif\b/.test(raw)
        ? `<button class="copy" data-copy="${encodeURIComponent(raw)}">${isKZ ? "Көшіру" : "Копировать"}</button>` : "";
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
    const isKZ = (window.getLang && window.getLang()) === "kz";
    const done = () => {
      c.textContent = isKZ ? "Көшірілді ✓" : "Скопировано ✓";
      c.classList.add("ok");
      setTimeout(() => {
        c.textContent = isKZ ? "Көшіру" : "Копировать";
        c.classList.remove("ok");
      }, 1400);
    };
    (navigator.clipboard?.writeText(text) ?? Promise.reject()).then(done, () => {
      const t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); done(); } catch { } t.remove();
    });
  }
});

// ---------- разбор ошибок для новичков ----------
// каркас: package, import (в том числе списком), func main и то, что уже введено в редактор (третий элемент строки)
const isSkeleton = (c, i, k) => /^(package main|import\b.*|func main\(\) \{|\)|\s+(_ )?"[\w\/.-]+")$/.test(c) || i === k.lines.length - 1 || !!k.lines[i]?.[2];
const isCloser = c => ["}", "})"].includes(c.trim());

function diagnose(src) {
  const isKZ = (window.getLang && window.getLang()) === "kz";
  const tips = [];
  const nc = src.replace(/\/\/.*$/gm, "");                              // без комментариев
  const c = nc.replace(/"(?:\\.|[^"\\\n])*"/g, '""');                   // ещё и без содержимого строк
  const n = re => (c.match(re) || []).length;
  if ((nc.match(/(?<!\\)"/g) || []).length % 2) tips.push(isKZ ? "Тырнақшалардың саны тақ <code>\"</code> — біреуін жабуды ұмыттыңыз." : "Нечётное число кавычек <code>\"</code> - одну из них забыли закрыть.");
  if (n(/\{/g) > n(/\}/g)) tips.push(isKZ ? "Жабылатын <code>}</code> жақша жетіспейді — әрбір <code>{</code> жақшасының жұбы болуы керек." : "Не хватает закрывающей скобки <code>}</code> - у каждой <code>{</code> должна быть пара.");
  else if (n(/\{/g) < n(/\}/g)) tips.push(isKZ ? "Артық жабылатын <code>}</code> жақшасы бар." : "Лишняя закрывающая скобка <code>}</code>.");
  if (n(/\(/g) !== n(/\)/g)) tips.push(isKZ ? "Дөңгелек жақшалар <code>( )</code> саны сәйкес келмейді." : "Круглые скобки <code>( )</code> не сходятся по количеству.");
  if (/'[^'\n]{2,}'/.test(nc)) tips.push(isKZ ? "Go тілінде мәтін дара тырнақшамен емес, қос тырнақшамен <code>\"...\"</code> жазылады." : "Текст в Go пишется в двойных кавычках <code>\"...\"</code>, а не в одинарных.");
  if (/\bfmt\.(println|printf|print)\b/.test(c)) tips.push(isKZ ? "Функция атауы бас әріппен жазылады: <code>fmt.Println</code>." : "Имя функции пишется с большой буквы: <code>fmt.Println</code>.");
  if (/\bFmt\./.test(c)) tips.push(isKZ ? "Пакет аты кіші әріппен жазылады: <code>fmt</code>." : "Пакет называется <code>fmt</code> - с маленькой буквы.");
  if (/(^|[^.\w])(Println|Printf)\(/m.test(c)) tips.push(isKZ ? "<code>Println</code> алдында <code>fmt.</code> деп жазу керек — <code>fmt.Println(...)</code> шығуы тиіс." : "Перед <code>Println</code> нужно писать <code>fmt.</code> - получится <code>fmt.Println(...)</code>.");
  if (/^\s*(Package|Import|Func|Var|Const|For|If|Else|Return)\b/m.test(c)) tips.push(isKZ ? "Go кілт сөздері кіші әріппен жазылады: <code>package</code>, <code>import</code>, <code>func</code>, <code>if</code>, <code>for</code>." : "Ключевые слова Go пишутся с маленькой буквы: <code>package</code>, <code>import</code>, <code>func</code>, <code>if</code>, <code>for</code>.");
  if (/\bif\b[^{\n]*[^=!<>:]=[^=][^{\n]*\{/.test(c)) tips.push(isKZ ? "Шартта салыстыру екі белгімен жазылады: <code>==</code>. Бір <code>=</code> белгісі — бұл мән беру." : "В условии сравнение пишется двумя знаками: <code>==</code>. Одно <code>=</code> - это присваивание.");
  if (/\bfor\b[^{\n;]*:=[^;{\n]*,[^;{\n]*\{/.test(c) && !/\brange\b/.test(c)) tips.push(isKZ ? "<code>for</code> циклында бөліктер үтірмен емес, нүктелі үтірмен <code>;</code> бөлінеді." : "В <code>for</code> части разделяются точкой с запятой <code>;</code>, а не запятой.");
  if (/\}\s*\n\s*else\b/.test(c)) tips.push(isKZ ? "<code>else</code> жабылатын жақшамен бір жолда жазылуы керек: <code>} else {</code>." : "<code>else</code> пишется на той же строке, что и закрывающая скобка: <code>} else {</code>.");
  if (/\bfunction\b|\bdef\b|\bprint\s*\(|\bconsole\.log/.test(c)) tips.push(isKZ ? "Бұл Go емес: функциялар <code>func</code> сөзімен жарияланады, ал шығару <code>fmt.Println</code> арқылы орындалады." : "Это не Go: функции объявляются словом <code>func</code>, а вывод делается через <code>fmt.Println</code>.");
  // присваивание переменной, которую ещё не создали
  const declared = new Set();
  for (const m of c.matchAll(/([\w\s,]+?)\s*:=/g)) m[1].split(",").forEach(x => declared.add(x.trim().split(/\s+/).pop()));
  for (const m of c.matchAll(/\b(?:var|const)\s+(\w+)/g)) declared.add(m[1]);
  for (const m of c.matchAll(/\bfunc\s+\w*\s*\(([^)]*)\)/g)) m[1].split(",").forEach(x => declared.add(x.trim().split(/\s+/)[0]));
  const seen = new Set();
  for (const m of c.matchAll(/^[ \t]*([A-Za-z_]\w*)\s*=\s*[^=]/gm))
    if (!declared.has(m[1]) && !seen.has(m[1])) {
      seen.add(m[1]);
      tips.push(isKZ
        ? `<code>${esc(m[1])}</code> айнымалысы әлі жасалмаған. Оны <code>:=</code> арқылы жасаңыз (мысалы, <code>${esc(m[1])} := ...</code>), ал жалғыз <code>=</code> тек бұрыннан бар айнымалының мәнін өзгертеді.`
        : `Переменная <code>${esc(m[1])}</code> ещё не создана. Создавайте через <code>:=</code> (например, <code>${esc(m[1])} := ...</code>), а одиночное <code>=</code> только меняет существующую.`);
    }
  return tips;
}

// сравнение с образцом слева: какие строки отличаются и чего не хватает
function analyze(src, k) {
  const norm = s => s.replace(/\/\/.*$/, "").replace(/\s+/g, "");
  const sol = new Set((k.lines || []).map(l => l[0].replace(/\s+/g, "")).filter(Boolean));
  const bad = [], have = new Set();
  src.split("\n").forEach((l, i) => { const n = norm(l); if (!n) return; have.add(n); if (!sol.has(n)) bad.push(i); });
  const missing = (k.lines || []).filter(([c], i) => c.trim() && !isSkeleton(c, i, k) && !isCloser(c) && !have.has(c.replace(/\s+/g, ""))).map(l => l[0].trim());
  return { bad, missing, tips: diagnose(src) };
}

// подсказки трёх уровней: намёк -> шаги -> первая строка
function hintLevels(k) {
  const isKZ = (window.getLang && window.getLang()) === "kz";
  const core = (k.lines || []).map(([c, e], i) => ({ c, e, i })).filter(x => x.c.trim() && !isSkeleton(x.c, x.i, k) && !isCloser(x.c));
  const hints = [esc(k.hint || "")];

  if (k.plan && k.plan.length) {
    hints.push((isKZ ? "Шешу жоспары (қадам бойынша): " : "План решения по шагам: ") + k.plan.map((p, i) => `${i + 1}) ${esc(p)}`).join(" "));
  } else if (core.length) {
    hints.push((isKZ ? "Не істеу керек (қадам бойынша): " : "Что нужно сделать по шагам: ") + core.map((x, n) => `${n + 1}) ${esc(x.e)}`).join(" "));
  } else {
    hints.push(isKZ ? "Тапсырма шартын және шешу жоспарын мұқият оқып шығыңыз." : "Внимательно изучите условие задачи и план решения.");
  }

  if (core.length > 0) {
    hints.push((isKZ ? `Жауапқа жақын — бірінші қажетті жол: <code>${esc(core[0].c.trim())}</code>` : `Почти ответ - первая нужная строка: <code>${esc(core[0].c.trim())}</code>`) + (core.length > 1 ? (isKZ ? ". Қалған жолдар — жоғарыдағы кестеде." : ". Остальные строки - в таблице выше.") : "."));
  } else if (k.solution) {
    const lines = k.solution.split("\n");
    const first = lines.find(l => {
      const s = l.trim();
      return s && !s.startsWith("package ") && !s.startsWith("import") && !s.startsWith("func main") && !s.startsWith("/*") && !s.startsWith("//") && s !== "}" && s !== "})";
    });
    if (first) {
      hints.push(isKZ ? `Жауапқа жақын — шешімдегі жол: <code>${esc(first.trim())}</code>` : `Почти ответ - строка из решения: <code>${esc(first.trim())}</code>`);
    } else {
      hints.push(isKZ ? "Жауапқа жақын: функция қолтаңбасындағы деректер типтерін салыстырып, дұрыс нәтиже қайтарыңыз." : "Почти ответ: сопоставьте типы данных в сигнатуре функции и верните правильный результат.");
    }
  } else {
    hints.push(isKZ ? "Жауапқа жақын: тапсырма жоспарындағы қадамдарды орындаңыз." : "Почти ответ: следуйте шагам из плана задачи.");
  }

  return hints;
}

// ---------- chrome ----------
function chrome(crumbHtml) {
  const u = getUser();
  $("#crumb").innerHTML = crumbHtml || "";
  $("#user").hidden = $("#logout").hidden = $("#xp").hidden = !u;

  const lang = (window.getLang && window.getLang()) || "ru";
  const btnRu = $("#langRu"), btnKz = $("#langKz");
  if (btnRu && btnKz) {
    if (lang === "ru") {
      btnRu.style.background = "var(--accent)";
      btnRu.style.color = "#fff";
      btnKz.style.background = "transparent";
      btnKz.style.color = "var(--muted)";
    } else {
      btnKz.style.background = "var(--accent)";
      btnKz.style.color = "#fff";
      btnRu.style.background = "transparent";
      btnRu.style.color = "var(--muted)";
    }
    btnRu.onclick = () => { if (window.setLang) window.setLang("ru"); };
    btnKz.onclick = () => { if (window.setLang) window.setLang("kz"); };
  }
  const lt = $("#langToggle");
  if (lt) {
    lt.textContent = lang === "ru" ? "KZ" : "RU";
    lt.onclick = () => { if (window.toggleLang) window.toggleLang(); };
  }
  const nArena = $("#navArena"), nSetup = $("#navSetup");
  if (nArena) nArena.textContent = lang === "kz" ? "Арена" : "Арена";
  if (nSetup) nSetup.textContent = lang === "kz" ? "Баптау" : "Настройка";
  if ($("#logout")) $("#logout").textContent = lang === "kz" ? "шығу" : "выйти";

  if (u) {
    const isCloud = isSupabaseReady() && !!store.get("sb_session", false);
    $("#user").textContent = "@" + u + (isCloud ? " ☁️" : "");
    $("#xp").textContent = xpOf(u) + " XP";
  }
}
$("#logout").onclick = async () => {
  await sbSignOut();
  store.set("sb_session", false);
  store.set("user", null);
  location.hash = "#/login";
};

// ---------- views ----------
function viewLogin() {
  const isKZ = (window.getLang && window.getLang()) === "kz";
  chrome(isKZ ? "кіру" : "вход");
  app.innerHTML = `
    <div class="login">
      <div class="robot">01</div>
      <h1>Go Piscine</h1>
      <p class="login-sub">${isKZ ? "Go тілінің негіздері мен 01 Edu бассейніне арналған оқу платформасы" : "Учебная платформа по основам Go и бассейну 01 Edu"}</p>
      
      <div class="auth-card">
        <div class="auth-tabs-nav">
          <button class="at-tab on" id="tabIn">${isKZ ? "Кіру" : "Вход"}</button>
          <button class="at-tab" id="tabUp">${isKZ ? "Тіркелу" : "Регистрация"}</button>
          <button class="at-tab" id="tabGuest">${isKZ ? "Қонақ" : "Гость"}</button>
        </div>

        <!-- 1. Вход -->
        <form id="fLogin" class="auth-pane">
          <label for="inEmail">${isKZ ? "Email немесе логин" : "Email или логин"}</label>
          <input id="inEmail" type="text" placeholder="${isKZ ? "мысалы, omar@gmail.com" : "например, omar@gmail.com"}" required autocomplete="username">
          
          <label for="inPass">${isKZ ? "Құпиясөз" : "Пароль"}</label>
          <input id="inPass" type="password" placeholder="••••••••" required autocomplete="current-password">

          <div class="auth-err" id="inErr"></div>

          <button class="btn auth-btn" type="submit" id="btnIn">${isKZ ? "Кіру" : "Войти"}</button>
          
          <div class="auth-footer-note">
            <span>${isKZ ? "Аккаунтыңыз жоқ па?" : "Нет аккаунта?"} <a href="#" id="toReg">${isKZ ? "Тіркелу" : "Зарегистрироваться"}</a></span>
          </div>
        </form>

        <!-- 2. Регистрация -->
        <form id="fReg" class="auth-pane" style="display:none">
          <label for="regUsername">${isKZ ? "Лидербордқа арналған никнейм" : "Никнейм для лидерборда"}</label>
          <input id="regUsername" type="text" placeholder="${isKZ ? "мысалы, Omar" : "например, Omar"}" maxlength="20" required autocomplete="nickname">

          <label for="regEmail">Email</label>
          <input id="regEmail" type="text" placeholder="student@gmail.com" required autocomplete="email">

          <label for="regPass">${isKZ ? "Құпиясөз (кемінде 6 таңба)" : "Пароль (от 6 символов)"}</label>
          <input id="regPass" type="password" placeholder="••••••••" required minlength="6" autocomplete="new-password">

          <div class="auth-err" id="regErr"></div>

          <button class="btn auth-btn" type="submit" id="btnReg">${isKZ ? "Аккаунт жасау" : "Создать аккаунт"}</button>

          <div class="auth-footer-note">
            <span>${isKZ ? "Аккаунтыңыз бар ма?" : "Уже есть аккаунт?"} <a href="#" id="toLog">${isKZ ? "Кіру" : "Войти"}</a></span>
          </div>
        </form>

        <!-- 3. Гостевой вход -->
        <form id="fGuest" class="auth-pane" style="display:none">
          <label for="gName">${isKZ ? "Есіміңіз немесе никнейм" : "Имя или никнейм"}</label>
          <input id="gName" type="text" placeholder="${isKZ ? "мысалы, Gopher" : "например, Gopher"}" maxlength="20" required autocomplete="off">

          <button class="btn auth-btn" type="submit">${isKZ ? "Жергілікті жалғастыру" : "Войти локально"}</button>

          <div class="auth-footer-note">
            <span>${isKZ ? "Құпиясөзсіз. Прогресс тек осы құрылғыда сақталады." : "Без пароля. Прогресс сохранится только в этом браузере."}</span>
          </div>
        </form>
      </div>
    </div>`;

  const fLogin = $("#fLogin"), fReg = $("#fReg"), fGuest = $("#fGuest");
  const tabIn = $("#tabIn"), tabUp = $("#tabUp"), tabGuest = $("#tabGuest");
  const inErr = $("#inErr"), regErr = $("#regErr");
  const btnIn = $("#btnIn"), btnReg = $("#btnReg");

  const setTab = tab => {
    tabIn.classList.toggle("on", tab === "in");
    tabUp.classList.toggle("on", tab === "up");
    tabGuest.classList.toggle("on", tab === "guest");

    fLogin.style.display = tab === "in" ? "block" : "none";
    fReg.style.display = tab === "up" ? "block" : "none";
    fGuest.style.display = tab === "guest" ? "block" : "none";

    inErr.textContent = "";
    regErr.textContent = "";

    if (tab === "in") $("#inEmail").focus();
    else if (tab === "up") $("#regUsername").focus();
    else if (tab === "guest") $("#gName").focus();
  };

  tabIn.onclick = () => setTab("in");
  tabUp.onclick = () => setTab("up");
  tabGuest.onclick = () => setTab("guest");

  const toReg = $("#toReg"); if (toReg) toReg.onclick = e => { e.preventDefault(); setTab("up"); };
  const toLog = $("#toLog"); if (toLog) toLog.onclick = e => { e.preventDefault(); setTab("in"); };

  // Обработка входа
  fLogin.onsubmit = async e => {
    e.preventDefault();
    inErr.textContent = "";
    btnIn.disabled = true;
    btnIn.textContent = "Вход...";

    const email = $("#inEmail").value.trim();
    const pass = $("#inPass").value;

    const res = await sbSignIn(email, pass);
    if (res.error) {
      let msg = res.error.message || "Неверный логин или пароль";
      if (msg.includes("Email not confirmed")) {
        msg = "Email ещё не подтверждён. Подтвердите его по ссылке из письма (или отключите Confirm Email в панели Supabase Auth).";
      }
      inErr.textContent = msg;
      btnIn.disabled = false;
      btnIn.textContent = "Войти";
      return;
    }

    const username = res.username || email.split("@")[0];
    store.set("user", username);
    store.set("is_guest", false);
    store.set("sb_session", true);
    location.hash = "#/";
  };

  // Обработка регистрации
  fReg.onsubmit = async e => {
    e.preventDefault();
    regErr.textContent = "";
    regErr.classList.remove("ok");
    btnReg.disabled = true;

    const username = ($("#regUsername").value || "").trim().replace(/[^\p{L}\p{N}_. -]/gu, "");
    if (!username) {
      regErr.textContent = "Укажите корректный никнейм.";
      btnReg.disabled = false;
      return $("#regUsername").focus();
    }

    btnReg.textContent = "Создание аккаунта...";
    const email = $("#regEmail").value.trim();
    const pass = $("#regPass").value;

    const res = await sbSignUp(email, pass, username);
    if (res.error) {
      regErr.textContent = res.error.message || "Ошибка регистрации";
      btnReg.disabled = false;
      btnReg.textContent = "Создать аккаунт";
      return;
    }

    if (res.data?.session) {
      store.set("user", username);
      store.set("is_guest", false);
      store.set("sb_session", true);
      location.hash = "#/";
    } else {
      regErr.classList.add("ok");
      regErr.innerHTML = `Аккаунт создан! ${res.data?.user?.confirmation_sent_at ? "Подтвердите email или перейдите ко входу." : "Теперь перейдите ко входу."}`;
      btnReg.disabled = false;
      btnReg.textContent = "Создать аккаунт";
    }
  };

  // Обработка гостя
  fGuest.onsubmit = e => {
    e.preventDefault();
    const name = $("#gName").value.trim().replace(/[^\p{L}\p{N}_. -]/gu, "").replace(/\s+/g, " ");
    if (!name) return $("#gName").focus();
    store.set("user", name);
    store.set("is_guest", true);
    store.set("sb_session", false);
    if (window.sbLogGuest) {
      window.sbLogGuest(name);
    }
    location.hash = "#/";
  };
}

function viewDashboard(u) {
  const lang = (window.getLang && window.getLang()) || "ru";
  const isKZ = lang === "kz";
  chrome(`<span>${isKZ ? "басты бет" : "главная"}</span>`);
  const done = getDone(u);
  const tasks = allTasks();
  const nDone = tasks.filter(t => done[t.id]).length;
  const pct = Math.round(nDone / tasks.length * 100);
  const isGuestUser = store.get("is_guest", false) || (u && (u.startsWith("[Гость]") || u.startsWith("[Guest]") || u.toLowerCase().startsWith("guest_")));
  const board = isGuestUser
    ? [...DEMO_USERS].sort((a, b) => b[1] - a[1])
    : [...DEMO_USERS.filter(([n]) => n !== u), [u, xpOf(u)]].sort((a, b) => b[1] - a[1]);
  const next = nextStep(done);
  const unlocked = isUnlocked();

  const tracks = [
    { id: "base", title: isKZ ? "💡 Go негіздері (0–13 тақырыптар)" : "💡 Основы Go (Темы 0–13)", topics: TOPICS.filter(t => t.id >= 0 && t.id <= 13) },
    { id: "piscine", title: isKZ ? "🏊 01 Edu Piscine (Алгоритмдер, Quad, Нұсқағыштар, Рекурсия)" : "🏊 01 Edu Piscine (Алгоритмы, Quad, Указатели, Рекурсия)", topics: TOPICS.filter(t => t.track === "piscine" || (t.id >= 14 && t.id <= 29)) },
    { id: "backend", title: isKZ ? "🚀 Backend, Желі және Деректер қоры (30–34 тақырыптар)" : "🚀 Backend, Сеть и Базы данных (Темы 30–34)", topics: TOPICS.filter(t => t.track === "backend" || (t.id >= 30 && t.id <= 34)) },
  ];

  const renderTopicCard = t => {
    const locT = window.getLocalizedTopicFull ? window.getLocalizedTopicFull(t) : t;
    const lock = topicLock(t, done), complete = topicComplete(t, done);
    const hasSim = !!t.widgetTitle || t.track === "piscine" || (window.hasTopicWidget && window.hasTopicWidget(t.id)) || (window.hasPedagogy && window.hasPedagogy(t.id));
    const vizBadge = hasSim ? `<span class="badge" style="background:rgba(153,105,255,.15);border:1px solid var(--accent);color:var(--accent-l);font-size:10px;margin-left:6px;vertical-align:middle">${isKZ ? "🎮 Жаттықтырғыш" : "🎮 Тренажёр"}</span>` : "";
    return `
      <a class="topic ${complete ? "complete" : ""} ${lock ? "locked" : ""}" href="#/topic/${t.id}">
        <span class="n">${t.id === 0 ? (isKZ ? "кіріспе" : "введение") : String(t.id).padStart(2, "0")}${complete ? (isKZ ? " · өтті" : " · пройдена") : ""}${lock ? (isKZ ? " · 🔒 жабық" : " · 🔒 закрыта") : ""}${vizBadge}</span>
        <h2>${esc(locT.title)}</h2>
        <div class="rows">${t.quiz ? `<span><span class="dot ${done["q" + t.id] ? "done" : ""}"></span>${isKZ ? "Шағын-тест" : "Мини-тест"}</span>` : ""}${locT.tasks.map(k =>
          `<span><span class="dot ${done[k.id] ? "done" : ""}"></span>${k.exam ? "🔴 " : k.hard ? "🟡 " : "🟢 "}${esc(k.title)}</span>`).join("")}</div>
      </a>`;
  };

  app.innerHTML = `
    <div class="wrap">
      <div class="dash-head">
        <div>
          <h1>${isKZ ? "Қош келдіңіз" : "Добро пожаловать"}, ${esc(u)}!</h1>
          <p class="sub">${TOPICS.length} ${isKZ ? "тақырып" : "тем"} · ${tasks.length} ${isKZ ? "тапсырма" : "задач"} · ${isKZ ? "орындалғаны" : "выполнено"} ${nDone} (${pct}%)</p>
        </div>
        <div class="unlock-bar">
          ${unlocked
            ? `<span>${isKZ ? "🔓 Барлық тақырыптар ашық" : "🔓 Все темы открыты"}</span><button class="btn ghost small" id="relockBtn">${isKZ ? "Құлыптарды қосу" : "Включить замки обратно"}</button>`
            : `<button class="btn ghost small" id="unlockBtn">${isKZ ? "Барлық тақырыптарды ашу" : "Разблокировать все темы"}</button>
               <form id="promoForm" style="display:none" class="promo-inline">
                 <input id="promoInput" placeholder="${isKZ ? "Промокодты енгізіңіз" : "Введите промокод"}" autocomplete="off">
                 <button class="btn small" type="submit">ОК</button>
                 <button class="btn ghost small" type="button" id="cancelPromo">✕</button>
               </form>`}
        </div>
      </div>
      <div class="progress"><i style="width:${pct}%"></i></div>

      <!-- Quick Nav Banner for Setup & Arena -->
      <div style="display:flex;gap:14px;margin:20px 0;flex-wrap:wrap">
        <a href="#/setup" style="flex:1;min-width:260px;background:#141318;border:1px solid var(--line);border-radius:6px;padding:14px 18px;text-decoration:none;display:flex;align-items:center;gap:14px;transition:border-color .15s">
          <span style="font-size:26px">💻</span>
          <div>
            <b style="color:#fff;font-size:14px;display:block">${isKZ ? "Ортаны баптау (Windows, Mac, Linux)" : "Настройка окружения (Windows, Mac, Linux)"}</b>
            <span style="color:var(--dim);font-size:12.5px">${isKZ ? "Git, Golang және VS Code орнату нұсқаулығы" : "Инструкции по установке Git, Go 1.23+ и плагинов VS Code"}</span>
          </div>
        </a>
        <a href="#/arena" style="flex:1;min-width:260px;background:#141318;border:1px solid var(--accent);border-radius:6px;padding:14px 18px;text-decoration:none;display:flex;align-items:center;gap:14px;transition:border-color .15s">
          <span style="font-size:26px">⚡</span>
          <div>
            <b style="color:var(--accent-l);font-size:14px;display:block">${isKZ ? "Тапсырмалар аренасы (+XP)" : "Тренажёр задач Арена (+XP)"}</b>
            <span style="color:var(--dim);font-size:12.5px">${isKZ ? "Piscine, LeetCode, Backend және AI тапсырмалары" : "Задачи Piscine, LeetCode, Backend и AI Engineering"}</span>
          </div>
        </a>
      </div>

      <!-- Советы ментора 01 Edu (Computer Science менталдық моделі) -->
      <div style="background:linear-gradient(135deg, rgba(153,105,255,0.08) 0%, rgba(20,19,24,0.95) 100%);border:1px solid rgba(153,105,255,0.3);border-radius:8px;padding:18px 22px;margin:20px 0">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:14px">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:24px">🧠</span>
            <div>
              <b style="font-size:15px;color:#fff">${isKZ ? "01 Edu менторының кеңестері: Бағдарламашыша ойлау және тиімді оқу әдісі" : "Советы ментора 01 Edu: Как мыслить и учиться как программист"}</b>
              <div style="font-size:12px;color:var(--dim)">${isKZ ? "Компьютерлік ғылымдарды (CS) нөлден бастап меңгеруге арналған 4 алтын ереже" : "4 золотых правила Computer Science для тех, кто учится с нуля и готовится к бассейну"}</div>
            </div>
          </div>
          <span class="badge" style="background:rgba(153,105,255,0.2);color:var(--accent-l);font-size:11px;padding:4px 8px;border-radius:4px">${isKZ ? "💡 Бассейннен құламау құпиясы" : "💡 Секрет выживания в Piscine"}</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:12px">
          <div style="background:rgba(0,0,0,0.3);border:1px solid var(--line);border-radius:6px;padding:12px 14px">
            <div style="color:var(--accent-l);font-weight:700;font-size:13px;margin-bottom:4px">📝 1. ${isKZ ? "Таза парақ ережесі" : "Правило чистого листа"}</div>
            <div style="font-size:12.5px;color:var(--muted);line-height:1.45">${isKZ ? "Кодты бірден жазуға асықпаңыз! Қағаз бен қалам алып, есепті қарапайым сандармен (1, 2, 3) қолмен орындап, сызбасын сызыңыз." : "Никогда не начинайте писать код сразу. Возьмите ручку и бумагу, прокрутите задачу на простых числах и нарисуйте алгоритм вручную."}</div>
          </div>
          <div style="background:rgba(0,0,0,0.3);border:1px solid var(--line);border-radius:6px;padding:12px 14px">
            <div style="color:#f59e0b;font-weight:700;font-size:13px;margin-bottom:4px">❓ 2. ${isKZ ? "3 сұрақ фреймворкі" : "Фреймворк 3 вопросов"}</div>
            <div style="font-size:12.5px;color:var(--muted);line-height:1.45">${isKZ ? "Кез келген есепте 3 нәрсені анықтаңыз: 1) Кірісте не берілді? 2) Шығыста не сұралуда? 3) Әр цикл қадамында қай әрекет қайталанады?" : "В любой задаче задайте 3 вопроса: 1) Что дано на входе? 2) Что требуется вернуть на выходе? 3) Какое повторяющееся действие нужно сделать на каждом шаге?"}</div>
          </div>
          <div style="background:rgba(0,0,0,0.3);border:1px solid var(--line);border-radius:6px;padding:12px 14px">
            <div style="color:var(--ok);font-weight:700;font-size:13px;margin-bottom:4px">🛠️ 3. ${isKZ ? "Компилятор — сенің көмекшің" : "Ошибки компилятора — друзья"}</div>
            <div style="font-size:12.5px;color:var(--muted);line-height:1.45">${isKZ ? "Қызыл қателерден қорықпаңыз. Go компиляторы сізге қатенің нақты жолын және себебін көрсетеді. Қатені баппен оқып, үлгімен салыстырыңыз." : "Красный текст ошибки — это бесплатный совет робота. Компилятор Go указывает точную строку и причину. Читайте текст ошибки вдумчиво."}</div>
          </div>
          <div style="background:rgba(0,0,0,0.3);border:1px solid var(--line);border-radius:6px;padding:12px 14px">
            <div style="color:#60a5fa;font-weight:700;font-size:13px;margin-bottom:4px">🧱 4. ${isKZ ? "Бөліп ал да, билей бер" : "Разделяй и властвуй"}</div>
            <div style="font-size:12.5px;color:var(--muted);line-height:1.45">${isKZ ? "Quad, SplitWhiteSpaces немесе Sudoku сияқты күрделі есептер — бұл жай ғана бір-біріне қосылған 3-4 қарапайым шағын тапсырма." : "Сложная задача бассейна (Quad, SplitWhiteSpaces, Sudoku) — это всего лишь 3–4 простейших шага, склеенных вместе. Решайте по кусочкам."}</div>
          </div>
        </div>
      </div>

      <div class="grid">
        <div>
          ${tracks.map(tr => `
            <div class="track-block">
              <h3 class="sec track-title">${tr.title}</h3>
              <div class="topics">
                ${tr.topics.map(renderTopicCard).join("")}
              </div>
            </div>
          `).join("")}
        </div>
        <aside>
          <div class="side" style="margin-bottom:16px">
            <h3 class="sec">${isKZ ? "КЕЛЕСІ ҚАДАМ" : "Что дальше"}</h3>
            ${next
      ? `<p style="margin:0 0 12px">${tLabel(next.topic)}: ${esc(next.topic.title)}<br><span class="empty">${esc(next.label)}</span></p>
                 <a class="btn" style="display:inline-block;text-decoration:none" href="#/topic/${next.topic.id}">${isKZ ? "Жалғастыру →" : "Продолжить →"}</a>`
      : `<p style="margin:0">${isKZ ? "Барлық тақырыптар өтілді. Тамаша жұмыс!" : "Все темы пройдены. Отличная работа!"}</p>`}
          </div>
          <div class="side">
            <h3 class="sec">${isKZ ? "ЛИДЕРБОРД" : "Лидерборд"}</h3>
            <ol class="lb">
              ${board.map(([n, x], i) => `<li class="${n === u ? "me" : ""}"><span>${i + 1}. ${esc(n)}</span><span>${x} XP</span></li>`).join("")}
            </ol>
            <p class="note" id="lbSubNote">${isKZ ? "Тапсырмаларды орындап, алға жылжыңыз." : "Выполняйте задания и продвигайтесь вперёд."}</p>
          </div>
        </aside>
      </div>
    </div>`;

  const ub = $("#unlockBtn"), pf = $("#promoForm"), cancelP = $("#cancelPromo");
  if (ub && pf) {
    ub.onclick = () => {
      ub.style.display = "none";
      pf.style.display = "inline-flex";
      $("#promoInput").focus();
    };
  }
  if (cancelP && pf && ub) {
    cancelP.onclick = () => {
      pf.style.display = "none";
      ub.style.display = "inline-block";
    };
  }
  if (pf) {
    pf.onsubmit = e => {
      e.preventDefault();
      const code = ($("#promoInput").value || "").trim().toUpperCase();
      if (PROMO_CODES.includes(code)) {
        store.set("promoUnlocked", true);
        viewDashboard(u);
      } else {
        alert(isKZ ? "Қате промокод." : "Неверный промокод.");
      }
    };
  }

  const rb = $("#relockBtn");
  if (rb) {
    rb.onclick = () => {
      store.set("promoUnlocked", false);
      viewDashboard(u);
    };
  }

  // Живая синхронизация лидерборда из Supabase (только зарегистрированные студенты в общем рейтинге)
  if (isSupabaseReady()) {
    sbFetchLeaderboard().then(liveBoard => {
      if (liveBoard && liveBoard.length > 0) {
        const isGuestUser = store.get("is_guest", false) || (u && (u.startsWith("[Гость]") || u.startsWith("[Guest]") || u.toLowerCase().startsWith("guest_")));
        const myXp = xpOf(u);

        // В liveBoard попадают ТОЛЬКО зарегистрированные студенты (гости отфильтрованы в sbFetchLeaderboard)
        let fullBoard = [...liveBoard];
        if (!isGuestUser) {
          const existingIdx = fullBoard.findIndex(([n]) => n === u);
          if (existingIdx !== -1) {
            // Если текущий зарегистрированный студент заработал больше XP локально, обновляем его счёт
            if (myXp > fullBoard[existingIdx][1]) fullBoard[existingIdx][1] = myXp;
          } else {
            fullBoard.push([u, myXp]);
          }
        }

        fullBoard.sort((a, b) => b[1] - a[1]);

        const lbEl = $(".lb");
        if (lbEl) {
          lbEl.innerHTML = fullBoard.map(([n, x], i) => {
            const isMe = n === u || n.startsWith(u + " (");
            return `<li class="${isMe ? "me" : ""}"><span>${i + 1}. ${esc(n)}</span><span>${x} XP</span></li>`;
          }).join("");
          const noteEl = $(".lb + .note");
          if (noteEl) noteEl.textContent = isKZ ? "☁️ Ағымның онлайн рейтингі (Supabase)." : "☁️ Живой облачный рейтинг потока (Supabase).";
        }
      }
    });
  }
}

// страница закрытой темы
function viewLocked(u, topic, prev) {
  const isKZ = (window.getLang && window.getLang()) === "kz";
  const locTopic = window.getLocalizedTopicFull ? window.getLocalizedTopicFull(topic) : topic;
  const locPrev = prev ? (window.getLocalizedTopicFull ? window.getLocalizedTopicFull(prev) : prev) : null;
  chrome(`<a href="#/">${isKZ ? "басты бет" : "главная"}</a> / <span>${tLabel(topic).toLowerCase()}</span>`);
  const done = getDone(u);
  const left = [];
  if (prev.quiz && !done["q" + prev.id]) left.push(isKZ ? "шағын-тестті тапсыру" : "пройти мини-тест");
  const todo = prev.tasks.filter(k => !done[k.id]).length;
  if (todo) left.push(isKZ ? `тапсырмаларды шешу: ${todo}` : `решить задач: ${todo}`);
  app.innerHTML = `
    <div class="wrap lockedpage">
      <div class="lockicon">🔒</div>
      <h1>${tLabel(topic)} ${isKZ ? "әзірге жабық" : "пока закрыта"}</h1>
      <p class="sub">${esc(locTopic.title)} ${isKZ ? `алдыңғы ${tLabel(prev).toLowerCase()} («${esc(locPrev ? locPrev.title : "")}») толық өтілген соң ашылады.` : `откроется, когда будет полностью пройдена ${tLabel(prev).toLowerCase()} - ${esc(locPrev ? locPrev.title : "")}.`}</p>
      <p>${isKZ ? "Қалғаны:" : "Осталось:"} ${left.map(esc).join(", ")}.</p>
      <p><a class="btn" style="display:inline-block;text-decoration:none" href="#/topic/${prev.id}">${isKZ ? "Өту: " + tLabel(prev).toLowerCase() + " →" : "Перейти: " + tLabel(prev).toLowerCase() + " →"}</a>
      <a class="btn ghost" style="display:inline-block;text-decoration:none" href="#/">${isKZ ? "Басты бетке" : "На главную"}</a></p>
    </div>`;
}

function viewTopic(u, tid) {
  const rawTopic = TOPICS.find(t => t.id === tid);
  if (!rawTopic) return (location.hash = "#/");
  const done = getDone(u);
  const idx = TOPICS.indexOf(rawTopic), prev = TOPICS[idx - 1], next = TOPICS[idx + 1];
  if (topicLock(rawTopic, done)) return viewLocked(u, rawTopic, prev);
  const isKZ = (window.getLang && window.getLang()) === "kz";
  const topic = window.getLocalizedTopicFull ? window.getLocalizedTopicFull(rawTopic) : rawTopic;
  const crumb = `<a href="#/">${isKZ ? "басты бет" : "главная"}</a> / <a href="#/topic/${topic.id}">${topic.id === 0 ? (isKZ ? "кіріспе" : "введение") : (isKZ ? topic.id + "-тақырып" : "тема " + topic.id)}</a>`;
  chrome(crumb);
  const hasQuiz = !!topic.quiz;
  const stepBase = hasQuiz ? 4 : 3;
  const hasSim = !!topic.widgetTitle || topic.track === "piscine" || (window.hasTopicWidget && window.hasTopicWidget(topic.id)) || (window.hasPedagogy && window.hasPedagogy(topic.id));
  const PISCINE_SIM_TITLES_KZ = {
    14: "Quad генераторы мен 2D-символдардың интерактивті симуляторы",
    15: "Интерактивті жедел жад (RAM) және нұсқағыштарды баптау",
    16: "Символдар, байттар, жолдар және ASCII-дің интерактивті рентгені",
    17: "Шақыру стегінің (Call Stack) интерактивті симуляторы: факториал",
    18: "Интерактивті математика: бөлгіштерді тексеру және жай сандарды іздеу",
    19: "8x8 шахмат тақтасы және Backtracking интерактивті симуляторы",
    20: "ASCII символдары мен жолдардың интерактивті сканері",
    21: "CLI параметрлерінің интерактивті симуляторы (os.Args)",
    22: "Тілімдердің жадын үнемдеу симуляторы: make vs append & Split",
    23: "Виртуалды файлдық жүйе және DisplayFile симуляторы",
    24: "Функциялар конвейерінің интерактивті симуляторы (DoOp)",
    25: "Емтихан симуляторы және сұрыптау сараптамасы",
    26: "PrintComb кодовый құлып жаттықтырғышы",
    27: "Байланысқан тізім поезының интерактивті симуляторы (Linked List)",
    28: "Екілік іздеу ағашының интерактивті симуляторы (BST)",
    29: "Судоку шешушісі және кері шегіну интерактивті симуляторы"
  };
  const simTitle = (isKZ && PISCINE_SIM_TITLES_KZ[topic.id])
    ? PISCINE_SIM_TITLES_KZ[topic.id]
    : ((window.getWidgetTitle && window.getWidgetTitle(topic.id))
      || topic.widgetTitle
      || (window.hasPedagogy && window.hasPedagogy(topic.id) ? (isKZ ? "Белсенді оқыту зертханасы: Құрастырушы & Bug Hunter" : "Лаборатория активного обучения: Конструктор & Bug Hunter") : (isKZ ? "Интерактивті жаттықтырғыш" : "Интерактивный тренажёр")));

  const quizBlock = () => !hasQuiz ? "" : `
    <section class="sec-block quiz" id="s-quiz">
      <div class="kicker">${isKZ ? "3-қадам · Шағын-тест" : "Шаг 3 · Мини-тест"}</div>
      <h2>${isKZ ? "Өзіңізді тексеріңіз" : "Проверьте себя"}</h2>
      <p>${isKZ ? `Дұрыс жауапты таңдаңыз. Бұл емтихан емес, білімді бекіту тәсілі (+${XP_QUIZ} XP).` : `Выберите правильный ответ. Это не экзамен, а способ закрепить материал (+${XP_QUIZ} XP).`}</p>
      ${topic.quiz.map((q, qi) => `
        <div class="qq" data-qi="${qi}">
          <div class="qtext">${qi + 1}. ${inline(q.q)}</div>
          <div class="opts">${q.o.map((t, oi) => ({ t, ok: oi === 0 })).sort(() => Math.random() - .5)
      .map(o => `<button class="opt" data-ok="${o.ok ? 1 : 0}">${inline(o.t)}</button>`).join("")}</div>
          <div class="why"></div>
        </div>`).join("")}
      <div class="quiz-done" id="qdone"></div>
    </section>`;

  const lockBox = why => `<div class="lockbox"><span>🔒</span><div><b>${isKZ ? "Тапсырма әзірге жабық" : "Задача пока закрыта"}</b>${esc(why)}</div></div>`;
  const taskBody = k => k.hard ? `
      ${render(k.desc)}
      <div class="note-box">${isKZ ? `Бұл күрделірек тапсырма: мұнда дайын жолдар жоқ. Бағдарлама қаңқасы (package, import, func main) оң жақтағы редакторда дайын тұр. Жоспар бойынша орындаңыз, қиналсаңыз көмектерді ашыңыз. Шешім үшін — ${XP_HARD} XP.` : `Это задача посложнее: готовых строк здесь нет. Каркас (package, import, func main) уже введён в редактор справа. Идите по плану и открывайте подсказки, если застрянете. За решение - ${XP_HARD} XP.`}</div>
      <div class="plan"><b>${isKZ ? "Жоспар" : "План"}</b><ol class="steps">${(k.plan || []).map(p => `<li>${inline(p)}</li>`).join("")}</ol></div>
      <div class="expect"><b>${isKZ ? "Күтілетін нәтиже" : "Ожидаемый вывод"}</b><pre>${esc(k.output)}</pre></div>
      <div class="hintbox" data-hint="${k.id}"></div>
      <button class="btn ghost open" data-open="${k.id}">${isKZ ? "Редакторда ашу →" : "Открыть в редакторе →"}</button>` : `
      ${render(k.desc)}
      <div class="note-box">${isKZ ? "Кодтың бір бөлігі оң жақтағы редакторға енгізілген — бағдарлама толық болуы үшін оны толықтыру жеткілікті." : "Часть кода уже введена в редактор справа - остаётся лишь дополнить его, чтобы программа стала полной."}</div>
      <ol class="steps">
        <li>${isKZ ? "Төмендегі кодты үстінен астына қарай оқыңыз — әр жолдың оң жағында түсіндірмесі бар." : "Читайте код ниже сверху вниз - у каждой строки справа есть пояснение."}</li>
        <li>${isKZ ? "Жетіспейтін жолдарды оң жақтағы редакторға жазыңыз немесе төмендегі жолды басыңыз — ол өзі қойылады. Шегініс — <kbd>Tab</kbd> пернесі." : "Печатайте недостающие строки в редакторе справа или просто кликните по строке ниже - она вставится сама. Отступ - клавиша <kbd>Tab</kbd>."}</li>
        <li>${isKZ ? "«Тексеру» түймесін басыңыз (немесе <kbd>Ctrl</kbd>+<kbd>Enter</kbd>)." : "Нажмите «Проверить» (или <kbd>Ctrl</kbd>+<kbd>Enter</kbd>)."}</li>
      </ol>
      <div class="annot">
        ${k.lines.map(([c, e], i) => c === "" ? `<div class="gap"></div>` :
    `<div class="ln${isSkeleton(c, i, k) ? "" : " click"}" data-k="${k.id}" data-i="${i}"><pre><code>${hl(c)}</code></pre><span>${esc(e)}</span></div>`).join("")}
      </div>
      <div class="expect"><b>${isKZ ? "Күтілетін нәтиже" : "Ожидаемый вывод"}</b><pre>${esc(k.output)}</pre></div>
      <div class="hintbox" data-hint="${k.id}"></div>
      <button class="btn ghost open" data-open="${k.id}">${isKZ ? "Редакторда ашу →" : "Открыть в редакторе →"}</button>`;
  const taskBlock = (k, i) => {
    const why = taskLock(rawTopic, k, done);
    const diffBadge = k.exam ? `<span class="badge diff-exam">${isKZ ? "🔴 Piscine Емтиханы" : "🔴 Piscine Exam"}</span>`
      : k.hard ? `<span class="badge diff-med">${isKZ ? "🟡 Тәжірибе" : "🟡 Практика"}</span>`
      : `<span class="badge diff-easy">${isKZ ? "🟢 Оқыту" : "🟢 Обучение"}</span>`;
    const kickerStep = isKZ ? `${i + stepBase}-қадам` : `Шаг ${i + stepBase}`;
    const kickerType = k.hard ? (k.exam ? (isKZ ? "★ 01 Edu Емтиханы" : "★ Экзамен 01 Edu") : (isKZ ? "★ Күрделірек" : "★ Посложнее")) : (isKZ ? "Тәжірибе" : "Практика");
    return `
    <section class="sec-block${why ? " locked" : ""}${k.hard ? " hard" : ""}" id="s-t${i}" data-k="${k.id}">
      <div class="kicker">${kickerStep} · ${kickerType} · ${diffBadge}</div>
      <h2>${isKZ ? `${i + 1}-тапсырма` : `Задача ${i + 1}`}: ${esc(k.title)} <span class="badge" data-badge="${k.id}"></span></h2>
      <div class="tbody" data-state="${why ? "locked" : "open"}">${why ? lockBox(why) : taskBody(k)}</div>
    </section>`;
  };

  app.innerHTML = `
    <div class="learn" data-pane="left">
      <section class="left">
        <nav class="chips" id="chips">
          <button data-s="s-theory">${isKZ ? "Дәріс" : "Лекция"}</button>
          <button data-s="s-examples">${isKZ ? "Мысалдар" : "Примеры"}</button>
          ${hasSim ? `<button data-s="s-interactive">${isKZ ? "🎮 Жаттықтырғыш" : "🎮 Симулятор"}</button>` : ""}
          ${hasQuiz ? `<button data-s="s-quiz">${isKZ ? "Тест" : "Тест"}</button>` : ""}
          ${topic.tasks.map((k, i) => `<button data-s="s-t${i}">${isKZ ? (i + 1) + "-тапсырма" : "Задача " + (i + 1)}</button>`).join("")}
        </nav>
        <div class="scroll" id="scroll">
          <header class="hero">
            <div class="kicker">${topic.id === 0 ? (isKZ ? "Кіріспе" : "Введение") : (isKZ ? `${TOPICS.length - 1} тақырыптың ${topic.id}-тақырыбы` : `Тема ${topic.id} из ${TOPICS.length - 1}`)}</div>
            <h1>${esc(topic.title)}</h1>
            <p class="lead">${isKZ ? "Бұл тақырыпта: " : "В этой теме: "}${esc(topic.about)}.</p>
          </header>
          <section class="sec-block" id="s-theory"><div class="kicker">${isKZ ? "1-қадам · Дәріс" : "Шаг 1 · Лекция"}</div><h2>${isKZ ? "Білу керек жайттар" : "Что нужно знать"}</h2>${render(topic.theory)}</section>
          <section class="sec-block" id="s-examples"><div class="kicker">${isKZ ? "2-қадам · Мысалдар" : "Шаг 2 · Примеры"}</div><h2>${isKZ ? "Код қалай көрінеді" : "Как это выглядит"}</h2>${render(topic.examples)}</section>
          ${hasSim ? `
            <section class="sec-block interactive-sec" id="s-interactive">
              <div class="kicker">${isKZ ? "🎮 Интерактивті симулятор · Тәжірибе" : "🎮 Интерактивный симулятор · Практика"}</div>
              <h2>${esc(simTitle)}</h2>
              <div id="piscineWidgetArea" class="piscine-widget-mount"></div>
            </section>
          ` : ""}
          ${quizBlock()}
          ${topic.tasks.map(taskBlock).join("")}
          <div class="endpad" id="endpad"></div>
        </div>
      </section>
      <section class="right">
        <div class="bar">
          <div class="seg" id="seg">
            ${topic.tasks.map((k, i) => `<button data-k="${k.id}">${isKZ ? (i + 1) + "-тапсырма" : "Задача " + (i + 1)}<i></i></button>`).join("")}
          </div>
          <span class="file">main.go</span>
          <span class="status todo" id="st">${isKZ ? "күтуде" : "waiting"}</span>
        </div>
        <div class="editor">
          <div class="gutter" id="gut"></div>
          <div class="bands"><div class="in" id="bands"></div></div>
          <pre class="hl" aria-hidden="true"><code id="hl"></code></pre>
          <textarea id="code" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea>
        </div>
        <div class="actions">
          <button class="btn" id="run">${isKZ ? "Тексеру" : "Проверить"}</button>
          <button class="btn ghost" id="reset">${isKZ ? "Қалпына келтіру" : "Сбросить"}</button>
          <span class="grow"></span>
          ${prev ? `<a class="btn ghost" href="#/topic/${prev.id}" title="${esc(prev.title)}">← ${tLabel(prev)}</a>` : ""}
          ${next ? `<a class="btn ghost" id="nextTopic" href="#/topic/${next.id}" title="${esc(next.title)}">${tLabel(next)} →</a>` : `<a class="btn ghost" id="nextTopic" href="#/">${isKZ ? "Басты бетке" : "На дашборд"}</a>`}
        </div>
        <div class="console" id="out"></div>
      </section>
      <nav class="mobbar"><button data-p="left" class="on">${isKZ ? "Оқулық" : "Учебник"}</button><button data-p="right">${isKZ ? "Код" : "Код"}</button></nav>
    </div>`;

  try {
    const mountEl = $("#piscineWidgetArea");
    if (mountEl && window.mountActiveLearningLab) {
      let simRenderer = null;
      if (window.getPiscineRenderer && window.getPiscineRenderer(topic.id)) {
        simRenderer = window.getPiscineRenderer(topic.id);
      } else if (window.getTopicWidgetRenderer && window.getTopicWidgetRenderer(topic.id)) {
        simRenderer = window.getTopicWidgetRenderer(topic.id);
      }
      window.mountActiveLearningLab(mountEl, topic.id, u, simRenderer);
    } else {
      if (window.initPiscineWidgets) { try { window.initPiscineWidgets(topic.id); } catch (e) { } }
      if (window.initTopicWidgets) { try { window.initTopicWidgets(topic.id); } catch (e) { } }
    }
  } catch (e) {
    console.error("Widget mount error:", e);
  }

  // --- мобильная версия: переключатель «Учебник / Код»
  const learn = $(".learn");
  const setPane = p => { learn.dataset.pane = p; $$(".mobbar button").forEach(b => b.classList.toggle("on", b.dataset.p === p)); };
  $$(".mobbar button").forEach(b => b.onclick = () => setPane(b.dataset.p));
  const toEditor = () => { if (isMobile()) setPane("right"); };

  // --- левая панель: навигация и scrollspy
  const scroll = $("#scroll");
  $$("#chips button").forEach(b => b.onclick = () => {
    scrollToSec(b.dataset.s);
    if (b.dataset.s && b.dataset.s.startsWith("s-t")) {
      const tIdx = parseInt(b.dataset.s.replace("s-t", ""), 10);
      if (topic.tasks && topic.tasks[tIdx]) open(topic.tasks[tIdx].id, false);
    }
  });
  function scrollToSec(id) {
    const el = $("#" + id);
    if (el) scroll.scrollTo({ top: el.offsetTop - 8, behavior: "smooth" });
  }
  const secIds = ["s-theory", "s-examples", ...(hasSim ? ["s-interactive"] : []), ...(hasQuiz ? ["s-quiz"] : []), ...topic.tasks.map((_, i) => "s-t" + i)];
  const spy = () => {
    let cur = secIds[0];
    secIds.forEach(id => {
      const el = $("#" + id);
      if (el && el.offsetTop - 80 <= scroll.scrollTop) cur = id;
    });
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
          const wasComplete = topicComplete(topic, d);
          d["q" + topic.id] = true; store.set("done:" + u, d); chrome(crumb);
          $("#qdone").textContent = first ? `Тест пройден! +${XP_QUIZ} XP` : "Тест пройден ✓";
          refreshLocks(); refreshBadges();
          if (!wasComplete && topicComplete(topic, d)) setTimeout(() => celebrate(topic), 450);
        }
      } else { b.classList.add("wrong"); b.disabled = true; showWhy(qq, false, "Не совсем. Подумайте ещё и выберите другой вариант."); }
    });
  }

  // --- подсказки трёх уровней
  function renderHints(k) {
    try {
      const box = $(`[data-hint="${k.id}"]`);
      if (!box) return;                                   // задача закрыта - подсказок нет
      const lv = hintLevels(k), n = store.get(`hint:${u}:${k.id}`, 0);
      box.innerHTML = lv.slice(0, n).map((h, i) => `<p class="hl-item"><b>${isKZ ? `${lv.length} ішінен ${i + 1}-көмек` : `Подсказка ${i + 1} из ${lv.length}`}</b>${h}</p>`).join("") +
        (n < lv.length ? `<button class="more" data-more="${k.id}">${n ? (isKZ ? "Тағы көмек" : "Ещё подсказка") : (isKZ ? "Көмек керек пе?" : "Нужна подсказка?")} (${n + 1}/${lv.length})</button>`
          : `<span class="empty">${isKZ ? "Барлық көмектер ашылды. Егер шықпаса — екі сәтсіз тексеруден кейін оң жақта «Жауапты көрсету» пайда болады." : "Все подсказки открыты. Если не получается - после двух неудачных проверок справа появится «Показать ответ»."}</span>`);
    } catch (e) {
      console.error("renderHints error for task", k && k.id, e);
    }
  }
  topic.tasks.forEach(renderHints);
  scroll.addEventListener("click", e => {
    const m = e.target.closest("[data-more]");
    if (m) {
      const k = topic.tasks.find(x => x.id === m.dataset.more);
      if (k) {
        store.set(`hint:${u}:${k.id}`, store.get(`hint:${u}:${k.id}`, 0) + 1);
        renderHints(k);
      }
    }
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

  // открывает или закрывает блоки задач в зависимости от прогресса (мини-тест, предыдущие задачи)
  function refreshLocks() {
    const d = getDone(u);
    topic.tasks.forEach((k, i) => {
      const sec = $("#s-t" + i), body = $(".tbody", sec), why = taskLock(topic, k, d), state = why ? "locked" : "open";
      if (body.dataset.state === state) return;
      body.dataset.state = state; sec.classList.toggle("locked", !!why);
      body.innerHTML = why ? lockBox(why) : taskBody(k);
      renderHints(k);
    });
    applyEditorLock();
  }
  // закрытая задача: редактор только для чтения, «Проверить» выключено
  function applyEditorLock() {
    const why = active && taskLock(rawTopic, active, getDone(u));
    ta.readOnly = !!why; $("#run").disabled = $("#reset").disabled = !!why;
    if (why) { out.innerHTML = `<div class="h">${isKZ ? "Нәтиже" : "Результат"}</div><div class="bad">🔒 ${esc(why)}</div>`; out.dataset.locked = "1"; }
    else if (out.dataset.locked) { out.innerHTML = `<div class="h">${isKZ ? "Нәтиже" : "Результат"}</div><span class="empty">${isKZ ? "«Тексеру» түймесін басыңыз (Ctrl+Enter)" : "Нажмите «Проверить» (Ctrl+Enter)"}</span>`; out.dataset.locked = ""; }
  }

  function refreshBadges() {
    const d = getDone(u);
    topic.tasks.forEach(k => {
      const lk = taskLock(rawTopic, k, d);
      const b = $(`[data-badge="${k.id}"]`); b.textContent = d[k.id] ? (isKZ ? "шешілді" : "решено") : lk ? (isKZ ? "жабық" : "закрыто") : ""; b.className = "badge" + (d[k.id] ? " ok" : lk ? " lock" : "");
      const s = $(`#seg [data-k="${k.id}"] i`); s.textContent = d[k.id] ? "✓" : lk ? "🔒" : (k.hard ? "★" : "");
    });
    const complete = topicComplete(rawTopic, d);
    const blocked = !!next && !complete && !isUnlocked();
    const nt = $("#nextTopic");
    nt.classList.toggle("primary", complete);
    nt.classList.toggle("disabled", blocked);
    nt.title = blocked ? (isKZ ? "Тақырып толық өтілген соң ашылады" : "Откроется, когда тема будет пройдена") : (next ? next.title : "");
    nt.textContent = next ? (blocked ? "🔒 " : "") + tLabel(next) + " →" : (isKZ ? "Басты бетке" : "На дашборд");
    $("#endpad").innerHTML = complete
      ? `<div class="endcard"><b>${tLabel(rawTopic)} ${isKZ ? "аяқталды" : "пройден" + (rawTopic.id === 0 ? "о" : "а")}</b>${next
        ? `<span>${isKZ ? `Келесі: ${tLabel(next).toLowerCase()} — ${esc(next.title)}. Тақырыбы: ${esc(next.about)}.` : `Дальше: ${tLabel(next).toLowerCase()} - ${esc(next.title)}. Узнаем ${esc(next.about)}.`}</span><a class="btn" href="#/topic/${next.id}">${isKZ ? `Өту: ${tLabel(next).toLowerCase()} →` : `Перейти: ${tLabel(next).toLowerCase()} →`}</a>`
        : `<span>${isKZ ? "Бұл соңғы тақырып еді. Курс толық аяқталды!" : "Это была последняя тема. Курс пройден!"}</span><a class="btn" href="#/">${isKZ ? "Басты бетке" : "На дашборд"}</a>`}</div>`
      : `<div class="endcard muted">${next ? (blocked ? (isKZ ? "🔒 Келесі тақырыпты ашу үшін шағын-тестті тапсырып, барлық тапсырмаларды шешіңіз." : "🔒 Чтобы открыть следующую тему, пройдите мини-тест и решите все задачи.") : (isKZ ? `Тақырып әлі аяқталмаған. <a href="#/topic/${next.id}">Келесі тақырып: ${tLabel(next).toLowerCase()} →</a>` : `Тема ещё не завершена. <a href="#/topic/${next.id}">Следующая тема: ${tLabel(next).toLowerCase()} →</a>`)) : (isKZ ? "Курсты аяқтау үшін шағын-тестті тапсырып, барлық тапсырмаларды шешіңіз." : "Пройдите мини-тест и решите все задачи, чтобы завершить курс.")}</div>`;
    if (active) { const ok = !!d[active.id]; $("#st").className = "status " + (ok ? "done" : "todo"); $("#st").textContent = ok ? (isKZ ? "тапсырылды" : "passed") : (isKZ ? "күтуде" : "waiting"); }
  }

  function open(id, scrollLeft = true) {
    active = topic.tasks.find(k => k.id === id);
    if (!active) active = topic.tasks[0];
    if (!active) return;
    $$("#seg button").forEach(b => b.classList.toggle("on", b.dataset.k === active.id));
    ta.value = getCode(u, active.id, active.starter || ""); paint(); setBands([]);
    const at = ta.value.indexOf("Пишите решение здесь");
    if (at >= 0) { const e = ta.value.indexOf("\n", at); ta.setSelectionRange(e, e); }
    out.innerHTML = `<div class="h">${isKZ ? "Нәтиже" : "Результат"}</div><span class="empty">${isKZ ? "«Тексеру» түймесін басыңыз (Ctrl+Enter)" : "Нажмите «Проверить» (Ctrl+Enter)"}</span>`; out.dataset.locked = "";
    refreshBadges(); applyEditorLock();
    if (scrollLeft) scrollToSec("s-t" + topic.tasks.indexOf(active));
    if (!isMobile() && !ta.readOnly) ta.focus();
  }
  $$("#seg button").forEach(b => b.onclick = () => open(b.dataset.k, true));
  $$("[data-open]").forEach(b => b.onclick = () => { open(b.dataset.open, false); toEditor(); });
  $("#reset").onclick = () => {
    if (!active) return;
    ta.value = active.starter || ""; ta.oninput();
    out.innerHTML = `<div class="h">${isKZ ? "Нәтиже" : "Результат"}</div><span class="empty">${isKZ ? "Код бастапқы күйге келтірілді" : "Код сброшен к каркасу"}</span>`;
    if (!isMobile()) ta.focus();
  };

  // клик по строке образца вставляет её в редактор
  function insertLine(k, i) {
    if (!k || !k.lines || !k.lines[i]) return;
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
    if (taskLock(rawTopic, active, getDone(u))) return;
    if (ta.value.trim() === active.starter.trim()) { out.innerHTML = `<div class="h">${isKZ ? "Нәтиже" : "Результат"}</div><div class="bad">${isKZ ? "Сіз әлі ештеңе жазбадыңыз. Сол жақтағы тапсырма кодын func main ішіне жазыңыз." : "Вы ещё ничего не дописали. Напечатайте код из задачи слева внутрь func main."}</div>`; setBands([]); return; }
    const code = ta.value.replace(/\/\/.*$/gm, "");
    const results = active.checks.map(c => ({ ok: c.re.test(code), msg: c.msg }));
    // общее правило для всех задач: скобки и кавычки должны быть парными
    const bare = code.replace(/"(?:[^"\\\n]|\\.)*"/g, '""').replace(/`[^`]*`/g, "``");
    const paired = ["{}", "()", "[]"].every(([o, c]) => bare.split(o).length === bare.split(c).length) && !/"/.test(bare.replace(/""/g, ""));
    results.push({ ok: paired, msg: isKZ ? "Жақшалар { } ( ) [ ] мен тырнақшалар жұп болуы керек: әр ашылғанға жабылатын қажет" : "Скобки { } ( ) [ ] и кавычки должны быть парными: каждой открывающей нужна закрывающая" });
    const pass = results.every(r => r.ok);
    const done = getDone(u), was = !!done[active.id], wasTopic = topicComplete(rawTopic, done);
    let html = `<div class="h">${isKZ ? "Нәтиже" : "Результат"}</div>` + results.map(r =>
      `<div class="row ${r.ok ? "ok" : "bad"}"><span>${r.ok ? "✓" : "✗"}</span><span>${r.ok ? (isKZ ? "тексеруден сәтті өтті" : "проверка пройдена") : esc(r.msg)}</span></div>`).join("");
    let showAnswer = false;
    if (pass) {
      const assisted = !!store.get(`assist:${u}:${active.id}`, false);
      const gain = was ? 0 : xpFor(active, assisted ? "a" : true);
      html += `<div class="ok" style="margin-top:10px">${isKZ ? "Тесттен сәтті өттіңіз." : "Тест пройден."} +${gain} XP${assisted && !was ? (isKZ ? " (жауап ашылған)" : " (ответ был открыт)") : ""}</div><pre>${esc(active.output)}</pre>`;
      if (!was) {
        done[active.id] = assisted ? "a" : true;
        store.set("done:" + u, done);
        sbSyncTask(active.id, gain, assisted);
      }
      setBands([]);
      const other = topic.tasks.find(k => !done[k.id]);
      if (other) html += `<button class="btn" id="go" style="margin-top:12px">${isKZ ? "Келесі тапсырма →" : "Следующая задача →"}</button>`;
    } else {
      const tries = store.get(`tries:${u}:${active.id}`, 0) + 1; store.set(`tries:${u}:${active.id}`, tries);
      const a = analyze(ta.value, active), hard = active.hard;
      setBands(hard ? [] : a.bad);
      const tips = [];
      if (!hard && a.bad.length) tips.push(isKZ ? `Қызыл түспен белгіленген жолдар (${a.bad.map(i => i + 1).join(", ")}) сол жақтағы үлгіден өзгеше.` : `Подсвеченные красным строки (${a.bad.map(i => i + 1).join(", ")}) отличаются от образца слева.`);
      if (!hard && a.missing.length) tips.push((isKZ ? "Жетіспейтін жол: " : "Не хватает строки: ") + a.missing.slice(0, 2).map(m => `<code>${esc(m)}</code>`).join(", ") + ".");
      tips.push(...a.tips);
      html += `<div class="bad" style="margin-top:10px">${hard ? (isKZ ? "Әзірге барлығы сәйкес емес. Сол жақтағы жоспармен салыстырып, көмекті ашыңыз." : "Пока не всё совпало. Сверьтесь с планом слева и откройте подсказку.") : (isKZ ? "Бір жері сәйкес келмеді. Өз кодыңызды сол жақтағы кодпен салыстырып, қайталап көріңіз." : "Что-то не совпало. Сравните свой код с кодом слева и попробуйте ещё раз.")}</div>`;
      if (tips.length) html += `<div class="tips"><b>${isKZ ? "Ықтимал себептер" : "Возможные причины"}</b><ul>${tips.map(t => `<li>${t}</li>`).join("")}</ul></div>`;
      showAnswer = tries >= (hard ? 3 : 2) && !was;
      if (showAnswer) html += `<div class="assist"><button class="btn ghost small" id="showAns">${isKZ ? "Жауапты көрсету" : "Показать ответ"}</button><small>${isKZ ? `Жауап редакторға қойылады, ал берілетін XP ${xpFor(active, "a")} болады.` : `Ответ вставится в редактор, а XP за задачу будет ${xpFor(active, "a")} вместо ${xpFor(active, true)}.`}</small></div>`;
    }
    out.innerHTML = html;
    chrome(crumb); refreshLocks(); refreshBadges();
    const go = $("#go"); if (go) go.onclick = () => open(topic.tasks.find(k => !getDone(u)[k.id]).id);
    const ans = $("#showAns");
    if (ans) ans.onclick = () => {
      store.set(`assist:${u}:${active.id}`, true);
      ta.value = active.solution; ta.oninput();
      out.innerHTML = `<div class="h">${isKZ ? "Нәтиже" : "Результат"}</div><span class="empty">${isKZ ? "Жауап редакторға қойылды. Тапсырманы есептеу үшін «Тексеру» түймесін басыңыз." : "Ответ вставлен в редактор. Нажмите «Проверить», чтобы засчитать задачу."}</span>`;
    };
    if (pass && !wasTopic && topicComplete(rawTopic, done)) setTimeout(() => celebrate(rawTopic), 450);
  }
  $("#run").onclick = check;

  if (topic.tasks && topic.tasks.length > 0) {
    const initTask = topic.tasks.find(k => !done[k.id]) || topic.tasks[0];
    open(initTask.id, false);
  }
  ta.blur();
}

function celebrate(rawTopic) {
  const isKZ = (window.getLang && window.getLang()) === "kz";
  const topic = window.getLocalizedTopicFull ? window.getLocalizedTopicFull(rawTopic) : rawTopic;
  const idx = TOPICS.indexOf(rawTopic), nextRaw = TOPICS[idx + 1];
  const next = nextRaw ? (window.getLocalizedTopicFull ? window.getLocalizedTopicFull(nextRaw) : nextRaw) : null;
  const xp = topicXp(rawTopic, getDone(getUser()));
  const el = document.createElement("div");
  el.className = "overlay";
  el.innerHTML = `
    <div class="modal">
      <div class="trophy">★</div>
      ${next ? `
        <h2>${isKZ ? `Құттықтаймыз! ${tLabel(rawTopic)} аяқталды` : `Поздравляем! ${tLabel(rawTopic)} пройден${rawTopic.id === 0 ? "о" : "а"}`}</h2>
        <p class="m-sub">${esc(topic.title)} — ${isKZ ? "дайын. Сіз" : "готово. Вы заработали"} ${xp} XP ${isKZ ? "жинадыңыз." : "."}</p>
        <div class="next"><span>${isKZ ? "Келесі: " + tLabel(nextRaw).toLowerCase() : "Следующая: " + tLabel(nextRaw).toLowerCase()}</span><b>${esc(next.title)}</b><em>${isKZ ? "Тақырып: " : "Узнаем "}${esc(next.about)}.</em></div>
        <div class="m-actions"><a class="btn" href="#/topic/${next.id}">${isKZ ? "Өту: " + tLabel(nextRaw).toLowerCase() + " →" : "Перейти: " + tLabel(nextRaw).toLowerCase() + " →"}</a><a class="btn ghost" href="#/">${isKZ ? "Басты бетке" : "На дашборд"}</a></div>`
      : `
        <h2>${isKZ ? "Курс толық аяқталды!" : "Курс пройден!"}</h2>
        <p class="m-sub">${isKZ ? "Сіз алғашқы қарапайым бағдарламадан бастап JSON мен деректер қоры бар веб-сервиске дейінгі жолдан өттіңіз. Тамаша жұмыс!" : "Вы прошли путь от первой программы до маленького веб-сервиса с JSON и базами данных. Отличная работа!"}</p>
        <div class="m-actions"><a class="btn" href="#/">${isKZ ? "Басты бетке" : "На дашборд"}</a></div>`}
    </div>`;
  document.body.appendChild(el);
  const close = () => el.remove();
  el.onclick = e => { if (e.target === el || e.target.closest("a")) close(); };
  addEventListener("hashchange", close, { once: true });
}

function viewSetup(u) {
  const isKZ = (window.getLang && window.getLang()) === "kz";
  chrome(`<a href="#/">${isKZ ? "басты бет" : "главная"}</a> / <a href="#/setup">${isKZ ? "ортаны баптау" : "настройка окружения"}</a>`);
  if (window.renderSetupPage) window.renderSetupPage(app, u);
}

function viewArena(u) {
  const isKZ = (window.getLang && window.getLang()) === "kz";
  chrome(`<a href="#/">${isKZ ? "басты бет" : "главная"}</a> / <a href="#/arena">${isKZ ? "тапсырмалар аренасы" : "арена задач"}</a>`);
  if (window.renderArenaPage) window.renderArenaPage(app, u);
}

const ADMIN_PIN = "1465";

function viewAdmin(u) {
  const isKZ = (window.getLang && window.getLang()) === "kz";
  const isAuthed = sessionStorage.getItem("gp_admin_auth") === ADMIN_PIN;

  if (!isAuthed) {
    chrome(`<a href="#/">${isKZ ? "басты бет" : "главная"}</a> / <span>${isKZ ? "әкімші кіруі" : "вход администратора"}</span>`);
    app.innerHTML = `
      <div style="min-height:70vh;display:flex;align-items:center;justify-content:center;padding:20px">
        <div style="max-width:380px;width:100%;background:#141318;border:1px solid rgba(153,105,255,0.3);border-radius:10px;padding:32px 28px;box-shadow:0 12px 36px rgba(0,0,0,0.5);text-align:center">
          <div style="width:54px;height:54px;background:rgba(153,105,255,0.12);border:1px solid var(--accent);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:16px">🔐</div>
          <h2 style="font-size:20px;color:#fff;margin:0 0 8px">${isKZ ? "Әкімшіге қолжетімділік" : "Панель администратора"}</h2>
          <p style="color:var(--dim);font-size:13px;margin:0 0 24px;line-height:1.5">${isKZ ? "Бұл бөлім тек иесіне арналған. Жалғастыру үшін PIN-кодты енгізіңіз." : "Закрытый раздел управления. Введите секретный PIN-код администратора для входа."}</p>
          <form id="adminPinForm">
            <input type="password" id="adminPinInput" maxlength="6" autocomplete="off" autofocus placeholder="••••" style="width:100%;text-align:center;font:700 24px var(--mono);letter-spacing:8px;padding:12px;background:#0d0c10;border:1px solid var(--line);border-radius:6px;color:#fff;margin-bottom:10px;outline:none;transition:border-color .15s">
            <div id="adminPinError" style="color:#ff6b6b;font-size:12.5px;font-weight:600;min-height:20px;margin-bottom:12px"></div>
            <button class="btn" type="submit" style="width:100%;padding:12px;font-size:14px;font-weight:700">${isKZ ? "Кіру" : "Войти"}</button>
          </form>
          <div style="margin-top:18px">
            <a href="#/" class="link" style="font-size:12.5px;color:var(--muted)">← ${isKZ ? "Басты бетке оралу" : "Вернуться на главную"}</a>
          </div>
        </div>
      </div>
    `;

    const form = $("#adminPinForm");
    const input = $("#adminPinInput");
    const err = $("#adminPinError");

    form.onsubmit = (e) => {
      e.preventDefault();
      const val = (input.value || "").trim();
      if (val === ADMIN_PIN) {
        sessionStorage.setItem("gp_admin_auth", ADMIN_PIN);
        viewAdmin(u);
      } else {
        err.textContent = isKZ ? "Қате PIN-код! Қолжетімділік жабық." : "Неверный PIN-код! Доступ запрещён.";
        input.value = "";
        input.focus();
        input.style.borderColor = "#ff6b6b";
        setTimeout(() => { if (input) input.style.borderColor = "var(--line)"; }, 800);
      }
    };
    return;
  }

  // Once authenticated with PIN 1465:
  chrome(`<a href="#/">${isKZ ? "басты бет" : "главная"}</a> / <span>${isKZ ? "әкімші панелі" : "панель администратора"}</span>`);

  const unlocked = isUnlocked();

  app.innerHTML = `
    <div class="wrap" style="max-width:1100px;margin:0 auto;padding:24px 16px">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:20px">
        <div>
          <h1 style="font-size:24px;margin:0 0 6px;color:#fff">🛡️ ${isKZ ? "Әкімші панелі: Студенттер мен қонақтар мониторингі" : "Панель администратора: Мониторинг студентов и гостей"}</h1>
          <p style="color:var(--dim);margin:0;font-size:13.5px">${isKZ ? "Supabase бұлтындағы барлық тіркелген қолданушылар мен қонақ сессияларын бақылау" : "Отслеживание реальных пользователей, гостевых сессий и набранного опыта в облаке Supabase"}</p>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <button class="btn ghost small" id="btnRefreshAdmin" style="display:inline-flex;align-items:center;gap:6px">🔄 ${isKZ ? "Деректерді жаңарту" : "Обновить данные"}</button>
          <button class="btn ghost small" id="btnAdminLogout" style="color:#ff6b6b;border-color:rgba(255,107,107,0.3)">🚪 ${isKZ ? "Шығу" : "Выйти"}</button>
        </div>
      </div>

      <!-- Quick Admin Controls -->
      <div style="background:#141318;border:1px solid var(--accent);border-radius:6px;padding:14px 18px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
        <div>
          <b style="color:var(--accent-l);font-size:14px">⚙️ ${isKZ ? "Тақырыптарды құлыптау / ашу режимі" : "Режим доступа к темам (для проверки платформы)"}</b>
          <div style="font-size:12.5px;color:var(--dim);margin-top:2px">
            ${isKZ ? "Ағымдағы күй:" : "Текущее состояние:"} 
            <b style="color:${unlocked ? 'var(--ok)' : '#f59e0b'}">${unlocked ? (isKZ ? "🔓 Барлық тақырыптар ашық" : "🔓 Все темы открыты (промо-режим)") : (isKZ ? "🔒 Қалыпты режим (кезегімен ашылу)" : "🔒 Обычный режим (строго по цепочке)")}</b>
          </div>
        </div>
        <div style="display:flex;gap:8px">
          ${unlocked
            ? `<button class="btn small" id="btnAdminRelock">🔒 ${isKZ ? "Құлыптарды қосу" : "Включить замки"}</button>`
            : `<button class="btn small on" id="btnAdminUnlock">🔓 ${isKZ ? "Барлық тақырыптарды ашу" : "Открыть все темы"}</button>`}
        </div>
      </div>

      <div id="adminKpiArea" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:14px;margin-bottom:24px">
        <div style="background:#141318;border:1px solid var(--line);border-radius:6px;padding:16px"><div style="color:var(--dim);font-size:12px">${isKZ ? "Барлық қолданушылар" : "Всего пользователей"}</div><div style="font-size:28px;font-weight:700;color:#fff;margin-top:6px" id="kpiTotal">...</div></div>
        <div style="background:#141318;border:1px solid var(--line);border-radius:6px;padding:16px"><div style="color:var(--dim);font-size:12px">${isKZ ? "Тіркелген студенттер" : "Студенты (аккаунты)"}</div><div style="font-size:28px;font-weight:700;color:var(--accent-l);margin-top:6px" id="kpiStudents">...</div></div>
        <div style="background:#141318;border:1px solid var(--line);border-radius:6px;padding:16px"><div style="color:var(--dim);font-size:12px">${isKZ ? "Қонақ сессиялары" : "Гости (сессии)"}</div><div style="font-size:28px;font-weight:700;color:#f59e0b;margin-top:6px" id="kpiGuests">...</div></div>
        <div style="background:#141318;border:1px solid var(--line);border-radius:6px;padding:16px"><div style="color:var(--dim);font-size:12px">${isKZ ? "Жалпы жиналған XP" : "Суммарный XP платформы"}</div><div style="font-size:28px;font-weight:700;color:var(--ok);margin-top:6px" id="kpiXp">...</div></div>
      </div>

      <div style="background:#141318;border:1px solid var(--line);border-radius:6px;padding:18px">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:16px">
          <div style="display:flex;gap:6px;flex-wrap:wrap" id="adminFilterTabs">
            <button class="btn small on" data-filter="all">${isKZ ? "Барлығы" : "Все"}</button>
            <button class="btn ghost small" data-filter="students">${isKZ ? "Студенттер" : "Студенты"}</button>
            <button class="btn ghost small" data-filter="guests">${isKZ ? "Қонақтар" : "Гости"}</button>
          </div>
          <input type="text" id="adminSearchInp" placeholder="${isKZ ? "Никнейм бойынша іздеу..." : "Поиск по никнейму..."}" style="padding:6px 12px;background:#0d0c10;border:1px solid var(--line);border-radius:4px;color:#fff;font-size:13px;width:220px">
        </div>

        <div id="adminTableArea" style="overflow-x:auto">
          <div style="text-align:center;padding:30px;color:var(--dim)">⏳ ${isKZ ? "Supabase деректері жүктелуде..." : "Загрузка данных из Supabase..."}</div>
        </div>
      </div>
    </div>
  `;

  const btnAdminLogout = $("#btnAdminLogout");
  if (btnAdminLogout) {
    btnAdminLogout.onclick = () => {
      sessionStorage.removeItem("gp_admin_auth");
      location.hash = "#/";
    };
  }

  const btnAdminUnlock = $("#btnAdminUnlock");
  if (btnAdminUnlock) {
    btnAdminUnlock.onclick = () => {
      store.set("promoUnlocked", true);
      viewAdmin(u);
    };
  }

  const btnAdminRelock = $("#btnAdminRelock");
  if (btnAdminRelock) {
    btnAdminRelock.onclick = () => {
      store.set("promoUnlocked", false);
      viewAdmin(u);
    };
  }

  let adminData = null;
  let currentFilter = "all";
  let searchQuery = "";

  async function loadData() {
    const tableArea = $("#adminTableArea");
    if (!tableArea) return;
    tableArea.innerHTML = `<div style="text-align:center;padding:30px;color:var(--dim)">⏳ ${isKZ ? "Supabase деректері жүктелуде..." : "Загрузка данных из Supabase..."}</div>`;

    if (window.sbFetchAdminStats) {
      adminData = await window.sbFetchAdminStats();
    }

    if (!adminData || !adminData.all) {
      const localUsers = [...DEMO_USERS.map(([n, x]) => ({ username: n, xp: x, updated_at: new Date().toISOString() }))];
      adminData = {
        all: localUsers,
        registered: localUsers.filter(p => !p.username.startsWith("[Гость]")),
        guests: localUsers.filter(p => p.username.startsWith("[Гость]")),
        totalUsers: localUsers.length,
        totalRegistered: localUsers.filter(p => !p.username.startsWith("[Гость]")).length,
        totalGuests: localUsers.filter(p => p.username.startsWith("[Гость]")).length,
        totalXp: localUsers.reduce((acc, p) => acc + (p.xp || 0), 0)
      };
    }

    $("#kpiTotal").textContent = adminData.totalUsers;
    $("#kpiStudents").textContent = adminData.totalRegistered;
    $("#kpiGuests").textContent = adminData.totalGuests;
    $("#kpiXp").textContent = adminData.totalXp.toLocaleString() + " XP";

    renderTable();
  }

  function renderTable() {
    const tableArea = $("#adminTableArea");
    if (!tableArea || !adminData) return;

    let list = adminData.all;
    if (currentFilter === "students") list = adminData.registered;
    if (currentFilter === "guests") list = adminData.guests;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => (p.username || "").toLowerCase().includes(q));
    }

    if (!list.length) {
      tableArea.innerHTML = `<div style="text-align:center;padding:24px;color:var(--dim)">${isKZ ? "Ешқандай жазба табылмады" : "Пользователи не найдены"}</div>`;
      return;
    }

    let html = `
      <table style="width:100%;border-collapse:collapse;font:13px var(--mono);text-align:left">
        <thead>
          <tr style="border-bottom:1px solid var(--line);color:var(--dim);font-size:12px">
            <th style="padding:10px 8px">#</th>
            <th style="padding:10px 8px">${isKZ ? "Қолданушы" : "Пользователь"}</th>
            <th style="padding:10px 8px">${isKZ ? "Типі" : "Тип"}</th>
            <th style="padding:10px 8px;text-align:right">XP</th>
            <th style="padding:10px 8px;text-align:right">${isKZ ? "Соңғы белсенділік" : "Последняя активность"}</th>
          </tr>
        </thead>
        <tbody>
    `;

    list.forEach((p, idx) => {
      const isGuest = p.username.startsWith("[Гость]");
      const cleanName = isGuest ? p.username.replace("[Гость] ", "") : p.username;
      const typeBadge = isGuest
        ? `<span style="background:rgba(245,158,11,0.15);color:#f59e0b;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600">${isKZ ? "ҚОНАҚ" : "ГОСТЬ"}</span>`
        : `<span style="background:rgba(153,105,255,0.15);color:var(--accent-l);padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600">${isKZ ? "СТУДЕНТ" : "СТУДЕНТ"}</span>`;
      
      const timeStr = p.updated_at ? new Date(p.updated_at).toLocaleString() : "—";

      html += `
        <tr style="border-bottom:1px solid rgba(255,255,255,0.04)">
          <td style="padding:10px 8px;color:var(--dim)">${idx + 1}</td>
          <td style="padding:10px 8px;font-weight:600;color:#fff">${esc(cleanName)}</td>
          <td style="padding:10px 8px">${typeBadge}</td>
          <td style="padding:10px 8px;text-align:right;color:var(--ok);font-weight:700">${(p.xp || 0)} XP</td>
          <td style="padding:10px 8px;text-align:right;color:var(--dim);font-size:12px">${timeStr}</td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    tableArea.innerHTML = html;
  }

  $("#btnRefreshAdmin").onclick = loadData;

  $$("#adminFilterTabs button").forEach(b => {
    b.onclick = () => {
      $$("#adminFilterTabs button").forEach(x => {
        x.className = "btn ghost small";
      });
      b.className = "btn small on";
      currentFilter = b.dataset.filter;
      renderTable();
    };
  });

  const sInp = $("#adminSearchInp");
  if (sInp) {
    sInp.oninput = () => {
      searchQuery = sInp.value;
      renderTable();
    };
  }

  loadData();
}

// ---------- router ----------
function route() {
  $$(".overlay").forEach(o => o.remove());
  window.gpPrefs = null;
  const flag = (location.search + location.hash).match(/[?&](?:open=([01])|code=([a-zA-Z0-9]+))/i);
  if (flag) {
    if (flag[1] === "1" || (flag[2] && PROMO_CODES.includes(flag[2].toUpperCase()))) {
      store.set("promoUnlocked", true);
    } else if (flag[1] === "0") {
      store.set("promoUnlocked", false);
    }
    history.replaceState(null, "", location.pathname + "#/");
  }
  const u = getUser(), h = location.hash || "#/";
  if (!u) { if (h !== "#/login") { location.hash = "#/login"; return; } return viewLogin(); }
  if (h === "#/login") { location.hash = "#/"; return; }
  if (h === "#/setup") return viewSetup(u);
  if (h === "#/arena") return viewArena(u);
  if (h === "#/admin") return viewAdmin(u);
  let m = h.match(/^#\/topic\/(\d+)/);
  if (m) return viewTopic(u, +m[1]);
  m = h.match(/^#\/task\/(\w+)/); // старые ссылки
  if (m) { const t = TOPICS.find(t => t.tasks.some(k => k.id === m[1])); if (t) { location.hash = "#/topic/" + t.id; return; } }
  viewDashboard(u);
}
addEventListener("hashchange", route);
route();
