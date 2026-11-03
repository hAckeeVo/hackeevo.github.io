// tools/piscine_quests_widgets.js
// 6 Interactive simulators for Piscine Quests 05, 06, 07, 08, 09, 10
// Fully localized (RU / KZ) with reactive controls and step-by-step animations

(function () {
  // --- 1. Topic 20: String & ASCII Scanner (Quest 05) ---
  function initStringViz(container) {
    const el = container || document.getElementById("piscineWidgetArea") || document.getElementById("topicWidgetArea");
    if (!el) return;
    const isKZ = (window.getLang && window.getLang()) === "kz";

    el.innerHTML = `
      <div class="quad-widget">
        <div class="qw-header">
          <div class="qw-title">🔤 ${isKZ ? "Жолдар мен ASCII сканері (Quest 05: Capitalize & Index)" : "Интерактивный сканер строк и ASCII (Quest 05: Capitalize & Index)"}</div>
          <div class="qw-controls">
            <input type="text" id="strInput" value="hello+world 42school-is_cool" style="width:260px;padding:5px 8px;font:13px var(--mono);background:#1a1922;border:1px solid var(--line);border-radius:4px;color:#fff" placeholder="${isKZ ? "Мәтін енгізіңіз..." : "Введите строку..."}">
            <div class="qw-btns">
              <button class="btn small on" id="btnCap">Capitalize</button>
              <button class="btn ghost small" id="btnUpper">ToUpper</button>
              <button class="btn ghost small" id="btnLower">ToLower</button>
              <button class="btn small" id="btnPlayScan">▶ ${isKZ ? "Қадам бойынша сканер" : "Шаг за шагом"}</button>
            </div>
          </div>
        </div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:14px">
          <div style="flex:2;min-width:320px;background:#141318;border:1px solid var(--line);border-radius:4px;padding:12px;overflow-x:auto" id="strTableArea"></div>
          <div style="flex:1;min-width:240px;background:rgba(0,0,0,.25);border:1px solid var(--line);border-radius:4px;padding:14px" id="strResultArea"></div>
        </div>
      </div>
    `;

    const inp = document.getElementById("strInput");
    const tableArea = document.getElementById("strTableArea");
    const resArea = document.getElementById("strResultArea");
    let animId = null;

    const renderTable = (highlightIdx = -1, overrideChars = null) => {
      const s = overrideChars ? overrideChars.join("") : inp.value;
      const chars = overrideChars || s.split("");
      let html = `<div style="font:11px var(--mono);color:var(--muted);margin-bottom:8px">${isKZ ? "Символдар кестесі (ASCII кодтары және бөлгіштер):" : "Таблица символов (ASCII коды и разделители):"}</div>`;
      html += `<div style="display:flex;flex-wrap:wrap;gap:4px">`;
      chars.forEach((c, i) => {
        const code = c.charCodeAt(0);
        const isAlpha = (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
        const isNum = (code >= 48 && code <= 57);
        const isDelim = !isAlpha && !isNum;
        const isHL = (i === highlightIdx);

        let bg = isDelim ? "rgba(255,107,107,0.15)" : isAlpha ? "rgba(153,105,255,0.15)" : "rgba(79,209,139,0.15)";
        let border = isDelim ? "#ff6b6b" : isAlpha ? "var(--accent)" : "var(--ok)";
        if (isHL) { bg = "var(--accent)"; border = "#fff"; }

        html += `
          <div style="display:flex;flex-direction:column;align-items:center;background:${bg};border:1px solid ${border};border-radius:4px;padding:4px 6px;min-width:32px;font:var(--mono);cursor:default">
            <span style="font-size:10px;color:var(--dim)">#${i}</span>
            <span style="font-size:15px;font-weight:700;color:${isHL ? '#fff' : (isDelim ? '#ff8e8e' : '#fff')}">${c === ' ' ? '␣' : c}</span>
            <span style="font-size:10px;color:var(--muted)">${code}</span>
          </div>
        `;
      });
      html += `</div>`;
      tableArea.innerHTML = html;
    };

    const updateInfo = (text, outputStr) => {
      resArea.innerHTML = `
        <div style="font:700 13px var(--mono);color:var(--accent);margin-bottom:8px">📊 ${isKZ ? "Талдау нәтижесі" : "Результат анализа"}</div>
        <p style="font-size:13px;line-height:1.5;margin:0 0 10px">${text}</p>
        <div style="background:#1a1922;border:1px solid var(--line);border-radius:4px;padding:8px;font:13px var(--mono);color:var(--ok)">
          ${isKZ ? "Нәтиже:" : "Вывод:"} <span style="color:#fff">${outputStr}</span>
        </div>
      `;
    };

    const doCapitalize = () => {
      const s = inp.value;
      const chars = s.split("");
      let isNew = true;
      for (let i = 0; i < chars.length; i++) {
        const c = chars[i];
        const code = c.charCodeAt(0);
        const isAlphaNum = (code >= 65 && code <= 90) || (code >= 97 && code <= 122) || (code >= 48 && code <= 57);
        if (isAlphaNum) {
          if (isNew) {
            chars[i] = c.toUpperCase();
            isNew = false;
          } else {
            chars[i] = c.toLowerCase();
          }
        } else {
          isNew = true;
        }
      }
      renderTable(-1, chars);
      updateInfo(
        isKZ ? "Барлық сөздердің бірінші әрпі бас әріп жасалды. Бөлгіштер (-, +, _, бос орын) сөзді бастау сигналын берді."
             : "Каждое слово капитализировано. Разделители (+, -, _, пробел) дали сигнал начала нового слова.",
        chars.join("")
      );
    };

    inp.oninput = () => { renderTable(); doCapitalize(); };
    document.getElementById("btnCap").onclick = doCapitalize;
    document.getElementById("btnUpper").onclick = () => {
      const up = inp.value.toUpperCase();
      renderTable(-1, up.split(""));
      updateInfo(isKZ ? "Барлық әріптер бас әріпке ауыстырылды (ASCII - 32)." : "Все символы переведены в верхний регистр (ASCII - 32).", up);
    };
    document.getElementById("btnLower").onclick = () => {
      const low = inp.value.toLowerCase();
      renderTable(-1, low.split(""));
      updateInfo(isKZ ? "Барлық әріптер кіші әріпке ауыстырылды (ASCII + 32)." : "Все символы переведены в нижний регистр (ASCII + 32).", low);
    };

    document.getElementById("btnPlayScan").onclick = () => {
      clearInterval(animId);
      let idx = 0;
      const chars = inp.value.split("");
      animId = setInterval(() => {
        if (idx >= chars.length) {
          clearInterval(animId);
          renderTable();
          return;
        }
        renderTable(idx);
        const c = chars[idx];
        const code = c.charCodeAt(0);
        const isAlphaNum = (code >= 65 && code <= 90) || (code >= 97 && code <= 122) || (code >= 48 && code <= 57);
        updateInfo(
          isKZ ? `Символ #${idx}: '${c === ' ' ? 'бос орын' : c}' (ASCII ${code}). Түрі: ${isAlphaNum ? 'Әріп немесе сан' : 'Бөлгіш (жаңа сөз басталады)'}`
               : `Символ #${idx}: '${c === ' ' ? 'пробел' : c}' (ASCII ${code}). Тип: ${isAlphaNum ? 'Буква/Цифра' : 'Разделитель (слово завершилось)'}`,
          inp.value.slice(0, idx + 1)
        );
        idx++;
      }, 300);
    };

    renderTable();
    doCapitalize();
  }

  // --- 2. Topic 21: CLI Arguments Terminal (Quest 06) ---
  function initArgsViz(container) {
    const el = container || document.getElementById("piscineWidgetArea") || document.getElementById("topicWidgetArea");
    if (!el) return;
    const isKZ = (window.getLang && window.getLang()) === "kz";

    el.innerHTML = `
      <div class="quad-widget">
        <div class="qw-header">
          <div class="qw-title">💻 ${isKZ ? "Консоль терминалы және os.Args (Quest 06)" : "Интерактивный терминал CLI и os.Args (Quest 06)"}</div>
          <div class="qw-controls">
            <span style="font:12px var(--mono);color:var(--dim)">$ ./main</span>
            <input type="text" id="cliArgsInput" value="orange apple banana 42" style="width:240px;padding:4px 8px;font:13px var(--mono);background:#1a1922;border:1px solid var(--line);border-radius:4px;color:#fff">
            <div class="qw-btns">
              <button class="btn small on" id="btnPrintParams">PrintParams</button>
              <button class="btn ghost small" id="btnRevParams">RevParams</button>
              <button class="btn small" id="btnSortParams">⚡ SortParams</button>
            </div>
          </div>
        </div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:14px">
          <div style="flex:2;min-width:320px;background:#141318;border:1px solid var(--line);border-radius:4px;padding:12px" id="argsSliceArea"></div>
          <div style="flex:1;min-width:240px;background:#0f0e13;border:1px solid var(--line);border-radius:4px;padding:14px;font:13px var(--mono)" id="terminalOutput"></div>
        </div>
      </div>
    `;

    const inp = document.getElementById("cliArgsInput");
    const sliceArea = document.getElementById("argsSliceArea");
    const termOut = document.getElementById("terminalOutput");

    const getArgs = () => {
      const raw = inp.value.trim();
      const userArgs = raw ? raw.split(/\s+/) : [];
      return ["./main", ...userArgs];
    };

    const renderSlice = (activeIdx = -1) => {
      const args = getArgs();
      let html = `<div style="font:11px var(--mono);color:var(--muted);margin-bottom:8px">${isKZ ? "os.Args тілімі жадыда (0-индекс әрқашан бағдарлама аты):" : "Срез os.Args в памяти (индекс 0 — всегда имя программы):"}</div><div style="display:flex;flex-wrap:wrap;gap:8px">`;
      args.forEach((arg, i) => {
        const isProg = (i === 0);
        const isHL = (i === activeIdx);
        html += `
          <div style="background:${isProg ? 'rgba(255,107,107,0.15)' : isHL ? 'var(--accent)' : 'rgba(153,105,255,0.12)'};border:1px solid ${isProg ? '#ff6b6b' : isHL ? '#fff' : 'var(--accent)'};border-radius:4px;padding:6px 10px;font:var(--mono)">
            <div style="font-size:10px;color:var(--dim)">os.Args[${i}]</div>
            <div style="font-size:14px;font-weight:700;color:#fff">${arg}</div>
            <div style="font-size:10px;color:${isProg ? '#ff8e8e' : 'var(--ok)'}">${isProg ? (isKZ ? 'Бағдарлама' : 'Бинарник') : (isKZ ? 'Аргумент' : 'Параметр')}</div>
          </div>
        `;
      });
      html += `</div>`;
      sliceArea.innerHTML = html;
    };

    const showTerm = (lines, title) => {
      termOut.innerHTML = `
        <div style="color:var(--accent);font-weight:700;margin-bottom:6px">❯ ${title}</div>
        <pre style="margin:0;color:#4fd18b;white-space:pre-wrap">${lines.join("\n") || (isKZ ? "<бос шығару>" : "<пустой вывод>")}</pre>
      `;
    };

    inp.oninput = () => { renderSlice(); document.getElementById("btnPrintParams").click(); };

    document.getElementById("btnPrintParams").onclick = () => {
      renderSlice();
      const args = getArgs().slice(1);
      showTerm(args, "PrintParams");
    };

    document.getElementById("btnRevParams").onclick = () => {
      renderSlice();
      const args = getArgs().slice(1).reverse();
      showTerm(args, "RevParams (reverse)");
    };

    document.getElementById("btnSortParams").onclick = () => {
      const args = getArgs().slice(1);
      args.sort();
      renderSlice();
      showTerm(args, "SortParams (ASCII sort)");
    };

    renderSlice();
    document.getElementById("btnPrintParams").click();
  }

  // --- 3. Topic 22: Slice Allocation & Split (Quest 07) ---
  function initSplitViz(container) {
    const el = container || document.getElementById("piscineWidgetArea") || document.getElementById("topicWidgetArea");
    if (!el) return;
    const isKZ = (window.getLang && window.getLang()) === "kz";

    el.innerHTML = `
      <div class="quad-widget">
        <div class="qw-header">
          <div class="qw-title">🧬 ${isKZ ? "Тілім жадысы және Split (Quest 07)" : "Рентген памяти срезов и Split (Quest 07)"}</div>
          <div class="qw-controls">
            <label>Min: <input type="number" id="spMin" value="5" style="width:50px;background:#1a1922;color:#fff;border:1px solid var(--line);padding:3px"></label>
            <label>Max: <input type="number" id="spMax" value="10" style="width:50px;background:#1a1922;color:#fff;border:1px solid var(--line);padding:3px"></label>
            <div class="qw-btns">
              <button class="btn small on" id="btnTestRange">AppendRange vs MakeRange</button>
            </div>
          </div>
        </div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:14px">
          <div style="flex:1;min-width:280px;background:#141318;border:1px solid var(--line);border-radius:4px;padding:12px" id="rangeMemoryArea"></div>
          <div style="flex:1;min-width:280px;background:rgba(0,0,0,.25);border:1px solid var(--line);border-radius:4px;padding:14px" id="rangeStatusArea"></div>
        </div>
      </div>
    `;

    const minInp = document.getElementById("spMin");
    const maxInp = document.getElementById("spMax");
    const memArea = document.getElementById("rangeMemoryArea");
    const statArea = document.getElementById("rangeStatusArea");

    const update = () => {
      const min = parseInt(minInp.value, 10) || 0;
      const max = parseInt(maxInp.value, 10) || 0;

      if (min >= max) {
        memArea.innerHTML = `
          <div style="background:rgba(255,107,107,0.15);border:2px dashed #ff6b6b;border-radius:6px;padding:16px;text-align:center;font:var(--mono)">
            <div style="font-size:24px;color:#ff6b6b">nil (pointer = 0x0)</div>
            <div style="font-size:12px;color:var(--muted);margin-top:6px">len = 0 &middot; cap = 0</div>
          </div>
        `;
        statArea.innerHTML = `
          <div style="color:#ff6b6b;font-weight:700;margin-bottom:6px">⚠️ Edge Case: min >= max (${min} >= ${max})</div>
          <p style="font-size:13px;line-height:1.5">${isKZ ? "01 Edu стандарттары бойынша min >= max кезінде функция қатаң түрде <b>nil</b> қайтаруы тиіс! Бос тілім емес." : "По стандартам 01 Edu при min >= max функция обязана возвращать именно <b>nil</b>! Не пустой срез."}</p>
          <code style="color:var(--ok)">return nil // ✓ 100% test passed</code>
        `;
      } else {
        const size = max - min;
        let cells = "";
        for (let i = 0; i < size; i++) {
          cells += `<div style="background:rgba(79,209,139,0.15);border:1px solid var(--ok);border-radius:4px;padding:6px 10px;text-align:center;min-width:32px"><span style="font:700 15px var(--mono);color:#fff">${min + i}</span></div>`;
        }
        memArea.innerHTML = `
          <div style="font:11px var(--mono);color:var(--muted);margin-bottom:8px">Срез []int (len = ${size}, cap = ${size}):</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">${cells}</div>
        `;
        statArea.innerHTML = `
          <div style="color:var(--ok);font-weight:700;margin-bottom:6px">✓ ${isKZ ? "Жады толық бөлінді" : "Память выделена корректно"}</div>
          <p style="font-size:13px;line-height:1.5">${isKZ ? `Диапазон [${min}..${max - 1}]. Элементтер саны: ${size}. MakeRange бұл жадыны 1 командамен (make([]int, ${size})) бөледі.` : `Диапазон от ${min} до ${max - 1}. Количество: ${size}. Функция MakeRange делает это за 1 аллокацию make([]int, ${size}).`}</p>
          <code style="color:var(--accent)">make([]int, ${size}) // 0 реаллокаций</code>
        `;
      }
    };

    minInp.oninput = update;
    maxInp.oninput = update;
    document.getElementById("btnTestRange").onclick = update;
    update();
  }

  // --- 4. Topic 23: Virtual File System & DisplayFile (Quest 08) ---
  function initFileViz(container) {
    const el = container || document.getElementById("piscineWidgetArea") || document.getElementById("topicWidgetArea");
    if (!el) return;
    const isKZ = (window.getLang && window.getLang()) === "kz";

    const VFS = {
      "hello.txt": "Hello from 01 Edu Piscine!\nWelcome to programming in Go.",
      "quest08.go": "package main\n\nfunc main() {\n    // Code for Quest 08\n}",
      "notes.md": "# Student Survival Guide\nNever panic, always read compiler errors."
    };

    el.innerHTML = `
      <div class="quad-widget">
        <div class="qw-header">
          <div class="qw-title">📁 ${isKZ ? "Виртуалды файлдық жүйе және DisplayFile (Quest 08)" : "Виртуальная файловая система и DisplayFile (Quest 08)"}</div>
          <div class="qw-controls">
            <span style="font:12px var(--mono);color:var(--dim)">$ ./displayfile</span>
            <input type="text" id="dfArgsInp" value="hello.txt" style="width:180px;padding:4px 8px;font:13px var(--mono);background:#1a1922;border:1px solid var(--line);border-radius:4px;color:#fff">
            <button class="btn small on" id="btnRunDf">▶ Run</button>
            <button class="btn ghost small" id="btnDfNoArg">${isKZ ? "Аргументсіз" : "Без аргументов"}</button>
            <button class="btn ghost small" id="btnDfMany">${isKZ ? "2 файл" : "2 файла"}</button>
          </div>
        </div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:14px">
          <div style="flex:1;min-width:240px;background:#141318;border:1px solid var(--line);border-radius:4px;padding:12px" id="vfsArea"></div>
          <div style="flex:2;min-width:300px;background:#0f0e13;border:1px solid var(--line);border-radius:4px;padding:14px;font:13px var(--mono)" id="dfConsoleOut"></div>
        </div>
      </div>
    `;

    const inp = document.getElementById("dfArgsInp");
    const vfsArea = document.getElementById("vfsArea");
    const outArea = document.getElementById("dfConsoleOut");

    const renderVFS = () => {
      let html = `<div style="font:11px var(--mono);color:var(--muted);margin-bottom:8px">${isKZ ? "Файлдар каталогы:" : "Файлы в текущей папке:"}</div>`;
      Object.keys(VFS).forEach(name => {
        html += `
          <div style="display:flex;align-items:center;gap:8px;padding:6px;border-radius:4px;background:rgba(255,255,255,0.04);margin-bottom:4px;cursor:pointer" onclick="document.getElementById('dfArgsInp').value='${name}';document.getElementById('btnRunDf').click()">
            <span>📄</span>
            <span style="font:600 13px var(--mono);color:var(--accent)">${name}</span>
          </div>
        `;
      });
      vfsArea.innerHTML = html;
    };

    const run = () => {
      const raw = inp.value.trim();
      const args = raw ? raw.split(/\s+/) : [];

      if (args.length === 0) {
        outArea.innerHTML = `<span style="color:#ff6b6b">File name missing</span>\n<div style="color:var(--dim);margin-top:8px">// 01 Edu test: 0 аргументов -> 'File name missing\\n'</div>`;
      } else if (args.length > 1) {
        outArea.innerHTML = `<span style="color:#ff6b6b">Too many arguments</span>\n<div style="color:var(--dim);margin-top:8px">// 01 Edu test: >1 аргумента -> 'Too many arguments\\n'</div>`;
      } else {
        const fname = args[0];
        if (VFS[fname]) {
          outArea.innerHTML = `<span style="color:#4fd18b">${VFS[fname].replace(/\n/g, '<br>')}</span>`;
        } else {
          outArea.innerHTML = `<span style="color:#ff6b6b">Cannot read file</span>\n<div style="color:var(--dim);margin-top:8px">// 01 Edu test: файл не найден -> 'Cannot read file\\n'</div>`;
        }
      }
    };

    document.getElementById("btnRunDf").onclick = run;
    document.getElementById("btnDfNoArg").onclick = () => { inp.value = ""; run(); };
    document.getElementById("btnDfMany").onclick = () => { inp.value = "hello.txt notes.md"; run(); };

    renderVFS();
    run();
  }

  // --- 5. Topic 24: Function Pipeline & DoOp (Quest 09) ---
  function initDoOpViz(container) {
    const el = container || document.getElementById("piscineWidgetArea") || document.getElementById("topicWidgetArea");
    if (!el) return;
    const isKZ = (window.getLang && window.getLang()) === "kz";

    el.innerHTML = `
      <div class="quad-widget">
        <div class="qw-header">
          <div class="qw-title">🧮 ${isKZ ? "Функциялар конвейері және DoOp калькуляторы (Quest 09)" : "Конвейер функций и калькулятор DoOp (Quest 09)"}</div>
          <div class="qw-controls">
            <input type="number" id="doopA" value="42" style="width:60px;padding:4px;font:13px var(--mono);background:#1a1922;color:#fff;border:1px solid var(--line);border-radius:4px">
            <select id="doopOp" style="padding:4px 8px;font:700 13px var(--mono);background:#1a1922;color:#fff;border:1px solid var(--line);border-radius:4px">
              <option value="+">+</option>
              <option value="-">-</option>
              <option value="*">*</option>
              <option value="/" selected>/</option>
              <option value="%">%</option>
            </select>
            <input type="number" id="doopB" value="0" style="width:60px;padding:4px;font:13px var(--mono);background:#1a1922;color:#fff;border:1px solid var(--line);border-radius:4px">
            <button class="btn small on" id="btnRunDoOp">DoOp ▶</button>
          </div>
        </div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:14px">
          <div style="flex:1;min-width:280px;background:#141318;border:1px solid var(--line);border-radius:4px;padding:12px" id="doopPipelineArea"></div>
          <div style="flex:1;min-width:280px;background:#0f0e13;border:1px solid var(--line);border-radius:4px;padding:14px;font:13px var(--mono)" id="doopResultArea"></div>
        </div>
      </div>
    `;

    const aInp = document.getElementById("doopA");
    const opInp = document.getElementById("doopOp");
    const bInp = document.getElementById("doopB");
    const pipeArea = document.getElementById("doopPipelineArea");
    const resArea = document.getElementById("doopResultArea");

    const calculate = () => {
      const a = parseInt(aInp.value, 10) || 0;
      const op = opInp.value;
      const b = parseInt(bInp.value, 10) || 0;

      pipeArea.innerHTML = `
        <div style="font:11px var(--mono);color:var(--muted);margin-bottom:8px">Выражение: <code>${a} ${op} ${b}</code></div>
        <div style="display:flex;align-items:center;gap:10px;font:var(--mono);font-size:16px;font-weight:700">
          <span style="background:rgba(153,105,255,0.2);padding:6px 10px;border-radius:4px;color:#fff">${a}</span>
          <span style="color:var(--accent)">${op}</span>
          <span style="background:${b === 0 && (op === '/' || op === '%') ? 'rgba(255,107,107,0.3);border:1px solid #ff6b6b' : 'rgba(153,105,255,0.2)'};padding:6px 10px;border-radius:4px;color:#fff">${b}</span>
        </div>
      `;

      if (op === "/" && b === 0) {
        resArea.innerHTML = `
          <div style="color:#ff6b6b;font-weight:700">No division by 0</div>
          <div style="color:var(--dim);margin-top:6px">// Деление на ноль перехвачено! Без паники.</div>
        `;
      } else if (op === "%" && b === 0) {
        resArea.innerHTML = `
          <div style="color:#ff6b6b;font-weight:700">No modulo by 0</div>
          <div style="color:var(--dim);margin-top:6px">// Деление по модулю на ноль перехвачено!</div>
        `;
      } else {
        let res = 0;
        if (op === "+") res = a + b;
        else if (op === "-") res = a - b;
        else if (op === "*") res = a * b;
        else if (op === "/") res = Math.floor(a / b);
        else if (op === "%") res = a % b;

        resArea.innerHTML = `
          <div style="color:var(--ok);font-size:18px;font-weight:700">${res}</div>
          <div style="color:var(--dim);margin-top:6px">// Операция выполнена успешно.</div>
        `;
      }
    };

    aInp.oninput = calculate;
    opInp.onchange = calculate;
    bInp.oninput = calculate;
    document.getElementById("btnRunDoOp").onclick = calculate;
    calculate();
  }

  // --- 6. Topic 25: Bitwise X-Ray & Collatz (Quest 10) ---
  function initBitsViz(container) {
    const el = container || document.getElementById("piscineWidgetArea") || document.getElementById("topicWidgetArea");
    if (!el) return;
    const isKZ = (window.getLang && window.getLang()) === "kz";

    el.innerHTML = `
      <div class="quad-widget">
        <div class="qw-header">
          <div class="qw-title">⚡ ${isKZ ? "Биттік рентген және Коллатц (Quest 10)" : "Битовый рентген и Симулятор Коллатца (Quest 10)"}</div>
          <div class="qw-controls">
            <label>${isKZ ? "Сан:" : "Число:"} <input type="number" id="bitNumInp" value="15" min="0" max="255" style="width:70px;background:#1a1922;color:#fff;border:1px solid var(--line);padding:3px"></label>
            <button class="btn small on" id="btnCollatzPlay">▶ ${isKZ ? "Коллатц 3n+1 қадамдары" : "Траектория 3n+1"}</button>
          </div>
        </div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:14px">
          <div style="flex:1;min-width:300px;background:#141318;border:1px solid var(--line);border-radius:4px;padding:12px" id="bitsArea"></div>
          <div style="flex:1;min-width:280px;background:rgba(0,0,0,.25);border:1px solid var(--line);border-radius:4px;padding:14px" id="collatzArea"></div>
        </div>
      </div>
    `;

    const numInp = document.getElementById("bitNumInp");
    const bitsArea = document.getElementById("bitsArea");
    const colArea = document.getElementById("collatzArea");

    const updateBits = () => {
      let n = parseInt(numInp.value, 10);
      if (isNaN(n) || n < 0) n = 0;
      let activeCount = 0;
      let bitsHtml = `<div style="font:11px var(--mono);color:var(--muted);margin-bottom:8px">${isKZ ? "Двоичный рентген (8 бит):" : "Двоичный рентген (8 бит):"}</div><div style="display:flex;gap:4px">`;

      for (let i = 7; i >= 0; i--) {
        const bit = (n >> i) & 1;
        if (bit === 1) activeCount++;
        bitsHtml += `
          <div style="flex:1;text-align:center;padding:8px 0;background:${bit ? 'rgba(79,209,139,0.2)' : 'rgba(255,255,255,0.05)'};border:1px solid ${bit ? 'var(--ok)' : 'var(--line)'};border-radius:4px;font:700 16px var(--mono);color:${bit ? '#4fd18b' : 'var(--dim)'}">
            ${bit}
            <div style="font-size:9px;font-weight:400;color:var(--dim);margin-top:2px">2^${i}</div>
          </div>
        `;
      }
      bitsHtml += `</div>`;
      bitsHtml += `
        <div style="margin-top:10px;font:13px var(--mono);color:var(--ok)">
          ActiveBits(${n}) = <b>${activeCount}</b> ${isKZ ? "бірлік бит" : "активных бит(а)"}
        </div>
      `;
      bitsArea.innerHTML = bitsHtml;
    };

    const runCollatz = () => {
      let n = parseInt(numInp.value, 10) || 1;
      if (n <= 0) {
        colArea.innerHTML = `<span style="color:#ff6b6b">0 шагов (start <= 0)</span>`;
        return;
      }
      const steps = [];
      let cur = n;
      while (cur > 1 && steps.length < 50) {
        steps.push(cur);
        if (cur % 2 === 0) cur /= 2;
        else cur = cur * 3 + 1;
      }
      steps.push(1);

      colArea.innerHTML = `
        <div style="color:var(--accent);font-weight:700;margin-bottom:6px">Коллатц: ${n} &rarr; 1 (${steps.length - 1} шагов)</div>
        <div style="font:12px var(--mono);color:var(--muted);max-height:100px;overflow-y:auto;white-space:pre-wrap">
          ${steps.join(" &rarr; ")}
        </div>
      `;
    };

    numInp.oninput = () => { updateBits(); runCollatz(); };
    document.getElementById("btnCollatzPlay").onclick = runCollatz;
    updateBits();
    runCollatz();
  }

  // Export renderers to window
  window.initStringViz = initStringViz;
  window.initArgsViz = initArgsViz;
  window.initSplitViz = initSplitViz;
  window.initFileViz = initFileViz;
  window.initDoOpViz = initDoOpViz;
  window.initBitsViz = initBitsViz;
})();

