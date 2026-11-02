// setup.js: Точное интерактивное руководство по настройке окружения для 01 Edu Piscine Go
// На основе официальной методички Tomorrow School / 01 Edu (tomorrow-helper)
// Поддержка: Домашний ПК (Windows / macOS), Кампус 01 Edu (Ubuntu), и Workflow (Go, z01, Gitea)
// Полная двуязычная локализация: Русский / Қазақша

(function () {
  window.renderSetupPage = function (container, user) {
    const lang = (window.getLang && window.getLang()) || "ru";
    const isKZ = lang === "kz";

    container.innerHTML = `
      <div class="setup-wrap" style="max-width:1040px;margin:24px auto 70px;padding:0 20px">
        <div style="margin-bottom:24px">
          <a href="#/" class="btn ghost small" style="margin-bottom:14px;display:inline-flex;align-items:center;gap:6px">
            ← ${isKZ ? "Басты бетке" : "На дашборд"}
          </a>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px">
            <span style="font:600 12px var(--mono);text-transform:uppercase;color:var(--accent-l);background:rgba(153,105,255,0.12);padding:3px 10px;border-radius:12px;border:1px solid rgba(153,105,255,0.3)">
              01 Edu Piscine Guide
            </span>
          </div>
          <h1 style="font-size:28px;margin:0 0 8px;color:#fff">
            💻 ${isKZ ? "01 Edu Piscine жұмыс ортасын баптау" : "Настройка рабочего окружения для 01 Edu Piscine"}
          </h1>
          <p style="color:var(--dim);font-size:15px;margin:0;line-height:1.55">
            ${isKZ
              ? "01 Edu кампусында және үйде ноутбукта қатесіз жұмыс істеуге арналған толық қадамдық нұсқаулық. Git, Gitea 404 қатесін түзету, go mod init piscine, z01 кітапханасы және тапсырмаларды тапсыру тәртібі."
              : "Точная инструкция для работы в бассейне 01 Edu дома и в кампусе. Настройка Git, фикс ошибки Gitea 404, go mod init piscine, библиотека z01.PrintRune и регламент сдачи заданий."}
          </p>
        </div>

        <!-- Переключатель режима -->
        <div class="setup-tabs-nav" style="display:flex;gap:10px;margin-bottom:24px;border-bottom:1px solid var(--line);padding-bottom:12px;flex-wrap:wrap">
          <button class="s-tab on" data-sec="win" style="padding:10px 16px;font:600 13.5px var(--sans);border-radius:4px;border:1px solid var(--accent);background:rgba(153,105,255,0.15);color:var(--accent-l);cursor:pointer">
            🪟 ${isKZ ? "Үйде: Windows" : "Дома: Windows"}
          </button>
          <button class="s-tab" data-sec="mac" style="padding:10px 16px;font:600 13.5px var(--sans);border-radius:4px;border:1px solid var(--line);background:#141318;color:var(--muted);cursor:pointer">
            🍎 ${isKZ ? "Үйде: macOS" : "Дома: macOS"}
          </button>
          <button class="s-tab" data-sec="school" style="padding:10px 16px;font:600 13.5px var(--sans);border-radius:4px;border:1px solid var(--line);background:#141318;color:var(--muted);cursor:pointer">
            🏫 ${isKZ ? "Кампустағы оқу компьютері (Ubuntu)" : "В кампусе 01 Edu (Школьный ПК)"}
          </button>
          <button class="s-tab" data-sec="workflow" style="padding:10px 16px;font:600 13.5px var(--sans);border-radius:4px;border:1px solid var(--line);background:#141318;color:var(--muted);cursor:pointer">
            ⚡ ${isKZ ? "Piscine Go жұмыс тәртібі (Квест 1, 2, 3)" : "Регламент работы Piscine Go (Квесты 1, 2, 3)"}
          </button>
        </div>

        <div id="setupBody"></div>
      </div>
    `;

    const setupBody = container.querySelector("#setupBody");
    const tabs = container.querySelectorAll(".s-tab");

    function showSection(sec) {
      tabs.forEach(t => {
        const active = t.dataset.sec === sec;
        t.style.border = active ? "1px solid var(--accent)" : "1px solid var(--line)";
        t.style.background = active ? "rgba(153,105,255,0.15)" : "#141318";
        t.style.color = active ? "var(--accent-l)" : "var(--muted)";
      });

      if (sec === "win") setupBody.innerHTML = getWindowsSection(isKZ);
      if (sec === "mac") setupBody.innerHTML = getMacSection(isKZ);
      if (sec === "school") setupBody.innerHTML = getSchoolSection(isKZ);
      if (sec === "workflow") setupBody.innerHTML = getWorkflowSection(isKZ);

      // Copy buttons handler
      setupBody.querySelectorAll(".cmd-copy").forEach(btn => {
        btn.onclick = () => {
          const code = btn.dataset.code;
          navigator.clipboard.writeText(code);
          const orig = btn.textContent;
          btn.textContent = isKZ ? "Көшірілді! ✓" : "Скопировано! ✓";
          btn.style.borderColor = "var(--ok)";
          btn.style.color = "var(--ok)";
          setTimeout(() => {
            btn.textContent = orig;
            btn.style.borderColor = "var(--line)";
            btn.style.color = "var(--muted)";
          }, 1500);
        };
      });
    }

    tabs.forEach(t => {
      t.onclick = () => showSection(t.dataset.sec);
    });

    showSection("win");
  };

  function cmdBox(code, note) {
    return `
      <div style="position:relative;background:#0d0c10;border:1px solid var(--line);border-radius:4px;padding:12px 14px;margin:8px 0 14px;font:13px var(--mono)">
        <button class="cmd-copy" data-code="${esc(code)}" style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.06);border:1px solid var(--line);color:var(--muted);padding:3px 8px;font:500 11px var(--mono);border-radius:3px;cursor:pointer">
          📋 ${((window.getLang && window.getLang()) === "kz") ? "Көшіру" : "Копировать"}
        </button>
        <code style="color:#a78bfa;white-space:pre-wrap;display:block;padding-right:90px">${esc(code)}</code>
        ${note ? `<div style="margin-top:6px;font:12px var(--sans);color:var(--dim)">💡 ${note}</div>` : ""}
      </div>
    `;
  }

  function stepCard(stepNum, title, badge, content) {
    return `
      <div style="background:#141318;border:1px solid var(--line);border-radius:6px;padding:22px;margin-bottom:18px">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;flex-wrap:wrap">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:rgba(153,105,255,0.18);border:1px solid var(--accent);color:var(--accent-l);border-radius:50%;font:700 13px var(--mono)">${stepNum}</span>
            <h2 style="font-size:17.5px;margin:0;color:#fff">${title}</h2>
          </div>
          ${badge ? `<span style="font:600 11px var(--mono);color:var(--muted);background:rgba(255,255,255,0.04);padding:2px 8px;border-radius:4px;border:1px solid var(--line)">${badge}</span>` : ""}
        </div>
        ${content}
      </div>
    `;
  }

  function warnBox(title, text) {
    return `
      <div style="background:rgba(245,158,11,0.08);border-left:3px solid #f59e0b;padding:12px 16px;border-radius:3px;margin:12px 0;font-size:13.5px;line-height:1.55">
        <b style="color:#f59e0b;display:block;margin-bottom:4px">⚠️ ${title}</b>
        <div style="color:var(--text)">${text}</div>
      </div>
    `;
  }

  // ========================================================
  // 1. WINDOWS (ДОМА)
  // ========================================================
  function getWindowsSection(isKZ) {
    return `
      ${stepCard("1", isKZ ? "Бағдарламаларды орнату (VS Code, Git Bash, curl, jq)" : "Установка программ (VS Code, Git Bash, curl, jq)", "Windows 10/11", `
        <p style="color:var(--text);font-size:14px;line-height:1.55;margin:0 0 10px">
          ${isKZ 
            ? "Windows-та 01 Edu тапсырмаларын орындау үшін 4 құрал қажет: <b>VS Code</b> (редактор), <b>Git Bash</b> (Ubuntu-ға ұқсас терминал), <b>curl</b> және <b>jq</b> (JSON өңдеуші). PowerShell-ді ашып, орнатыңыз:" 
            : "Для работы с 01 Edu на Windows необходимы 4 инструмента: <b>VS Code</b>, <b>Git</b> (вместе с ним ставится <b>Git Bash</b>), <b>curl</b> и <b>jq</b> (обработчик JSON для Quest 01). Откройте PowerShell и выполните:"}
        </p>
        ${cmdBox("winget install --id Git.Git -e --source winget\nwinget install -e --id Microsoft.VisualStudioCode\nwinget install jqlang.jq", isKZ ? "PowerShell ішінде орындаңыз" : "Выполните в PowerShell от имени администратора")}
        
        <p style="color:var(--text);font-size:14px;margin-top:12px">
          ${isKZ ? "Орнатқаннан кейін PowerShell-ді қайта ашып, тексеріңіз:" : "Перезапустите терминал и проверьте версии:"}
        </p>
        ${cmdBox("git --version\ncurl.exe --version\njq --version", isKZ ? "Әр бағдарлама өз нұсқасын көрсетуі керек" : "Каждая команда должна вывести версию утилиты")}

        ${warnBox(
          isKZ ? "МАҢЫЗДЫ: Windows-та барлық тапсырмаларды Git Bash ішінде орындаңыз!" : "ВАЖНО: На Windows команды выполняются в Git Bash!",
          isKZ
            ? "PowerShell-ді біз тек орнату үшін қолдандық. Негізгі 01 Edu тапсырмаларын (bash скрипттері, sh, Go) <b>Git Bash</b> терминалында орындаңыз, өйткені PowerShell-де синтаксис басқаша."
            : "PowerShell использовался только для инсталляции. Все задания 01 Edu (скрипты Quest 01, sh, Linux-команды и Go) выполняйте строго в терминале <b>Git Bash</b>!"
        )}
      `)}

      ${stepCard("2", isKZ ? "Жұмыс папкасын жасау және VS Code-та ашу" : "Создание рабочей папки piscinego", "Рабочий стол", `
        <p style="color:var(--text);font-size:14px;line-height:1.55">
          ${isKZ 
            ? "1. Жұмыс үстелінде (Desktop) тінтуірдің оң жағын басып, <b>Создать → Папку</b> таңдаңыз.<br>2. Атын дәл <b>piscinego</b> деп қойыңыз.<br>3. VS Code-ты ашып, <b>File → Open Folder…</b> арқылы осы <code>piscinego</code> папкасын таңдаңыз.<br>4. Сұрақ шықса, <b>Yes, I trust the authors</b> басыңыз."
            : "1. На Рабочем столе нажмите правой кнопкой → <b>Создать → Папку</b>.<br>2. Назовите её строго <b>piscinego</b>.<br>3. В VS Code выберите <b>File → Open Folder…</b> и откройте папку <code>piscinego</code>.<br>4. При запросе доверия выберите <b>Yes, I trust the authors</b>."}
        </p>
      `)}

      ${stepCard("3", isKZ ? "VS Code ішінде Git Bash терминалын ашу" : "Настройка терминала Git Bash в VS Code", "VS Code Terminal", `
        <p style="color:var(--text);font-size:14px;line-height:1.55">
          ${isKZ 
            ? "1. VS Code ішінде жоғарғы мәзірден <b>Terminal → New Terminal</b> ашыңыз.<br>2. Терминал панеліндегі <b>+</b> батырмасының жанындағы <b>⌄</b> көрсеткісін басып, <b>Git Bash</b> таңдаңыз!<br>3. Барлық келесі пәрмендерді осы Git Bash терминалына жазамыз."
            : "1. В верхнем меню VS Code откройте <b>Terminal → New Terminal</b>.<br>2. Рядом с кнопкой <b>+</b> на панели терминала нажмите стрелочку <b>⌄</b> и выберите <b>Git Bash</b>!<br>3. Все последующие команды вводятся именно в этот терминал Git Bash."}
        </p>
      `)}

      ${stepCard("4", isKZ ? "Gitea 404 қатесін түзету (Кіруді сақтау)" : "Фикс ошибки Gitea 404 (Настройка сохранения входа)", "Критический шаг!", `
        <p style="color:var(--text);font-size:14px;line-height:1.55">
          ${isKZ 
            ? "Windows-та әдепкі Git көмекшісі браузерді ашып, 404 қатесін береді. Оны өшіріп, логин/құпиясөзді терминалда бір рет сақтайтын <b>store</b> режимін қосу керек:" 
            : "По умолчанию в Windows помощник входа открывает браузер со страницей 404 на платформе 01 Edu. <b>Обязательно</b> отключите его и включите хранилище <b>store</b> двумя командами по очереди:"}
        </p>
        ${cmdBox('git config --global --replace-all credential.helper ""\ngit config --global --add credential.helper store', isKZ ? "Бос тырнақшаларды \"\" міндетті түрде қалдырыңыз!" : "Обязательно выполните обе команды, пустые кавычки \"\" важны!")}

        <p style="color:var(--text);font-size:14px;margin-top:10px">
          ${isKZ ? "Автор деректерін тіркеңіз (login орнына Gitea логиніңізді жазыңыз):" : "Укажите имя автора (вместо choumi укажите свой логин на платформе 01 Edu):"}
        </p>
        ${cmdBox('git config --global user.name "ВАШ_ЛОГИН_GITEA"\ngit config --global user.email "your-email@example.com"', isKZ ? "Gitea-дағы нақты логиніңізді жазыңыз" : "Имя должно строго совпадать с логином Gitea")}
      `)}

      ${stepCard("5", isKZ ? "Жобаны бос орын және нүктемен клондау (git clone .)" : "Скачивание проекта из Gitea (git clone .)", "01.tomorrow-school.ai", `
        <p style="color:var(--text);font-size:14px;line-height:1.55">
          ${isKZ 
            ? "1. Платформада оң жақ жоғарыдағы <b>профиль → GITEA</b> басыңыз.<br>2. Өз <b>piscinego</b> репозиторийіңізді ашып, жасыл <b>Code → HTTPS</b> сілтемесін көшіріңіз.<br>3. VS Code ішіндегі Git Bash терминалына келіп, сілтеменің соңына <b>БОС ОРЫН ЖӘНЕ НҮКТЕ</b> қойып орындаңыз:"
            : "1. На платформе 01 нажмите <b>профиль справа сверху → GITEA</b>.<br>2. Откройте свой репозиторий <b>piscinego</b>, нажмите зелёную кнопку <b>Code → HTTPS</b> и скопируйте ссылку.<br>3. В терминале VS Code вставьте ссылку, обязательно добавив <b>ПРОБЕЛ И ТОЧКУ</b> в конце:"}
        </p>
        ${cmdBox("git clone https://01.tomorrow-school.ai/git/ВАШ_ЛОГИН/piscinego.git .", isKZ ? "Соңындағы бос орын мен нүкте .git . міндетті! Бұл ішкі папка жасамай, осы папкаға көшіреді" : "Пробел и точка в конце обязательны: .git . скачивает файлы прямо в эту папку, без лишней вложенности")}

        <p style="color:var(--text);font-size:14px;margin-top:10px">
          ${isKZ 
            ? "Терминал <b>Username</b> мен <b>Password</b> сұрағанда, Gitea логиніңіз бен құпиясөзіңізді енгізіңіз (құпиясөз жазғанда таңбалар көрінбейді — бұл қалыпты жағдай)." 
            : "Когда Git запросит <b>Username</b> и <b>Password</b> — введите логин и пароль от платформы 01 (при вводе пароля символы не отображаются — это нормально)."}
        </p>
      `)}
    `;
  }

  // ========================================================
  // 2. MACOS (ДОМА)
  // ========================================================
  function getMacSection(isKZ) {
    return `
      ${stepCard("1", isKZ ? "Homebrew, Git және jq орнату" : "Установка Homebrew, Git и jq", "macOS Terminal", `
        <p style="color:var(--text);font-size:14px;line-height:1.55">
          ${isKZ ? "Terminal ашып (⌘ + Space → Terminal), Homebrew пакеттік менеджерін орнатыңыз:" : "Откройте Terminal (⌘ + Space → Terminal) и установите Homebrew:"}
        </p>
        ${cmdBox('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"', isKZ ? "Установщик көрсеткен Next steps пәрмендерін міндетті түрде орындаңыз" : "После установки обязательно выполните команды из блока Next steps")}
        
        <p style="color:var(--text);font-size:14px;margin-top:12px">
          ${isKZ ? "Құралдарды орнату және тексеру:" : "Установите Git и jq:"}
        </p>
        ${cmdBox("brew install git jq\ngit --version\njq --version", isKZ ? "Орнатып, нұсқаларын тексереді" : "Проверяет корректность установки")}
      `)}

      ${stepCard("2", isKZ ? "Gitea 404 қатесін болдырмау (credential.helper store)" : "Настройка сохранения входа Git на macOS", "Store helper", `
        <p style="color:var(--text);font-size:14px;line-height:1.55">
          ${isKZ ? "macOS-та да мектептік Gitea-ға кіру үшін store режимін қосамыз:" : "На macOS также отключаем диалоговые окна и включаем store:"}
        </p>
        ${cmdBox('git config --global --replace-all credential.helper ""\ngit config --global --add credential.helper store\ngit config --global user.name "ВАШ_ЛОГИН_GITEA"\ngit config --global user.email "your-email@example.com"', isKZ ? "Логин мен поштаңызды көрсетіңіз" : "Укажите свои данные Gitea")}
      `)}

      ${stepCard("3", isKZ ? "Жоба папкасын жасау және клондау" : "Создание папки piscinego и скачивание", "Рабочий стол", `
        <p style="color:var(--text);font-size:14px;line-height:1.55">
          ${isKZ 
            ? "Жұмыс үстелінде <b>piscinego</b> папкасын жасап, оны VS Code-та ашыңыз (File → Open Folder). Терминалда соңындағы <b>бос орын мен нүктені</b> ұмытпай клондаңыз:" 
            : "Создайте папку <b>piscinego</b> на Рабочем столе, откройте её в VS Code и выполните клонирование с пробелом и точкой в конце:"}
        </p>
        ${cmdBox("git clone https://01.tomorrow-school.ai/git/ВАШ_ЛОГИН/piscinego.git .", isKZ ? "Точка . обязательно отдельно через пробел" : "Пробел и точка в конце обязательны")}
      `)}
    `;
  }

  // ========================================================
  // 3. ШКОЛЬНЫЙ ПК В КАМПУСЕ (UBUNTU)
  // ========================================================
  function getSchoolSection(isKZ) {
    return `
      <div style="background:rgba(79,209,139,0.08);border:1px solid var(--ok);border-radius:6px;padding:16px;margin-bottom:20px">
        <b style="color:var(--ok);font-size:15px">🏫 ${isKZ ? "Кампустағы оқу компьютерлері туралы:" : "О школьных компьютерах 01 Edu:"}</b>
        <p style="margin:6px 0 0;font-size:13.5px;color:var(--text);line-height:1.55">
          ${isKZ 
            ? "Кампустағы барлық компьютерлерде Go, VS Code, Git, curl, jq <b>әлдеқашан орнатылған</b>. Ештеңе орнатудың қажеті жоқ! Сізге тек папка жасап, логиніңізді енгізіп, жұмысыңызды жүктеп алу керек." 
            : "На компьютерах кампуса все программы (Go, VS Code, Git, curl, jq) <b>уже установлены</b>. Устанавливать ничего не нужно! Требуется лишь создать папку на рабочем столе, настроить логин и скачать проект."}
        </p>
      </div>

      ${stepCard("1", isKZ ? "1. Жұмыс үстелінде piscinego папкасын жасау" : "1. Создание папки на Рабочем столе", "Ubuntu Desktop", `
        <p style="color:var(--text);font-size:14px;line-height:1.55">
          ${isKZ 
            ? "1. Рабочий столда бос жерге тінтуірдің оң жағын басып → <b>New Folder</b> таңдаңыз.<br>2. Папканы <b>piscinego</b> деп атаңыз.<br>3. Папканың ішіне кіріп, бос жерге оң жақпен басып → <b>Open in Terminal</b> таңдаңыз." 
            : "1. На Рабочем столе нажмите правой кнопкой → <b>New Folder / Создать папку</b>.<br>2. Назовите папку <b>piscinego</b>.<br>3. Откройте её двойным щелчком, нажмите правой кнопкой по пустому месту внутри → <b>Open in Terminal</b>."}
        </p>
      `)}

      ${stepCard("2", isKZ ? "2. Терминалда логин мен store баптау" : "2. Настройка Git в терминале папки", "Ввести в открытом терминале", `
        <p style="color:var(--text);font-size:14px;line-height:1.55">
          ${isKZ ? "Терминалға осы пәрмендерді енгізіңіз (Ubuntu терминалына мәтін қою: <b>Ctrl + Shift + V</b>):" : "Вставьте команды в терминал (вставка в терминал Ubuntu: <b>Ctrl + Shift + V</b>):"}
        </p>
        ${cmdBox('git config --global credential.helper store\ngit config --global user.name "ВАШ_ЛОГИН"\ngit config --global user.email "your-email@example.com"', isKZ ? "Логиніңізді жазыңыз" : "Укажите свой логин Gitea")}
      `)}

      ${stepCard("3", isKZ ? "3. Проектіні скачивать ету (git clone .)" : "3. Клонирование репозитория в текущую папку", "git clone .", `
        <p style="color:var(--text);font-size:14px;line-height:1.55">
          ${isKZ 
            ? "Gitea сайтынан piscinego сілтемесін көшіріп, соңына <b>бос орын және нүкте</b> қойып орындаңыз:" 
            : "Скопируйте HTTPS-ссылку из своего Gitea и выполните с пробелом и точкой на конце:"}
        </p>
        ${cmdBox("git clone https://01.tomorrow-school.ai/git/ВАШ_ЛОГИН/piscinego.git .", isKZ ? "Пробел және нүкте . міндетті!" : "Обязательно с пробелом и точкой в конце!")}
        <p style="color:var(--text);font-size:14px;margin-top:10px">
          ${isKZ 
            ? "Сұрағанда Gitea логині мен құпиясөзін жазыңыз. Жүктелген соң осы терминалда <code>code .</code> деп жазсаңыз, VS Code бірден ашылады!" 
            : "Введите логин и пароль от Gitea. После загрузки выполните команду <code>code .</code> — VS Code откроется прямо в этой папке!"}
        </p>
        ${cmdBox("code .", isKZ ? "Папканы VS Code-та ашады" : "Открывает рабочую папку в редакторе")}
      `)}
    `;
  }

  // ========================================================
  // 4. РЕГЛАМЕНТ РАБОТЫ В PISCINE GO (КВЕСТЫ 1, 2, 3)
  // ========================================================
  function getWorkflowSection(isKZ) {
    return `
      ${stepCard("1", isKZ ? "1 рет орындау: Модуль және z01 кітапханасын қосу" : "Однократно: Инициализация модуля и библиотеки z01", "Квест 02 басы", `
        <p style="color:var(--text);font-size:14px;line-height:1.55">
          ${isKZ 
            ? "Квест 02-ге өткен кезде <code>piscinego</code> папкасында <b>бір рет</b> модуль құрып, 01 Edu ресми z01 кітапханасын орнату керек:" 
            : "При переходе к Go (Квест 02) в корне папки <code>piscinego</code> нужно <b>один раз</b> инициализировать модуль и подтянуть библиотеку символов 01 Edu:"}
        </p>
        ${cmdBox("go mod init piscine\ngo get github.com/01-edu/z01", isKZ ? "Модуль аты қатаң түрде piscine болуы тиіс!" : "Название модуля должно быть строго piscine!")}
        <p style="color:var(--dim);font-size:13px;margin-top:6px">
          ${isKZ ? "Папкада <code>go.mod</code> және <code>go.sum</code> файлдары пайда болады. Оларды өшірмеңіз!" : "В папке появятся файлы go.mod и go.sum. Не удаляйте их, они нужны для проверки платформой!"}
        </p>
      `)}

      ${stepCard("2", isKZ ? "Файлдар құрылымы: Қайда package piscine, қайда main?" : "Структура файлов: где package piscine, а где main?", "01 Edu стандарттары", `
        <div style="background:#0d0c10;border:1px solid var(--line);border-radius:4px;padding:14px;font:13px var(--mono);color:#e2e6ec;line-height:1.6">
          piscinego/<br>
          ├── go.mod&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← модуль параметрлері<br>
          ├── go.sum<br>
          ├── <b>printdigits/</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← Толық программа (папка)<br>
          │&nbsp;&nbsp;&nbsp;└── main.go&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>package main</b> (мұнда func main)<br>
          ├── <b>isnegative.go</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← Функция тапсырмасы (түбірде)<br>
          ├── <b>pointone.go</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>package piscine</b> (мұнда main ЖОҚ!)<br>
          ├── <b>swap.go</b><br>
          └── <b>tryquest2/</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← Тексеру папкасы (өзіңіз үшін)<br>
          &nbsp;&nbsp;&nbsp;&nbsp;└── main.go&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>package main</b> + import "piscine"
        </div>

        <p style="color:var(--text);font-size:14px;margin-top:12px;line-height:1.55">
          ${isKZ 
            ? "• <b>Егер тапсырма функция болса</b> (isnegative, pointone, swap): файлды түбірге қойып, бірінші жолына <code>package piscine</code> деп жазасыз. Ішінде func main БОЛМАУЫ керек!<br>• <b>Тексеру үшін</b>: жеке <code>tryquest2</code> немесе <code>tryquest3</code> папкасын жасап, ішіне <code>main.go</code> жазып, өзіңіздің piscine функцияңызды шақырасыз." 
            : "• <b>Если задание — функция</b> (isnegative, pointone, divmod, swap): файл создаётся в корне с <code>package piscine</code>. Внутри НЕ должно быть func main!<br>• <b>Для проверки</b> создайте папку <code>tryquest2</code> (или tryquest3), в ней <code>main.go</code> с <code>package main</code>, импортируйте <code>\"piscine\"</code> и запускайте тест."}
        </p>
      `)}

      ${stepCard("3", isKZ ? "Кодты жергілікті тексеру: go run" : "Запуск и тестирование кода", "Терминал", `
        <p style="color:var(--text);font-size:14px;line-height:1.55">
          ${isKZ ? "Толық программаны немесе сынақ папкасын іске қосу:" : "Запуск отдельной программы или папки проверки:"}
        </p>
        ${cmdBox("cd printdigits\ngo run .\ncd ..", isKZ ? "printdigits программасын іске қосу" : "Запуск программы printdigits")}
        ${cmdBox("go run ./tryquest2\ngo run ./tryquest3", isKZ ? "Өз функцияларыңызды сынақ папкасы арқылы тексеру" : "Запуск проверки функций через тестовую папку")}
      `)}

      ${stepCard("4", isKZ ? "Жұмысты Git-ке жіберу және платформада тапсыру" : "Отправка в Git и сдача задания на платформе", "Финал", `
        <p style="color:var(--text);font-size:14px;line-height:1.55">
          ${isKZ 
            ? "Тапсырма дайын болғанда, оны 3 қадаммен Gitea-ға жібересіз:" 
            : "Когда задача решена и проверена, отправьте её в Gitea тремя командами:"}
        </p>
        ${cmdBox('git add pointone.go go.mod go.sum\ngit commit -m "Complete pointone"\ngit push', isKZ ? "Файлды таңдау, сақтау және жіберу" : "Добавить файл, сделать коммит и отправить")}

        ${warnBox(
          isKZ ? "ЕСТЕ САҚТАҢЫЗ: git push — бұл әлі тапсырманы өткізу емес!" : "ПОМНИТЕ: git push — это ещё не сдача задания!",
          isKZ
            ? "Кодты Git-ке жібергеннен кейін, міндетті түрде <b>01 платформасының сайтына кіріп</b>, сол тапсырманың үстінен басып, <b>Submit / Сдать</b> батырмасын басыңыз!"
            : "После выполнения <code>git push</code> обязательно зайдите на <b>сайт платформы 01</b>, откройте карточку задания и нажмите кнопку сдачи (Submit)!"
        )}
      `)}
    `;
  }

  function esc(s) {
    return String(s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  }
})();
