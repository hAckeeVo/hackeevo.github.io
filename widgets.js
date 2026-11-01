// widgets.js: Дополнительные интерактивные симуляторы для тем Go платформы.
// Темы: 6 (if/else), 8 (for loops), 10 (slices), 11 (maps), 20 (JSON), 22 (REST API), 23 (SQL).

(function () {
  const TITLES = {
    6: "Интерактивный симулятор ветвлений (if / else if / else)",
    8: "Пошаговый тренажёр цикла for и счётчика",
    10: "Рентген среза: Len vs Cap и аллокация памяти append()",
    11: "Интерактивная хеш-таблица (Map Key-Value)",
    20: "Двусторонний конвертер: Go Struct ⇄ JSON (Marshal/Unmarshal)",
    22: "Интерактивный REST API Клиент (Мини-Postman)",
    23: "Интерактивная песочница SQLite и SQL-запросов",
  };

  window.hasTopicWidget = function (tid) {
    return !!TITLES[tid];
  };

  window.getWidgetTitle = function (tid) {
    return TITLES[tid] || "Интерактивный тренажёр";
  };

  window.initTopicWidgets = function (tid) {
    if (tid === 6) initIfElseViz();
    if (tid === 8) initForViz();
    if (tid === 10) initSliceViz();
    if (tid === 11) initMapViz();
    if (tid === 20) initJsonViz();
    if (tid === 22) initApiViz();
    if (tid === 23) initSqlViz();
  };

  // ==========================================
  // ТЕМА 6: Условия if / else
  // ==========================================
  function initIfElseViz() {
    const el = document.getElementById("topicWidgetArea") || document.getElementById("piscineWidgetArea");
    if (!el) return;

    el.innerHTML = `
      <div class="quad-widget">
        <div class="qw-header">
          <div class="qw-title">🔀 Интерактивное дерево условий (Вход в IT-клуб)</div>
          <div class="qw-controls">
            <label>Возраст: <b id="ifAgeVal">19</b> <input type="range" id="ifAge" min="12" max="60" value="19" style="width:100px;accent-color:var(--accent)"></label>
            <label style="cursor:pointer"><input type="checkbox" id="ifStudent" checked> Студент 🎓</label>
            <label style="cursor:pointer"><input type="checkbox" id="ifVip"> VIP-билет 👑</label>
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
        msg = "👑 VIP: Проходите без очереди, кофе и напитки за счёт заведения!";
      } else if (age >= 18 && isStudent) {
        branch = 2;
        msg = "🎓 Студент 18+: Вход разрешён со скидкой 50%!";
      } else if (age >= 18) {
        branch = 3;
        msg = "🎟️ Стандарт: Вход разрешён по обычному билету.";
      } else {
        branch = 4;
        msg = "🚫 Вход строго с 18 лет! Попробуйте прийти позже.";
      }

      const hl = (b, text) => `<div style="padding:4px 8px;border-radius:3px;margin:2px 0;background:${branch === b ? 'rgba(79,209,139,.18);border-left:3px solid var(--ok);color:#fff;font-weight:600' : 'transparent'}">${text} ${branch === b ? ' &larr; СРАБОТАЛО!' : ''}</div>`;

      codeBox.innerHTML = `
        <div style="color:var(--dim);margin-bottom:6px">// Код функции проверки доступа:</div>
        ${hl(1, `if isVIP {<br>&nbsp;&nbsp;&nbsp;&nbsp;return "VIP доступ 👑"<br>}`)}
        ${hl(2, `else if age &gt;= 18 &amp;&amp; isStudent {<br>&nbsp;&nbsp;&nbsp;&nbsp;return "Скидка 50% 🎓"<br>}`)}
        ${hl(3, `else if age &gt;= 18 {<br>&nbsp;&nbsp;&nbsp;&nbsp;return "Стандартный вход 🎟️"<br>}`)}
        ${hl(4, `else {<br>&nbsp;&nbsp;&nbsp;&nbsp;return "Доступ запрещён 🚫"<br>}`)}
      `;

      resBox.innerHTML = `
        <div class="qw-badge ${branch === 4 ? 'diff-exam' : 'ok'}">${branch === 4 ? 'ОТКАЗ В ДОСТУПЕ' : 'ДОСТУП РАЗРЕШЁН'}</div>
        <div style="font-size:14px;color:#fff;margin:10px 0 12px;line-height:1.5"><b>${msg}</b></div>
        <div style="font:12px var(--mono);color:var(--muted)">
          Параметры: age = ${age}, isStudent = ${isStudent}, isVIP = ${isVip}
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
  function initForViz() {
    const el = document.getElementById("topicWidgetArea") || document.getElementById("piscineWidgetArea");
    if (!el) return;

    el.innerHTML = `
      <div class="quad-widget">
        <div class="qw-header">
          <div class="qw-title">🔁 Пошаговый тренажёр цикла for: for i := 0; i &lt; N; i++</div>
          <div class="qw-controls">
            <label>Число итераций N: <b id="forNval">5</b> <input type="range" id="forN" min="1" max="8" value="5" style="width:90px;accent-color:var(--accent)"></label>
            <button class="btn small on" id="forStep">Шаг вперёд &rarr;</button>
            <button class="btn small" id="forAuto">▶ Авто-прогон</button>
            <button class="btn ghost small" id="forReset">Сброс</button>
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
        <div style="color:var(--dim);margin-bottom:8px">// Вычисление суммы чисел от 0 до ${n - 1}:</div>
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
        <div class="qw-badge ${stage === 'done' ? 'ok' : ''}">${stage === 'done' ? 'ЦИКЛ ЗАВЕРШЁН' : 'ИДЁТ ВЫПОЛНЕНИЕ'}</div>
        <div style="font:700 20px var(--mono);margin:10px 0;color:#fff">
          i = <span style="color:var(--accent-l)">${i}</span> &nbsp;&middot;&nbsp; sum = <span style="color:var(--ok)">${sum}</span>
        </div>
        <div style="font-size:13px;line-height:1.5;color:var(--muted)">
          ${stage === 'init' ? 'Инициализация: переменная <code>sum = 0</code>, счётчик <code>i = 0</code>.' : ''}
          ${stage === 'check' ? `Проверка условия: <code>${i} &lt; ${n}</code> &rarr; <b style="color:${isCond ? 'var(--ok)' : 'var(--bad)'}">${isCond ? 'true (продолжаем)' : 'false (выходим из цикла!)'}</b>` : ''}
          ${stage === 'body' ? `Тело цикла: к сумме прибавляем <code>${i}</code>. Новая сумма: <b>${sum}</b>.` : ''}
          ${stage === 'post' ? `Инкремент: <code>i++</code> увеличивает счётчик до <b>${i + 1}</b>.` : ''}
          ${stage === 'done' ? `Условие <code>${i} &lt; ${n}</code> ложно! Цикл остановился. Итоговая сумма: <b>${sum}</b>.` : ''}
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
  function initSliceViz() {
    const el = document.getElementById("topicWidgetArea") || document.getElementById("piscineWidgetArea");
    if (!el) return;

    el.innerHTML = `
      <div class="quad-widget">
        <div class="qw-header">
          <div class="qw-title">🧬 Рентген среза: Len vs Cap и удвоение памяти в append()</div>
          <div class="qw-controls">
            <button class="btn small on" id="slAppend">+ append("Go")</button>
            <button class="btn small" id="slSub">s = s[1:3] (суб-срез)</button>
            <button class="btn ghost small" id="slReset">Сброс</button>
          </div>
        </div>
        <div class="rw-sum" id="slMetrics" style="margin-top:10px"></div>
        <div style="margin:16px 0">
          <div style="font:500 12px var(--mono);color:var(--muted);margin-bottom:6px">БАЗОВЫЙ МАССИВ В ОПЕРАТИВНОЙ ПАМЯТИ (UNDERLYING ARRAY):</div>
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
        <span>Длина (len): <b>${len}</b> (видимые элементы)</span>
        <span>Вместимость (cap): <b>${cap}</b> (выделенная память)</span>
        <span style="color:${len === cap ? 'var(--warn)' : 'var(--ok)'}">${len === cap ? '⚠️ Заполнен! Следующий append удвоит cap' : '✓ Есть место в буфере'}</span>
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

      log.innerHTML = msg || `Срез содержит <b>${len}</b> элемент(ов) из <b>${cap}</b> возможных ячеек. Нажмите <code>append()</code>, чтобы увидеть автоматическое расширение памяти.`;
    };

    document.getElementById("slAppend").onclick = () => {
      const names = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta"];
      const nextVal = names[items.length % names.length];
      if (items.length >= cap) {
        cap *= 2;
        items.push(nextVal);
        render(`⚡ <b>Аллокация памяти!</b> Места не хватило (len &gt; old_cap). Go создал новый массив с удвоенной вместимостью <code>cap = ${cap}</code>, скопировал старые данные и добавил <code>"${nextVal}"</code>.`);
      } else {
        items.push(nextVal);
        render(`✓ Элемент <code>"${nextVal}"</code> поместился в уже выделенную память без перевыделения (len = ${items.length}, cap = ${cap}).`);
      }
    };

    document.getElementById("slSub").onclick = () => {
      if (items.length >= 3) {
        items = items.slice(1, 3);
        cap = cap - 1;
        render(`✂️ Взят срез <code>s[1:3]</code>: len стал 2, а cap уменьшился на индекс отсечения слева.`);
      } else {
        render(`Сначала добавьте хотя бы 3 элемента через <code>append()</code>!`);
      }
    };

    document.getElementById("slReset").onclick = () => {
      items = ["A", "B"];
      cap = 2;
      render(`Срез сброшен к исходному: <code>len = 2, cap = 2</code>.`);
    };

    render();
  }

  // ==========================================
  // ТЕМА 11: Мапы (Словари) Key-Value
  // ==========================================
  function initMapViz() {
    const el = document.getElementById("topicWidgetArea") || document.getElementById("piscineWidgetArea");
    if (!el) return;

    el.innerHTML = `
      <div class="quad-widget">
        <div class="qw-header">
          <div class="qw-title">🗺️ Хеш-таблица Go: быстрый поиск по ключу и проверка val, ok</div>
          <div class="qw-controls">
            <input type="text" id="mapKey" placeholder="Ключ (имя)" value="Omar" style="width:110px;padding:6px 10px;background:#17151c;border:1px solid var(--line);border-radius:4px;color:#fff">
            <input type="number" id="mapVal" placeholder="Значение" value="100" style="width:90px;padding:6px 10px;background:#17151c;border:1px solid var(--line);border-radius:4px;color:#fff">
            <button class="btn small on" id="mapSet">m[k] = v</button>
            <button class="btn small" id="mapGet">val, ok := m[k]</button>
            <button class="btn ghost small" id="mapDel">delete(m, k)</button>
          </div>
        </div>
        <div id="mapItems" style="display:flex;gap:10px;flex-wrap:wrap;margin:16px 0"></div>
        <div class="ptr-log" id="mapLog" style="line-height:1.5">Вводите ключ и значение или проверяйте существование ключа кнопкой <code>val, ok := m[k]</code>.</div>
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
        itemsEl.innerHTML = `<span style="color:var(--dim);font:13px var(--mono)">Мап пуст: make(map[string]int)</span>`;
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
      logEl.innerHTML = `Записано: <code>m["${k}"] = ${v}</code>. Поиск по ключу в мапе происходит мгновенно O(1)!`;
    };

    document.getElementById("mapGet").onclick = () => {
      const k = keyInp.value.trim();
      if (!k) return;
      if (k in data) {
        render(k);
        logEl.innerHTML = `Поиск: <code>val, ok := m["${k}"]</code> &rarr; <b>val = ${data[k]}</b>, <b style="color:var(--ok)">ok = true</b> (ключ найден в словаре!).`;
      } else {
        render();
        logEl.innerHTML = `Поиск: <code>val, ok := m["${k}"]</code> &rarr; <b>val = 0</b> (нулевое значение типа int), <b style="color:var(--bad)">ok = false</b> (такого ключа в мапе нет!).`;
      }
    };

    document.getElementById("mapDel").onclick = () => {
      const k = keyInp.value.trim();
      if (k in data) {
        delete data[k];
        render();
        logEl.innerHTML = `Удалено: <code>delete(m, "${k}")</code>. Запись стёрта из памяти мапа.`;
      } else {
        logEl.innerHTML = `Ключ <code>"${k}"</code> не найден для удаления. В Go функция delete() на несуществующий ключ не падает с ошибкой, а просто ничего не делает.`;
      }
    };

    render();
  }

  // ==========================================
  // ТЕМА 20: JSON Marshal / Unmarshal
  // ==========================================
  function initJsonViz() {
    const el = document.getElementById("topicWidgetArea") || document.getElementById("piscineWidgetArea");
    if (!el) return;

    el.innerHTML = `
      <div class="quad-widget">
        <div class="qw-header">
          <div class="qw-title">📦 Конвертер Go Struct ⇄ JSON (json.Marshal / json.Unmarshal)</div>
        </div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:10px">
          <div style="flex:1;min-width:260px;background:#141318;border:1px solid var(--line);border-radius:4px;padding:14px">
            <div style="font:600 13px var(--mono);color:var(--accent-l);margin-bottom:10px">1. Структура в Go (тип Todo):</div>
            <label style="display:block;font:500 11px var(--mono);color:var(--muted);margin-bottom:4px">ID (int):</label>
            <input type="number" id="jsId" value="1" style="width:100%;padding:6px 10px;background:#1a1820;border:1px solid var(--line);border-radius:4px;color:#fff;margin-bottom:8px">
            <label style="display:block;font:500 11px var(--mono);color:var(--muted);margin-bottom:4px">Title (string):</label>
            <input type="text" id="jsTitle" value="Пройти 01 Edu Piscine" style="width:100%;padding:6px 10px;background:#1a1820;border:1px solid var(--line);border-radius:4px;color:#fff;margin-bottom:8px">
            <label style="display:flex;align-items:center;gap:8px;font:500 12px var(--mono);color:#fff;margin-top:4px;cursor:pointer">
              <input type="checkbox" id="jsDone" checked> Done (bool)
            </label>
          </div>
          <div style="flex:1;min-width:260px;background:#141318;border:1px solid var(--line);border-radius:4px;padding:14px">
            <div style="font:600 13px var(--mono);color:var(--ok);margin-bottom:10px">2. Текст JSON (выход json.Marshal):</div>
            <pre id="jsOut" style="background:#1a1820;border:1px solid var(--line);border-radius:4px;padding:12px;font:13px var(--mono);color:#fff;margin:0;min-height:90px"></pre>
            <div style="font-size:12px;color:var(--dim);margin-top:8px">Обратите внимание: поля структуры написаны с большой буквы (<code>Title</code>), а в JSON стали маленькими (<code>"title"</code>) благодаря тегам <code>\`json:"title"\`</code>!</div>
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
  function initApiViz() {
    const el = document.getElementById("topicWidgetArea") || document.getElementById("piscineWidgetArea");
    if (!el) return;

    el.innerHTML = `
      <div class="quad-widget">
        <div class="qw-header">
          <div class="qw-title">🚀 Интерактивный REST API Клиент (Мини-Postman)</div>
          <div class="qw-controls">
            <select id="apiMethod" style="padding:6px 10px;font:600 12px var(--mono);background:#17151c;border:1px solid var(--line);border-radius:4px;color:var(--accent-l)">
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input type="text" id="apiUrl" value="/todos" style="padding:6px 10px;font:13px var(--mono);background:#17151c;border:1px solid var(--line);border-radius:4px;color:#fff;width:180px">
            <button class="btn small on" id="apiSend">Отправить запрос &rarr;</button>
          </div>
        </div>
        <div id="apiBodyWrap" style="display:none;margin-top:10px">
          <label style="font:500 11px var(--mono);color:var(--muted)">Тело запроса (JSON body):</label>
          <input type="text" id="apiPostTitle" value="Новая задача" style="padding:6px 10px;font:13px var(--mono);background:#17151c;border:1px solid var(--line);border-radius:4px;color:#fff;width:100%;margin-top:4px">
        </div>
        <div style="background:#141318;border:1px solid var(--line);border-radius:4px;padding:12px;margin-top:14px;font:13px var(--mono)" id="apiRespBox">
          <span style="color:var(--dim)">Нажмите «Отправить запрос», чтобы отправить HTTP-запрос к виртуальному серверу Go.</span>
        </div>
      </div>
    `;

    const todos = [
      { id: 1, title: "Изучить основы Go", done: true },
      { id: 2, title: "Пройти Piscine", done: false }
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

      respBox.innerHTML = `<span style="color:var(--accent-l)">Отправка HTTP ${m} ${url}...</span>`;

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
          const newT = { id: todos.length + 1, title: postTitle.value || "Без названия", done: false };
          todos.push(newT);
          respBox.innerHTML = `
            <div style="display:flex;justify-content:space-between;margin-bottom:8px">
              <span class="qw-badge ok">HTTP/1.1 201 Created</span>
              <span style="color:var(--dim)">Content-Type: application/json</span>
            </div>
            <pre style="margin:0;color:#fff">${JSON.stringify({ status: "created", item: newT }, null, 2)}</pre>
            <div style="margin-top:8px;color:var(--ok)">✓ Дело добавлено в список! Переключите метод на GET /todos, чтобы увидеть обновленный список.</div>
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
  function initSqlViz() {
    const el = document.getElementById("topicWidgetArea") || document.getElementById("piscineWidgetArea");
    if (!el) return;

    el.innerHTML = `
      <div class="quad-widget">
        <div class="qw-header">
          <div class="qw-title">🗄️ Интерактивная база данных SQLite: таблица todos</div>
          <div class="qw-controls">
            <button class="btn small on" id="sqlSelAll">SELECT * FROM todos</button>
            <button class="btn small" id="sqlSelDone">WHERE done = 1</button>
            <button class="btn small" id="sqlInsert">INSERT INTO todos</button>
            <button class="btn ghost small" id="sqlReset">Сброс таблицы</button>
          </div>
        </div>
        <div style="margin:14px 0;overflow-x:auto">
          <table class="rw-table" id="sqlTable">
            <thead><tr><th>ID (INTEGER PRIMARY KEY)</th><th>TITLE (TEXT)</th><th>DONE (BOOLEAN)</th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
        <div class="ptr-log" id="sqlLog" style="line-height:1.5">Кликайте по кнопкам SQL-запросов выше, чтобы увидеть, как выполняются команды базы данных.</div>
      </div>
    `;

    let rows = [
      { id: 1, title: "Изучить Go синтаксис", done: 1 },
      { id: 2, title: "Решить QuadA и QuadB", done: 1 },
      { id: 3, title: "Написать REST API сервер", done: 0 }
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
        log.innerHTML = `Выполнен запрос: <code>${query}</code> &rarr; возвращено <b>${activeRows.length}</b> строк(и).`;
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
      const newRow = { id: rows.length + 1, title: "Сдать финальный проект", done: 0 };
      rows.push(newRow);
      render(rows, `INSERT INTO todos (title, done) VALUES ('${newRow.title}', 0);`);
    };

    document.getElementById("sqlReset").onclick = () => {
      rows = [
        { id: 1, title: "Изучить Go синтаксис", done: 1 },
        { id: 2, title: "Решить QuadA и QuadB", done: 1 },
        { id: 3, title: "Написать REST API сервер", done: 0 }
      ];
      render(rows, "-- Таблица сброшена к исходному состоянию");
    };

    render(rows);
  }
})();

