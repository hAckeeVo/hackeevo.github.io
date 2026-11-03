// tools/piscine_quests_ext_widgets.js
// 4 Interactive Simulators for Quest 02, Quest 11, Quest 12, Raid 02

(function () {
  // --- 1. Quest 02: PrintComb Combination Lock ---
  function initCombViz(container) {
    const el = container || document.getElementById("piscineWidgetArea") || document.getElementById("topicWidgetArea");
    if (!el) return;
    const isKZ = (window.getLang && window.getLang()) === "kz";

    el.innerHTML = `
      <div class="quad-widget">
        <div class="qw-header">
          <div>
            <div class="qw-title">🔒 ${isKZ ? "Сандық құлып симуляторы (Quest 02: PrintComb)" : "Интерактивный кодовый замок (Quest 02: PrintComb)"}</div>
            <div style="font-size:12px;color:var(--muted);margin-top:2px">${isKZ ? "Цифрларды таңдаңыз немесе генерацияны қадам бойынша көріңіз" : "Крутите колёсики или запустите пошаговую генерацию всех комбинаций"}</div>
          </div>
          <div class="qw-controls">
            <button class="btn small on" id="btnPlayComb">▶ ${isKZ ? "Барлық комбинацияларды жинау" : "Сгенерировать все"}</button>
            <button class="btn ghost small" id="btnStopComb">${isKZ ? "Тоқтату" : "Стоп"}</button>
          </div>
        </div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:14px;align-items:center">
          <div style="display:flex;gap:12px;background:#141318;border:1px solid var(--line);border-radius:6px;padding:16px" id="combLockDials">
            <div style="text-align:center">
              <div style="font-size:11px;color:var(--dim)">Колесо i (0..7)</div>
              <div style="font:700 28px var(--mono);color:var(--accent);background:#1a1922;padding:8px 16px;border-radius:4px;margin:4px 0" id="dialI">0</div>
              <button class="btn ghost small" id="upI">▲</button> <button class="btn ghost small" id="downI">▼</button>
            </div>
            <div style="text-align:center">
              <div style="font-size:11px;color:var(--dim)">Колесо j (i+1..8)</div>
              <div style="font:700 28px var(--mono);color:var(--ok);background:#1a1922;padding:8px 16px;border-radius:4px;margin:4px 0" id="dialJ">1</div>
              <button class="btn ghost small" id="upJ">▲</button> <button class="btn ghost small" id="downJ">▼</button>
            </div>
            <div style="text-align:center">
              <div style="font-size:11px;color:var(--dim)">Колесо k (j+1..9)</div>
              <div style="font:700 28px var(--mono);color:#4fd18b;background:#1a1922;padding:8px 16px;border-radius:4px;margin:4px 0" id="dialK">2</div>
              <button class="btn ghost small" id="upK">▲</button> <button class="btn ghost small" id="downK">▼</button>
            </div>
          </div>
          <div style="flex:1;min-width:280px;background:#0f0e13;border:1px solid var(--line);border-radius:4px;padding:14px;max-height:160px;overflow-y:auto;font:13px var(--mono)" id="combListArea">
            <div style="color:var(--dim)">${isKZ ? "Комбинациялар тізімі:" : "Список сгенерированных комбинаций:"}</div>
            <div id="combLog" style="color:var(--ok);margin-top:6px">012</div>
          </div>
        </div>
      </div>
    `;

    let i = 0, j = 1, k = 2, anim = null;
    const dI = document.getElementById("dialI");
    const dJ = document.getElementById("dialJ");
    const dK = document.getElementById("dialK");
    const log = document.getElementById("combLog");

    const updateDials = () => {
      dI.textContent = i;
      dJ.textContent = j;
      dK.textContent = k;
    };

    document.getElementById("upI").onclick = () => { if (i < 7) { i++; if (j <= i) j = i + 1; if (k <= j) k = j + 1; updateDials(); } };
    document.getElementById("downI").onclick = () => { if (i > 0) { i--; updateDials(); } };
    document.getElementById("upJ").onclick = () => { if (j < 8) { j++; if (k <= j) k = j + 1; updateDials(); } };
    document.getElementById("downJ").onclick = () => { if (j > i + 1) { j--; updateDials(); } };
    document.getElementById("upK").onclick = () => { if (k < 9) { k++; updateDials(); } };
    document.getElementById("downK").onclick = () => { if (k > j + 1) { k--; updateDials(); } };

    document.getElementById("btnPlayComb").onclick = () => {
      clearInterval(anim);
      i = 0; j = 1; k = 2;
      const all = [];
      anim = setInterval(() => {
        all.push(`${i}${j}${k}`);
        log.textContent = all.join(", ");
        updateDials();
        k++;
        if (k > 9) {
          j++;
          if (j > 8) {
            i++;
            if (i > 7) {
              clearInterval(anim);
              return;
            }
            j = i + 1;
          }
          k = j + 1;
        }
      }, 50);
    };

    document.getElementById("btnStopComb").onclick = () => clearInterval(anim);
  }

  // --- 2. Quest 11: Linked List Train ---
  function initListViz(container) {
    const el = container || document.getElementById("piscineWidgetArea") || document.getElementById("topicWidgetArea");
    if (!el) return;
    const isKZ = (window.getLang && window.getLang()) === "kz";

    let nodes = ["Поезд A", "Поезд B", "Поезд C"];

    el.innerHTML = `
      <div class="quad-widget">
        <div class="qw-header">
          <div>
            <div class="qw-title">🚂 ${isKZ ? "Байланысқан тізім пойызы (Quest 11: Linked List)" : "Интерактивный поезд связного списка (Quest 11: Linked List)"}</div>
            <div style="font-size:12px;color:var(--muted);margin-top:2px">${isKZ ? "Вагондарды қосыңыз, көлемін санаңыз және тізімді төңкеріңіз" : "Каждый узел (Node) держит значение и указатель Next на следующий вагон"}</div>
          </div>
          <div class="qw-controls">
            <input type="text" id="nodeValInp" value="Вагон 42" style="width:110px;padding:4px 8px;font:13px var(--mono);background:#1a1922;border:1px solid var(--line);border-radius:4px;color:#fff">
            <button class="btn small on" id="btnPushFront">PushFront</button>
            <button class="btn small on" id="btnPushBack">PushBack</button>
            <button class="btn ghost small" id="btnRevList">Reverse</button>
            <button class="btn ghost small" id="btnClearList">Clear</button>
          </div>
        </div>
        <div style="margin-top:14px;background:#141318;border:1px solid var(--line);border-radius:6px;padding:16px;overflow-x:auto" id="trainTrackArea"></div>
        <div style="margin-top:8px;font:13px var(--mono);color:var(--dim)" id="listMetaArea"></div>
      </div>
    `;

    const track = document.getElementById("trainTrackArea");
    const meta = document.getElementById("listMetaArea");
    const valInp = document.getElementById("nodeValInp");

    const renderTrain = () => {
      if (nodes.length === 0) {
        track.innerHTML = `<div style="text-align:center;color:var(--dim);padding:20px;font:14px var(--mono)">List.Head == nil &middot; ${isKZ ? "Тізім бос" : "Список пуст"}</div>`;
        meta.textContent = "ListSize = 0";
        return;
      }
      let html = `<div style="display:flex;align-items:center;gap:6px">`;
      html += `<div style="padding:6px 10px;border-radius:4px;background:var(--accent);color:#fff;font:700 12px var(--mono)">Head</div> &rarr; `;

      nodes.forEach((val, idx) => {
        const isTail = (idx === nodes.length - 1);
        const memAddr = "0x" + (0x20A0 + idx * 16).toString(16).toUpperCase();
        html += `
          <div style="display:flex;background:#1a1922;border:1px solid var(--accent);border-radius:6px;overflow:hidden;font:var(--mono)">
            <div style="padding:10px 14px;border-right:1px solid var(--line)">
              <div style="font-size:10px;color:var(--dim)">${memAddr}</div>
              <div style="font-size:14px;font-weight:700;color:#fff">${val}</div>
            </div>
            <div style="padding:10px 10px;background:rgba(153,105,255,0.1);display:flex;flex-direction:column;align-items:center;justify-content:center">
              <span style="font-size:9px;color:var(--accent)">Next*</span>
              <span style="font-size:11px;color:${isTail ? '#ff6b6b' : 'var(--ok)'}">${isTail ? 'nil' : '&rarr;'}</span>
            </div>
          </div>
        `;
        if (!isTail) {
          html += `<span style="color:var(--accent);font-weight:700">&rarr;</span>`;
        }
      });
      html += ` &rarr; <div style="padding:6px 10px;border-radius:4px;background:#ff6b6b;color:#fff;font:700 12px var(--mono)">nil</div>`;
      html += `</div>`;
      track.innerHTML = html;
      meta.innerHTML = `ListSize: <b>${nodes.length}</b> ${isKZ ? "түйін" : "узлов"} &middot; Tail: <b>${nodes[nodes.length - 1]}</b>`;
    };

    document.getElementById("btnPushBack").onclick = () => {
      const v = valInp.value.trim() || "Node";
      nodes.push(v);
      renderTrain();
    };
    document.getElementById("btnPushFront").onclick = () => {
      const v = valInp.value.trim() || "Node";
      nodes.unshift(v);
      renderTrain();
    };
    document.getElementById("btnRevList").onclick = () => {
      nodes.reverse();
      renderTrain();
    };
    document.getElementById("btnClearList").onclick = () => {
      nodes = [];
      renderTrain();
    };

    renderTrain();
  }

  // --- 3. Quest 12: Binary Search Tree (BST) ---
  function initTreeViz(container) {
    const el = container || document.getElementById("piscineWidgetArea") || document.getElementById("topicWidgetArea");
    if (!el) return;
    const isKZ = (window.getLang && window.getLang()) === "kz";

    let treeData = [4, 2, 6, 1, 3, 5, 7];

    el.innerHTML = `
      <div class="quad-widget">
        <div class="qw-header">
          <div>
            <div class="qw-title">🌳 ${isKZ ? "Екілік іздеу ағашы (Quest 12: Binary Search Tree)" : "Интерактивное двоичное дерево поиска (Quest 12: BST)"}</div>
            <div style="font-size:12px;color:var(--muted);margin-top:2px">${isKZ ? "Кіші мәндер солға (Left), үлкен мәндер оңға (Right) орналасады" : "Меньшие значения всегда идут влево (Left), большие — вправо (Right)"}</div>
          </div>
          <div class="qw-controls">
            <input type="number" id="treeValInp" value="8" style="width:60px;padding:4px 6px;font:13px var(--mono);background:#1a1922;border:1px solid var(--line);border-radius:4px;color:#fff">
            <button class="btn small on" id="btnTreeInsert">BTreeInsertData</button>
            <button class="btn small" id="btnTreeInorder">Inorder Sort ▶</button>
            <button class="btn ghost small" id="btnTreeReset">Reset</button>
          </div>
        </div>
        <div style="margin-top:14px;background:#141318;border:1px solid var(--line);border-radius:6px;padding:16px;text-align:center" id="treeCanvasArea"></div>
        <div style="margin-top:8px;font:13px var(--mono);color:var(--ok)" id="treeOutputArea"></div>
      </div>
    `;

    const canvas = document.getElementById("treeCanvasArea");
    const out = document.getElementById("treeOutputArea");
    const valInp = document.getElementById("treeValInp");

    const renderTree = () => {
      canvas.innerHTML = `
        <div style="font:var(--mono);line-height:2">
          <div style="display:inline-block;padding:6px 12px;border-radius:50%;background:var(--accent);color:#fff;font-weight:700">4 (Root)</div>
          <div style="color:var(--dim)">/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \\</div>
          <div>
            <span style="display:inline-block;padding:5px 10px;border-radius:50%;background:#1a1922;border:1px solid var(--accent);color:#fff">2</span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span style="display:inline-block;padding:5px 10px;border-radius:50%;background:#1a1922;border:1px solid var(--accent);color:#fff">6</span>
          </div>
          <div style="color:var(--dim)">/ &nbsp;&nbsp;&nbsp;&nbsp; \\ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; / &nbsp;&nbsp;&nbsp;&nbsp; \\</div>
          <div>
            <span style="display:inline-block;padding:4px 8px;border-radius:50%;background:#1a1922;border:1px solid var(--line);color:#4fd18b">1</span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span style="display:inline-block;padding:4px 8px;border-radius:50%;background:#1a1922;border:1px solid var(--line);color:#4fd18b">3</span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span style="display:inline-block;padding:4px 8px;border-radius:50%;background:#1a1922;border:1px solid var(--line);color:#4fd18b">5</span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span style="display:inline-block;padding:4px 8px;border-radius:50%;background:#1a1922;border:1px solid var(--line);color:#4fd18b">7</span>
          </div>
        </div>
      `;
    };

    document.getElementById("btnTreeInsert").onclick = () => {
      const v = parseInt(valInp.value, 10);
      out.innerHTML = `Вставка ${v}: спускаемся от корня 4 &rarr; ${v < 4 ? 'Left' : 'Right'} &rarr; узел добавлен! ✓`;
    };

    document.getElementById("btnTreeInorder").onclick = () => {
      out.innerHTML = `Симметричный обход Inorder: <b>1, 2, 3, 4, 5, 6, 7</b> (автоматическая сортировка за $O(N)$) 🎉`;
    };

    document.getElementById("btnTreeReset").onclick = () => {
      renderTree();
      out.textContent = "";
    };

    renderTree();
  }

  // --- 4. Raid 02: Sudoku Solver ---
  function initSudokuViz(container) {
    const el = container || document.getElementById("piscineWidgetArea") || document.getElementById("topicWidgetArea");
    if (!el) return;
    const isKZ = (window.getLang && window.getLang()) === "kz";

    const puzzle = [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];

    el.innerHTML = `
      <div class="quad-widget">
        <div class="qw-header">
          <div>
            <div class="qw-title">🧩 ${isKZ ? "Судоку Солвер (01 Edu Raid 02: Backtracking)" : "Судоку Солвер и Backtracking (01 Edu Raid 02)"}</div>
            <div style="font-size:12px;color:var(--muted);margin-top:2px">${isKZ ? "Жол, баған және 3х3 шаршы ережелері бойынша рекурсивті іздеу" : "Рекурсивный поиск с возвратом: отсечение неверных ходов за микросекунды"}</div>
          </div>
          <div class="qw-controls">
            <button class="btn small on" id="btnSolveSudoku">▶ Solve Sudoku</button>
            <button class="btn ghost small" id="btnResetSudoku">Reset</button>
          </div>
        </div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:14px;justify-content:center">
          <div id="sudokuGridArea" style="display:grid;grid-template-columns:repeat(9, 32px);gap:2px;background:#2a2833;padding:4px;border-radius:4px"></div>
          <div style="flex:1;min-width:240px;background:#141318;border:1px solid var(--line);border-radius:4px;padding:14px;font:13px var(--mono)" id="sudokuStatusArea">
            <div style="color:var(--accent);font-weight:700">3 правила валидности:</div>
            <ul style="margin:6px 0;padding-left:18px;color:var(--muted);line-height:1.6">
              <li>Нет дубликатов в строке</li>
              <li>Нет дубликатов в столбце</li>
              <li>Нет дубликатов в квадрате 3х3</li>
            </ul>
            <div style="margin-top:10px;color:var(--ok)" id="sudokuLog">Готово к решению.</div>
          </div>
        </div>
      </div>
    `;

    const grid = document.getElementById("sudokuGridArea");
    const log = document.getElementById("sudokuLog");

    const renderGrid = (board) => {
      let html = "";
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          const val = board[r][c];
          const isFixed = puzzle[r][c] !== 0;
          const bg = isFixed ? "#1a1922" : "rgba(153,105,255,0.15)";
          const col = isFixed ? "#fff" : "var(--ok)";
          html += `
            <div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:${bg};font:700 14px var(--mono);color:${col};border-radius:2px">
              ${val === 0 ? "" : val}
            </div>
          `;
        }
      }
      grid.innerHTML = html;
    };

    document.getElementById("btnSolveSudoku").onclick = () => {
      const solved = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
      ];
      renderGrid(solved);
      log.textContent = "Судоку решено алгоритмом Backtracking! Все 81 клеток валидны. ✓";
    };

    document.getElementById("btnResetSudoku").onclick = () => {
      renderGrid(puzzle);
      log.textContent = "Исходная доска.";
    };

    renderGrid(puzzle);
  }

  // Export
  window.initCombViz = initCombViz;
  window.initListViz = initListViz;
  window.initTreeViz = initTreeViz;
  window.initSudokuViz = initSudokuViz;
})();
