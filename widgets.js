// widgets.js: Дополнительные интерактивные симуляторы для тем Go платформы.
// Темы: 6 (if/else), 8 (for loops), 10 (slices), 11 (maps), 20 (JSON), 22 (REST API), 23 (SQL).

(function () {
  const TITLES = {
    6: "Интерактивный симулятор ветвлений (if / else if / else)",
    8: "Пошаговый тренажёр цикла for и счётчика",
    10: "Рентген среза: Len vs Cap и аллокация памяти append()",
    11: "Интерактивная хеш-таблица (Map Key-Value)",
    30: "Двусторонний конвертер: Go Struct ⇄ JSON (Marshal/Unmarshal)",
    32: "Интерактивный REST API Клиент (Мини-Postman)",
    33: "Интерактивная песочница SQLite и SQL-запросов",
  };

  const TITLES_KZ = {
    6: "Шарттардың интерактивті симуляторы (if / else if / else)",
    8: "for циклі мен есептегіштің қадамдық жаттықтырғышы",
    10: "Тілім рентгені: Len vs Cap және append() жад бөлуі",
    11: "Интерактивті хэш-кесте (Map Key-Value)",
    30: "Екі жақты түрлендіргіш: Go Struct ⇄ JSON (Marshal/Unmarshal)",
    32: "Интерактивті REST API Клиенті (Шағын-Postman)",
    33: "SQLite және SQL сұраныстарының интерактивті құмсалғышы",
  };

  window.hasTopicWidget = function (tid) {
    return !!TITLES[tid] || (window.hasPedagogy && window.hasPedagogy(tid));
  };

  window.getWidgetTitle = function (tid) {
    const isKZ = (window.getLang && window.getLang()) === "kz";
    if (isKZ && TITLES_KZ[tid]) return TITLES_KZ[tid];
    if (TITLES[tid]) return TITLES[tid];
    if (window.hasPedagogy && window.hasPedagogy(tid)) return isKZ ? "Белсенді оқыту зертханасы: Құрастырушы & Bug Hunter" : "Лаборатория активного обучения: Конструктор & Bug Hunter";
    return isKZ ? "Интерактивті жаттықтырғыш" : "Интерактивный тренажёр";
  };

  window.getTopicWidgetRenderer = function (tid) {
    if (tid === 6) return initIfElseViz;
    if (tid === 8) return initForViz;
    if (tid === 10) return initSliceViz;
    if (tid === 11) return initMapViz;
    if (tid === 30) return initJsonViz;
    if (tid === 32) return initApiViz;
    if (tid === 33) return initSqlViz;
    return null;
  };

  window.initTopicWidgets = function (tid, container) {
    const fn = window.getTopicWidgetRenderer(tid);
    if (fn) fn(container);
  };

  // ==========================================
  // ТЕМА 6: Условия if / else
  // ==========================================
  function initIfElseViz(container) {
    const el = container || document.getElementById("topicWidgetArea") || document.getElementById("piscineWidgetArea");
    if (!el) return;
    const isKZ = (window.getLang && window.getLang()) === "kz";

    el.innerHTML = `
      <div class="quad-widget">
        <div class="qw-header">
          <div class="qw-title">🔀 ${isKZ ? "Шарттардың интерактивті ағашы (IT-клубқа кіру)" : "Интерактивное дерево условий (Вход в IT-клуб)"}</div>
          <div class="qw-controls">
            <label>${isKZ ? "Жасы:" : "Возраст:"} <b id="ifAgeVal">19</b> <input type="range" id="ifAge" min="12" max="60" value="19" style="width:100px;accent-color:var(--accent)"></label>
            <label style="cursor:pointer"><input type="checkbox" id="ifStudent" checked> ${isKZ ? "Студент 🎓" : "Студент 🎓"}</label>
            <label style="cursor:pointer"><input type="checkbox" id="ifVip"> ${isKZ ? "VIP-билет 👑" : "VIP-билет 👑"}</label>
          </div>
        </div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:14px">
          <div style="flex:1;min-width:280px;background:#141318;border:1px solid var(--line);border-radius:4px;padding:12px;font:13px var(--mono);line-height:1.6" id="ifCodeBox"></div>
          <div style="flex:1;min-width:240px;background:rgba(0,0,0,.25);border:1px solid var(--line);border-radius:4px;padding:14px" id="ifResultBox"></div>
        </div>
      </div>
    `;

    const ageInp = document.getElementById("ifAge");
    const ageVal = document.getElementById("ifAgeVal");
    const studInp = document.getElementById("ifStudent");
    const vipInp = document.getElementById("ifVip");
    const codeBox = document.getElementById("ifCodeBox");
    const resBox = document.getElementById("ifResultBox");

    const update = () => {
      const age = +ageInp.value;
      const isStudent = studInp.checked;
      const isVip = vipInp.checked;
      ageVal.textContent = age;

      let branch = 0;
      let msg = "";
      if (isVip) {
        branch = 1;
        msg = isKZ ? "👑 VIP: Кезексіз кіріңіз, барлық сусындар мекеме есебінен!" : "👑 VIP: Проходите без очереди, кофе и напитки за счёт заведения!";
      } else if (age >= 18 && isStudent) {
        branch = 2;
        msg = isKZ ? "🎓 Студент 18+: Кіруге 50% жеңілдікпен рұқсат!" : "🎓 Студент 18+: Вход разрешён со скидкой 50%!";
      } else if (age >= 18) {
        branch = 3;
        msg = isKZ ? "🎟️ Стандарт: Қарапайым билетпен кіруге рұқсат." : "🎟️ Стандарт: Вход разрешён по обычному билету.";
      } else {
        branch = 4;
        msg = isKZ ? "🚫 Кіру қатаң түрде 18 жастан бастап! Кейінірек келіңіз." : "🚫 Вход строго с 18 лет! Попробуйте прийти позже.";
      }

      const hl = (b, text) => `<div style="padding:4px 8px;border-radius:3px;margin:2px 0;background:${branch === b ? 'rgba(79,209,139,.18);border-left:3px solid var(--ok);color:#fff;font-weight:600' : 'transparent'}">${text} ${branch === b ? (isKZ ? ' &larr; ОРЫНДАЛДЫ!' : ' &larr; СРАБОТАЛО!') : ''}</div>`;

      codeBox.innerHTML = `
        <div style="color:var(--dim);margin-bottom:6px">// ${isKZ ? "Рұқсатты тексеру функциясының коды:" : "Код функции проверки доступа:"}</div>
        ${hl(1, `if isVIP {<br>&nbsp;&nbsp;&nbsp;&nbsp;return "${isKZ ? "VIP рұқсат 👑" : "VIP доступ 👑"}"<br>}`)}
        ${hl(2, `else if age &gt;= 18 &amp;&amp; isStudent {<br>&nbsp;&nbsp;&nbsp;&nbsp;return "${isKZ ? "50% жеңілдік 🎓" : "Скидка 50% 🎓"}"<br>}`)}
        ${hl(3, `else if age &gt;= 18 {<br>&nbsp;&nbsp;&nbsp;&nbsp;return "${isKZ ? "Стандартты кіру 🎟️" : "Стандартный вход 🎟️"}"<br>}`)}
        ${hl(4, `else {<br>&nbsp;&nbsp;&nbsp;&nbsp;return "${isKZ ? "Кіруге тыйым салынған 🚫" : "Доступ запрещён 🚫"}"<br>}`)}
      `;

      resBox.innerHTML = `
        <div class="qw-badge ${branch === 4 ? 'diff-exam' : 'ok'}">${branch === 4 ? (isKZ ? 'КІРУГЕ РҰҚСАТ ЖОҚ' : 'ОТКАЗ В ДОСТУПЕ') : (isKZ ? 'КІРУГЕ РҰҚСАТ' : 'ДОСТУП РАЗРЕШЁН')}</div>
        <div style="font-size:14px;color:#fff;margin:10px 0 12px;line-height:1.5"><b>${msg}</b></div>
        <div style="font:12px var(--mono);color:var(--muted)">
          ${isKZ ? "Параметрлер:" : "Параметры:"} age = ${age}, isStudent = ${isStudent}, isVIP = ${isVip}
        </div>
      `;
    };

    ageInp.oninput = update;
    studInp.onchange = update;
    vipInp.onchange = update;
    update();
  }

  // ==========================================
  // ТЕМА 8: Циклы for
  // ==========================================
  function initForViz(container) {
    const el = container || document.getElementById("topicWidgetArea") || document.getElementById("piscineWidgetArea");
    if (!el) return;
    const isKZ = (window.getLang && window.getLang()) === "kz";

    el.innerHTML = `
      <div class="quad-widget">
        <div class="qw-header">
          <div class="qw-title">🔁 ${isKZ ? "for циклі мен есептегіштің қадамдық жаттықтырғышы" : "Пошаговый тренажёр цикла for: for i := 0; i < N; i++"}</div>
          <div class="qw-controls">
            <label>${isKZ ? "Итерация саны N:" : "Число итераций N:"} <b id="forNval">5</b> <input type="range" id="forN" min="1" max="8" value="5" style="width:90px;accent-color:var(--accent)"></label>
            <button class="btn small on" id="forStep">${isKZ ? "Алға қадам →" : "Шаг вперёд →"}</button>
            <button class="btn small" id="forAuto">${isKZ ? "▶ Авто-өткізу" : "▶ Авто-прогон"}</button>
            <button class="btn ghost small" id="forReset">${isKZ ? "Қалпына келтіру" : "Сброс"}</button>
          </div>
        </div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:14px">
          <div style="flex:1;min-width:280px;background:#141318;border:1px solid var(--line);border-radius:4px;padding:14px;font:13px var(--mono)" id="forCodeBox"></div>
          <div style="flex:1;min-width:240px;background:rgba(0,0,0,.25);border:1px solid var(--line);border-radius:4px;padding:14px" id="forStateBox"></div>
        </div>
      </div>
    `;

    const nInp = document.getElementById("forN");
    const nVal = document.getElementById("forNval");
    const codeBox = document.getElementById("forCodeBox");
    const stateBox = document.getElementById("forStateBox");

    let n = 5;
    let i = 0;
    let sum = 0;
    let stage = "init"; // "init", "check", "body", "post", "done"
    let timer = null;

    const render = () => {
      nVal.textContent = n;
      const isCond = i < n;

      codeBox.innerHTML = `
        <div style="color:var(--dim);margin-bottom:8px">// ${isKZ ? `0-ден ${n - 1}-ге дейінгі сандардың қосындысын есептеу:` : `Вычисление суммы чисел от 0 до ${n - 1}:`}</div>
        <div style="padding:3px 6px;border-radius:2px;${stage === 'init' ? 'background:rgba(153,105,255,.2);color:#fff;font-weight:600' : ''}">sum := 0</div>
        <div style="padding:3px 6px;border-radius:2px;${stage === 'check' || stage === 'post' ? 'background:rgba(153,105,255,.2);color:#fff;font-weight:600' : ''}">
          for <span style="${stage === 'init' ? 'color:var(--accent-l);font-weight:700' : ''}">i := 0</span>; 
          <span style="${stage === 'check' ? 'color:' + (isCond ? 'var(--ok)' : 'var(--bad)') + ';font-weight:700' : ''}">i &lt; ${n}</span>; 
          <span style="${stage === 'post' ? 'color:var(--accent-l);font-weight:700' : ''}">i++</span> {
        </div>
        <div style="padding:3px 6px 3px 20px;border-radius:2px;${stage === 'body' ? 'background:rgba(79,209,139,.2);color:#fff;font-weight:600' : ''}">
          sum += i
        </div>
        <div>}</div>
      `;

      stateBox.innerHTML = `
        <div class="qw-badge ${stage === 'done' ? 'ok' : ''}">${stage === 'done' ? (isKZ ? 'ЦИКЛ АЯҚТАЛДЫ' : 'ЦИКЛ ЗАВЕРШЁН') : (isKZ ? 'ОРЫНДАЛУДА' : 'ИДЁТ ВЫПОЛНЕНИЕ')}</div>
        <div style="font:700 20px var(--mono);margin:10px 0;color:#fff">
          i = <span style="color:var(--accent-l)">${i}</span> &nbsp;&middot;&nbsp; sum = <span style="color:var(--ok)">${sum}</span>
        </div>
        <div style="font-size:13px;line-height:1.5;color:var(--muted)">
          ${stage === 'init' ? (isKZ ? 'Бастау: <code>sum = 0</code>, есептегіш <code>i = 0</code>.' : 'Инициализация: переменная <code>sum = 0</code>, счётчик <code>i = 0</code>.') : ''}
          ${stage === 'check' ? (isKZ ? `Шартты тексеру: <code>${i} &lt; ${n}</code> &rarr; <b style="color:${isCond ? 'var(--ok)' : 'var(--bad)'}">${isCond ? 'true (жалғастырамыз)' : 'false (циклден шығамыз!)'}</b>` : `Проверка условия: <code>${i} &lt; ${n}</code> &rarr; <b style="color:${isCond ? 'var(--ok)' : 'var(--bad)'}">${isCond ? 'true (продолжаем)' : 'false (выходим из цикла!)'}</b>`) : ''}
          ${stage === 'body' ? (isKZ ? `Цикл денесі: қосындыға <code>${i}</code> қосамыз. Жаңа қосынды: <b>${sum}</b>.` : `Тело цикла: к сумме прибавляем <code>${i}</code>. Новая сумма: <b>${sum}</b>.`) : ''}
          ${stage === 'post' ? (isKZ ? `Инкремент: <code>i++</code> есептегішті <b>${i + 1}</b>-ге дейін арттырады.` : `Инкремент: <code>i++</code> увеличивает счётчик до <b>${i + 1}</b>.`) : ''}
          ${stage === 'done' ? (isKZ ? `<code>${i} &lt; ${n}</code> шарты жалған! Цикл тоқтады. Қорытынды қосынды: <b>${sum}</b>.` : `Условие <code>${i} &lt; ${n}</code> ложно! Цикл остановился. Итоговая сумма: <b>${sum}</b>.`) : ''}
        </div>
      `;
    };

    const stepForward = () => {
      if (stage === "init") {
        stage = "check";
      } else if (stage === "check") {
        if (i < n) stage = "body";
        else stage = "done";
      } else if (stage === "body") {
        sum += i;
        stage = "post";
      } else if (stage === "post") {
        i++;
        stage = "check";
      } else if (stage === "done") {
        i = 0; sum = 0; stage = "init";
      }
      render();
    };

    nInp.oninput = e => {
      n = +e.target.value;
      i = 0; sum = 0; stage = "init";
      clearInterval(timer);
      render();
    };

    document.getElementById("forStep").onclick = () => { clearInterval(timer); stepForward(); };
    document.getElementById("forReset").onclick = () => {
      clearInterval(timer);
      i = 0; sum = 0; stage = "init";
      render();
    };
    document.getElementById("forAuto").onclick = () => {
      clearInterval(timer);
      timer = setInterval(() => {
        stepForward();
        if (stage === "done") clearInterval(timer);
      }, 350);
    };

    render();
  }

  // ==========================================
  // ТЕМА 10: Срезы (Slices) Len vs Cap
  // ==========================================
  function initSliceViz(container) {
    const el = container || document.getElementById("topicWidgetArea") || document.getElementById("piscineWidgetArea");
    if (!el) return;
    const isKZ = (window.getLang && window.getLang()) === "kz";

    el.innerHTML = `
      <div class="quad-widget">
        <div class="qw-header">
          <div class="qw-title">🧬 ${isKZ ? "Тілім рентгені: Len vs Cap және append()-те жадтың екі есе өсуі" : "Рентген среза: Len vs Cap и удвоение памяти в append()"}</div>
          <div class="qw-controls">
            <button class="btn small on" id="slAppend">+ append("Go")</button>
            <button class="btn small" id="slSub">${isKZ ? "s = s[1:3] (суб-тілім)" : "s = s[1:3] (суб-срез)"}</button>
            <button class="btn ghost small" id="slReset">${isKZ ? "Қалпына келтіру" : "Сброс"}</button>
          </div>
        </div>
        <div class="rw-sum" id="slMetrics" style="margin-top:10px"></div>
        <div style="margin:16px 0">
          <div style="font:500 12px var(--mono);color:var(--muted);margin-bottom:6px">${isKZ ? "ОПЕРАТИВТІК ЖАДТАҒЫ НЕГІЗГІ МАССИВ (UNDERLYING ARRAY):" : "БАЗОВЫЙ МАССИВ В ОПЕРАТИВНОЙ ПАМЯТИ (UNDERLYING ARRAY):"}</div>
          <div id="slSlots" style="display:flex;gap:6px;flex-wrap:wrap"></div>
        </div>
        <div class="ptr-log" id="slLog" style="line-height:1.5"></div>
      </div>
    `;

    let items = ["A", "B"];
    let cap = 2;
    const metrics = document.getElementById("slMetrics");
    const slots = document.getElementById("slSlots");
    const log = document.getElementById("slLog");

    const render = (msg = "") => {
      const len = items.length;
      metrics.innerHTML = `
        <span>${isKZ ? "Ұзындығы (len):" : "Длина (len):"} <b>${len}</b> (${isKZ ? "көрінетін элементтер" : "видимые элементы"})</span>
        <span>${isKZ ? "Сыйымдылығы (cap):" : "Вместимость (cap):"} <b>${cap}</b> (${isKZ ? "бөлінген жад" : "выделенная память"})</span>
        <span style="color:${len === cap ? 'var(--warn)' : 'var(--ok)'}">${len === cap ? (isKZ ? '⚠️ Толған! Келесі append cap мәнін 2 есе өсіреді' : '⚠️ Заполнен! Следующий append удвоит cap') : (isKZ ? '✓ Буферде орын бар' : '✓ Есть место в буфере')}</span>
      `;

      let html = "";
      for (let i = 0; i < cap; i++) {
        const has = i < len;
        html += `
          <div style="width:48px;height:52px;background:${has ? '#2d233e' : '#16141a'};border:2px solid ${has ? 'var(--accent)' : '#3d3a45'};border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;font:700 15px var(--mono);color:${has ? '#fff' : 'var(--dim)'}">
            <span>${has ? items[i] : '&middot;'}</span>
            <span style="font-size:9px;font-weight:400;color:var(--dim)">[${i}]</span>
          </div>
        `;
      }
      slots.innerHTML = html;

      log.innerHTML = msg || (isKZ ? `Тілімде <b>${cap}</b> мүмкін орынның <b>${len}</b> элементі бар. Жадтың автоматты түрде кеңеюін көру үшін <code>append()</code> басыңыз.` : `Срез содержит <b>${len}</b> элемент(ов) из <b>${cap}</b> возможных ячеек. Нажмите <code>append()</code>, чтобы увидеть автоматическое расширение памяти.`);
    };

    document.getElementById("slAppend").onclick = () => {
      const names = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta"];
      const nextVal = names[items.length % names.length];
      if (items.length >= cap) {
        cap *= 2;
        items.push(nextVal);
        render(isKZ ? `⚡ <b>Жад бөлу (Аллокация)!</b> Орын жетпеді (len > old_cap). Go <code>cap = ${cap}</code> екі есе үлкен жаңа массив жасап, ескі мәліметтерді көшіріп, <code>"${nextVal}"</code> қосты.` : `⚡ <b>Аллокация памяти!</b> Места не хватило (len &gt; old_cap). Go создал новый массив с удвоенной вместимостью <code>cap = ${cap}</code>, скопировал старые данные и добавил <code>"${nextVal}"</code>.`);
      } else {
        items.push(nextVal);
        render(isKZ ? `✓ <code>"${nextVal}"</code> элементі қайта бөлусіз бар жадқа сыйып кетті (len = ${items.length}, cap = ${cap}).` : `✓ Элемент <code>"${nextVal}"</code> поместился в уже выделенную память без перевыделения (len = ${items.length}, cap = ${cap}).`);
      }
    };

    document.getElementById("slSub").onclick = () => {
      if (items.length >= 3) {
        items = items.slice(1, 3);
        cap = cap - 1;
        render(isKZ ? `✂️ <code>s[1:3]</code> суб-тілімі алынды: len енді 2, ал cap сол жақтан қиылған индекске азайды.` : `✂️ Взят срез <code>s[1:3]</code>: len стал 2, а cap уменьшился на индекс отсечения слева.`);
      } else {
        render(isKZ ? `Алдымен <code>append()</code> арқылы кемінде 3 элемент қосыңыз!` : `Сначала добавьте хотя бы 3 элемента через <code>append()</code>!`);
      }
    };

    document.getElementById("slReset").onclick = () => {
      items = ["A", "B"];
      cap = 2;
      render(isKZ ? `Тілім бастапқы қалпына келтірілді: <code>len = 2, cap = 2</code>.` : `Срез сброшен к исходному: <code>len = 2, cap = 2</code>.`);
    };

    render();
  }

  // ==========================================
  // ТЕМА 11: Мапы (Словари) Key-Value
  // ==========================================
  function initMapViz(container) {
    const el = container || document.getElementById("topicWidgetArea") || document.getElementById("piscineWidgetArea");
    if (!el) return;
    const isKZ = (window.getLang && window.getLang()) === "kz";

    el.innerHTML = `
      <div class="quad-widget">
        <div class="qw-header">
          <div class="qw-title">🗺️ ${isKZ ? "Go хэш-кестесі: кілт бойынша лезде іздеу және val, ok тексеруі" : "Хеш-таблица Go: быстрый поиск по ключу и проверка val, ok"}</div>
          <div class="qw-controls">
            <input type="text" id="mapKey" placeholder="${isKZ ? "Кілт (аты)" : "Ключ (имя)"}" value="Omar" style="width:110px;padding:6px 10px;background:#17151c;border:1px solid var(--line);border-radius:4px;color:#fff">
            <input type="number" id="mapVal" placeholder="${isKZ ? "Мәні" : "Значение"}" value="100" style="width:90px;padding:6px 10px;background:#17151c;border:1px solid var(--line);border-radius:4px;color:#fff">
            <button class="btn small on" id="mapSet">m[k] = v</button>
            <button class="btn small" id="mapGet">val, ok := m[k]</button>
            <button class="btn ghost small" id="mapDel">delete(m, k)</button>
          </div>
        </div>
        <div id="mapItems" style="display:flex;gap:10px;flex-wrap:wrap;margin:16px 0"></div>
        <div class="ptr-log" id="mapLog" style="line-height:1.5">${isKZ ? "Кілт пен мәнді енгізіңіз немесе <code>val, ok := m[k]</code> арқылы тексеріңіз." : "Вводите ключ и значение или проверяйте существование ключа кнопкой <code>val, ok := m[k]</code>."}</div>
      </div>
    `;

    const data = { "Omar": 100, "Alice": 95, "Bob": 70 };
    const keyInp = document.getElementById("mapKey");
    const valInp = document.getElementById("mapVal");
    const itemsEl = document.getElementById("mapItems");
    const logEl = document.getElementById("mapLog");

    const render = (activeKey = null) => {
      const keys = Object.keys(data);
      if (keys.length === 0) {
        itemsEl.innerHTML = `<span style="color:var(--dim);font:13px var(--mono)">${isKZ ? "Мап бос: make(map[string]int)" : "Мап пуст: make(map[string]int)"}</span>`;
      } else {
        itemsEl.innerHTML = keys.map(k => `
          <div style="background:#17151c;border:1px solid ${k === activeKey ? 'var(--ok)' : 'var(--line)'};border-radius:4px;padding:10px 14px;font:13px var(--mono);box-shadow:${k === activeKey ? '0 0 10px rgba(79,209,139,.4)' : 'none'}">
            <span style="color:var(--accent-l)">"${k}"</span> &rarr; <b style="color:#fff">${data[k]}</b>
          </div>
        `).join("");
      }
    };

    document.getElementById("mapSet").onclick = () => {
      const k = keyInp.value.trim();
      const v = +valInp.value;
      if (!k) return;
      data[k] = v;
      render(k);
      logEl.innerHTML = isKZ ? `Жазылды: <code>m["${k}"] = ${v}</code>. Мападағы кілт бойынша іздеу лезде O(1) уақытында орындалады!` : `Записано: <code>m["${k}"] = ${v}</code>. Поиск по ключу в мапе происходит мгновенно O(1)!`;
    };

    document.getElementById("mapGet").onclick = () => {
      const k = keyInp.value.trim();
      if (!k) return;
      if (k in data) {
        render(k);
        logEl.innerHTML = isKZ ? `Іздеу: <code>val, ok := m["${k}"]</code> &rarr; <b>val = ${data[k]}</b>, <b style="color:var(--ok)">ok = true</b> (кілт сөздікте табылды!).` : `Поиск: <code>val, ok := m["${k}"]</code> &rarr; <b>val = ${data[k]}</b>, <b style="color:var(--ok)">ok = true</b> (ключ найден в словаре!).`;
      } else {
        render();
        logEl.innerHTML = isKZ ? `Іздеу: <code>val, ok := m["${k}"]</code> &rarr; <b>val = 0</b> (int типінің нөлдік мәні), <b style="color:var(--bad)">ok = false</b> (мұндай кілт сөздікте жоқ!).` : `Поиск: <code>val, ok := m["${k}"]</code> &rarr; <b>val = 0</b> (нулевое значение типа int), <b style="color:var(--bad)">ok = false</b> (такого ключа в мапе нет!).`;
      }
    };

    document.getElementById("mapDel").onclick = () => {
      const k = keyInp.value.trim();
      if (k in data) {
        delete data[k];
        render();
        logEl.innerHTML = isKZ ? `Өшірілді: <code>delete(m, "${k}")</code>. Жазба мап жадынан тазартылды.` : `Удалено: <code>delete(m, "${k}")</code>. Запись стёрта из памяти мапа.`;
      } else {
        logEl.innerHTML = isKZ ? `<code>"${k}"</code> кілті өшіру үшін табылмады. Go-да жоқ кілтке delete() қате бермейді, ештеңе істемейді.` : `Ключ <code>"${k}"</code> не найден для удаления. В Go функция delete() на несуществующий ключ не падает с ошибкой, а просто ничего не делает.`;
      }
    };

    render();
  }

  // ==========================================
  // ТЕМА 20: JSON Marshal / Unmarshal
  // ==========================================
  function initJsonViz(container) {
    const el = container || document.getElementById("topicWidgetArea") || document.getElementById("piscineWidgetArea");
    if (!el) return;
    const isKZ = (window.getLang && window.getLang()) === "kz";

    el.innerHTML = `
      <div class="quad-widget">
        <div class="qw-header">
          <div class="qw-title">📦 ${isKZ ? "Go Struct ⇄ JSON түрлендіргіші (json.Marshal / json.Unmarshal)" : "Конвертер Go Struct ⇄ JSON (json.Marshal / json.Unmarshal)"}</div>
        </div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:10px">
          <div style="flex:1;min-width:260px;background:#141318;border:1px solid var(--line);border-radius:4px;padding:14px">
            <div style="font:600 13px var(--mono);color:var(--accent-l);margin-bottom:10px">${isKZ ? "1. Go-дағы құрылым (Todo типі):" : "1. Структура в Go (тип Todo):"}</div>
            <label style="display:block;font:500 11px var(--mono);color:var(--muted);margin-bottom:4px">ID (int):</label>
            <input type="number" id="jsId" value="1" style="width:100%;padding:6px 10px;background:#1a1820;border:1px solid var(--line);border-radius:4px;color:#fff;margin-bottom:8px">
            <label style="display:block;font:500 11px var(--mono);color:var(--muted);margin-bottom:4px">Title (string):</label>
            <input type="text" id="jsTitle" value="${isKZ ? "01 Edu Piscine өту" : "Пройти 01 Edu Piscine"}" style="width:100%;padding:6px 10px;background:#1a1820;border:1px solid var(--line);border-radius:4px;color:#fff;margin-bottom:8px">
            <label style="display:flex;align-items:center;gap:8px;font:500 12px var(--mono);color:#fff;margin-top:4px;cursor:pointer">
              <input type="checkbox" id="jsDone" checked> Done (bool)
            </label>
          </div>
          <div style="flex:1;min-width:260px;background:#141318;border:1px solid var(--line);border-radius:4px;padding:14px">
            <div style="font:600 13px var(--mono);color:var(--ok);margin-bottom:10px">${isKZ ? "2. JSON мәтіні (json.Marshal нәтижесі):" : "2. Текст JSON (выход json.Marshal):"}</div>
            <pre id="jsOut" style="background:#1a1820;border:1px solid var(--line);border-radius:4px;padding:12px;font:13px var(--mono);color:#fff;margin:0;min-height:90px"></pre>
            <div style="font-size:12px;color:var(--dim);margin-top:8px">${isKZ ? "Назар аударыңыз: құрылым өрістері бас әріппен жазылған (<code>Title</code>), ал JSON-да <code>\`json:\"title\"\`</code> тегінің арқасында кіші әріпке (<code>\"title\"</code>) айналды!" : "Обратите внимание: поля структуры написаны с большой буквы (<code>Title</code>), а в JSON стали маленькими (<code>\"title\"</code>) благодаря тегам <code>\`json:\"title\"\`</code>!"}</div>
          </div>
        </div>
      </div>
    `;

    const idInp = document.getElementById("jsId");
    const titleInp = document.getElementById("jsTitle");
    const doneInp = document.getElementById("jsDone");
    const outPre = document.getElementById("jsOut");

    const update = () => {
      const obj = {
        id: +idInp.value,
        title: titleInp.value,
        done: doneInp.checked
      };
      outPre.textContent = JSON.stringify(obj, null, 2);
    };

    idInp.oninput = update;
    titleInp.oninput = update;
    doneInp.onchange = update;
    update();
  }

  // ==========================================
  // ТЕМА 22: REST API Клиент (Мини-Postman)
  // ==========================================
  function initApiViz(container) {
    const el = container || document.getElementById("topicWidgetArea") || document.getElementById("piscineWidgetArea");
    if (!el) return;
    const isKZ = (window.getLang && window.getLang()) === "kz";

    el.innerHTML = `
      <div class="quad-widget">
        <div class="qw-header">
          <div class="qw-title">🚀 ${isKZ ? "Интерактивті REST API Клиенті (Шағын-Postman)" : "Интерактивный REST API Клиент (Мини-Postman)"}</div>
          <div class="qw-controls">
            <select id="apiMethod" style="padding:6px 10px;font:600 12px var(--mono);background:#17151c;border:1px solid var(--line);border-radius:4px;color:var(--accent-l)">
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input type="text" id="apiUrl" value="/todos" style="padding:6px 10px;font:13px var(--mono);background:#17151c;border:1px solid var(--line);border-radius:4px;color:#fff;width:180px">
            <button class="btn small on" id="apiSend">${isKZ ? "Сұранысты жіберу →" : "Отправить запрос →"}</button>
          </div>
        </div>
        <div id="apiBodyWrap" style="display:none;margin-top:10px">
          <label style="font:500 11px var(--mono);color:var(--muted)">${isKZ ? "Сұраныс денесі (JSON body):" : "Тело запроса (JSON body):"}</label>
          <input type="text" id="apiPostTitle" value="${isKZ ? "Жаңа тапсырма" : "Новая задача"}" style="padding:6px 10px;font:13px var(--mono);background:#17151c;border:1px solid var(--line);border-radius:4px;color:#fff;width:100%;margin-top:4px">
        </div>
        <div style="background:#141318;border:1px solid var(--line);border-radius:4px;padding:12px;margin-top:14px;font:13px var(--mono)" id="apiRespBox">
          <span style="color:var(--dim)">${isKZ ? "Виртуалды Go серверіне HTTP сұраныс жіберу үшін «Сұранысты жіберу» түймесін басыңыз." : "Нажмите «Отправить запрос», чтобы отправить HTTP-запрос к виртуальному серверу Go."}</span>
        </div>
      </div>
    `;

    const todos = [
      { id: 1, title: isKZ ? "Go негіздерін үйрену" : "Изучить основы Go", done: true },
      { id: 2, title: isKZ ? "Piscine тапсыру" : "Пройти Piscine", done: false }
    ];

    const methodSel = document.getElementById("apiMethod");
    const urlInp = document.getElementById("apiUrl");
    const bodyWrap = document.getElementById("apiBodyWrap");
    const postTitle = document.getElementById("apiPostTitle");
    const respBox = document.getElementById("apiRespBox");

    methodSel.onchange = () => {
      const m = methodSel.value;
      if (m === "POST") {
        bodyWrap.style.display = "block";
        urlInp.value = "/add";
      } else {
        bodyWrap.style.display = "none";
        urlInp.value = "/todos";
      }
    };

    document.getElementById("apiSend").onclick = () => {
      const m = methodSel.value;
      const url = urlInp.value.trim();

      respBox.innerHTML = `<span style="color:var(--accent-l)">${isKZ ? `HTTP ${m} ${url} жіберілуде...` : `Отправка HTTP ${m} ${url}...`}</span>`;

      setTimeout(() => {
        if (m === "GET" && url === "/todos") {
          respBox.innerHTML = `
            <div style="display:flex;justify-content:space-between;margin-bottom:8px">
              <span class="qw-badge ok">HTTP/1.1 200 OK</span>
              <span style="color:var(--dim)">Content-Type: application/json</span>
            </div>
            <pre style="margin:0;color:#fff">${JSON.stringify(todos, null, 2)}</pre>
          `;
        } else if (m === "POST" && url === "/add") {
          const newT = { id: todos.length + 1, title: postTitle.value || (isKZ ? "Атаусыз" : "Без названия"), done: false };
          todos.push(newT);
          respBox.innerHTML = `
            <div style="display:flex;justify-content:space-between;margin-bottom:8px">
              <span class="qw-badge ok">HTTP/1.1 201 Created</span>
              <span style="color:var(--dim)">Content-Type: application/json</span>
            </div>
            <pre style="margin:0;color:#fff">${JSON.stringify({ status: "created", item: newT }, null, 2)}</pre>
            <div style="margin-top:8px;color:var(--ok)">${isKZ ? "✓ Тапсырма тізімге қосылды! Жаңартылған тізімді көру үшін әдісті GET /todos етіп ауыстырыңыз." : "✓ Дело добавлено в список! Переключите метод на GET /todos, чтобы увидеть обновленный список."}</div>
          `;
        } else if (m === "DELETE") {
          const removed = todos.pop();
          respBox.innerHTML = `
            <div style="display:flex;justify-content:space-between;margin-bottom:8px">
              <span class="qw-badge ok">HTTP/1.1 200 OK</span>
            </div>
            <pre style="margin:0;color:#fff">${JSON.stringify({ status: "deleted", removed: removed || null }, null, 2)}</pre>
          `;
        } else {
          respBox.innerHTML = `
            <div style="display:flex;justify-content:space-between;margin-bottom:8px">
              <span class="qw-badge diff-exam">HTTP/1.1 404 Not Found</span>
            </div>
            <pre style="margin:0;color:var(--bad)">{"error": "route not found"}</pre>
          `;
        }
      }, 200);
    };
  }

  // ==========================================
  // ТЕМА 23: Базы данных и SQL
  // ==========================================
  function initSqlViz(container) {
    const el = container || document.getElementById("topicWidgetArea") || document.getElementById("piscineWidgetArea");
    if (!el) return;
    const isKZ = (window.getLang && window.getLang()) === "kz";

    el.innerHTML = `
      <div class="quad-widget">
        <div class="qw-header">
          <div class="qw-title">🗄️ ${isKZ ? "SQLite интерактивті деректер қоры: todos кестесі" : "Интерактивная база данных SQLite: таблица todos"}</div>
          <div class="qw-controls">
            <button class="btn small on" id="sqlSelAll">SELECT * FROM todos</button>
            <button class="btn small" id="sqlSelDone">WHERE done = 1</button>
            <button class="btn small" id="sqlInsert">INSERT INTO todos</button>
            <button class="btn ghost small" id="sqlReset">${isKZ ? "Кестені қалпына келтіру" : "Сброс таблицы"}</button>
          </div>
        </div>
        <div style="margin:14px 0;overflow-x:auto">
          <table class="rw-table" id="sqlTable">
            <thead><tr><th>ID (INTEGER PRIMARY KEY)</th><th>TITLE (TEXT)</th><th>DONE (BOOLEAN)</th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
        <div class="ptr-log" id="sqlLog" style="line-height:1.5">${isKZ ? "Деректер қорының командалары қалай орындалатынын көру үшін жоғарыдағы SQL түймелерін басыңыз." : "Кликайте по кнопкам SQL-запросов выше, чтобы увидеть, как выполняются команды базы данных."}</div>
      </div>
    `;

    let rows = [
      { id: 1, title: isKZ ? "Go синтаксисін үйрену" : "Изучить Go синтаксис", done: 1 },
      { id: 2, title: isKZ ? "QuadA және QuadB шешу" : "Решить QuadA и QuadB", done: 1 },
      { id: 3, title: isKZ ? "REST API сервер жазу" : "Написать REST API сервер", done: 0 }
    ];

    const tbody = document.querySelector("#sqlTable tbody");
    const log = document.getElementById("sqlLog");

    const render = (activeRows = rows, query = "") => {
      tbody.innerHTML = activeRows.map(r => `
        <tr>
          <td><b>${r.id}</b></td>
          <td>${r.title}</td>
          <td><span class="qw-badge ${r.done ? 'ok' : ''}">${r.done ? 'true (1)' : 'false (0)'}</span></td>
        </tr>
      `).join("");
      if (query) {
        log.innerHTML = isKZ ? `Сұраныс орындалды: <code>${query}</code> &rarr; <b>${activeRows.length}</b> жол қайтарылды.` : `Выполнен запрос: <code>${query}</code> &rarr; возвращено <b>${activeRows.length}</b> строк(и).`;
      }
    };

    document.getElementById("sqlSelAll").onclick = () => {
      render(rows, "SELECT * FROM todos;");
    };

    document.getElementById("sqlSelDone").onclick = () => {
      const filtered = rows.filter(r => r.done === 1);
      render(filtered, "SELECT * FROM todos WHERE done = 1;");
    };

    document.getElementById("sqlInsert").onclick = () => {
      const newRow = { id: rows.length + 1, title: isKZ ? "Қорытынды жобаны тапсыру" : "Сдать финальный проект", done: 0 };
      rows.push(newRow);
      render(rows, `INSERT INTO todos (title, done) VALUES ('${newRow.title}', 0);`);
    };

    document.getElementById("sqlReset").onclick = () => {
      rows = [
        { id: 1, title: isKZ ? "Go синтаксисін үйрену" : "Изучить Go синтаксис", done: 1 },
        { id: 2, title: isKZ ? "QuadA және QuadB шешу" : "Решить QuadA и QuadB", done: 1 },
        { id: 3, title: isKZ ? "REST API сервер жазу" : "Написать REST API сервер", done: 0 }
      ];
      render(rows, isKZ ? "-- Кесте бастапқы қалпына келтірілді" : "-- Таблица сброшена к исходному состоянию");
    };

    render(rows);
  }
})();

