// setup.js: Интерактивное руководство по установке Git, Go и VS Code
// Поддержка Windows, macOS, Linux (Ubuntu) на двух языках (RU / KZ)

(function () {
  window.renderSetupPage = function (container, user) {
    const lang = (window.getLang && window.getLang()) || "ru";
    const isKZ = lang === "kz";

    container.innerHTML = `
      <div class="setup-wrap" style="max-width:960px;margin:24px auto 60px;padding:0 20px">
        <div style="margin-bottom:24px">
          <a href="#/" class="btn ghost small" style="margin-bottom:14px;display:inline-flex;align-items:center;gap:6px">
            ← ${isKZ ? "Басты бетке" : "На дашборд"}
          </a>
          <h1 style="font-size:28px;margin:0 0 8px;color:#fff">
            💻 ${isKZ ? "Жұмыс ортасын баптау (Git, Go, VS Code)" : "Настройка рабочего окружения (Git, Go, VS Code)"}
          </h1>
          <p style="color:var(--dim);font-size:15px;margin:0;line-height:1.5">
            ${isKZ
              ? "Компьютеріңізді нағыз бағдарламашы станциясына айналдырыңыз. Барлық қажетті құралдарды орнату бойынша қадамдық нұсқаулық."
              : "Превратите свой компьютер в рабочую станцию разработчика. Пошаговые инструкции с готовыми командами для консоли."}
          </p>
        </div>

        <!-- Переключатель ОС -->
        <div class="os-nav" style="display:flex;gap:10px;margin-bottom:24px;border-bottom:1px solid var(--line);padding-bottom:12px">
          <button class="os-tab on" data-os="win" style="padding:10px 18px;font:600 14px var(--sans);border-radius:4px;border:1px solid var(--accent);background:rgba(153,105,255,0.15);color:var(--accent-l);cursor:pointer">
            🪟 Windows 10 / 11
          </button>
          <button class="os-tab" data-os="mac" style="padding:10px 18px;font:600 14px var(--sans);border-radius:4px;border:1px solid var(--line);background:#141318;color:var(--muted);cursor:pointer">
            🍎 macOS (MacBook)
          </button>
          <button class="os-tab" data-os="linux" style="padding:10px 18px;font:600 14px var(--sans);border-radius:4px;border:1px solid var(--line);background:#141318;color:var(--muted);cursor:pointer">
            🐧 Linux (Ubuntu / Mint)
          </button>
        </div>

        <div id="osContent"></div>
      </div>
    `;

    const osContent = container.querySelector("#osContent");
    const osTabs = container.querySelectorAll(".os-tab");

    function renderOS(os) {
      osTabs.forEach(t => {
        const active = t.dataset.os === os;
        t.style.border = active ? "1px solid var(--accent)" : "1px solid var(--line)";
        t.style.background = active ? "rgba(153,105,255,0.15)" : "#141318";
        t.style.color = active ? "var(--accent-l)" : "var(--muted)";
      });

      if (os === "win") osContent.innerHTML = getWindowsGuide(isKZ);
      if (os === "mac") osContent.innerHTML = getMacGuide(isKZ);
      if (os === "linux") osContent.innerHTML = getLinuxGuide(isKZ);

      // Copy buttons handler
      osContent.querySelectorAll(".cmd-copy").forEach(btn => {
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

    osTabs.forEach(t => {
      t.onclick = () => renderOS(t.dataset.os);
    });

    renderOS("win");
  };

  function cmdBox(code, note) {
    return `
      <div style="position:relative;background:#0d0c10;border:1px solid var(--line);border-radius:4px;padding:12px 14px;margin:8px 0 12px;font:13px var(--mono)">
        <button class="cmd-copy" data-code="${esc(code)}" style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.06);border:1px solid var(--line);color:var(--muted);padding:3px 8px;font:500 11px var(--mono);border-radius:3px;cursor:pointer">
          📋 Копировать
        </button>
        <code style="color:#a78bfa;white-space:pre-wrap;display:block;padding-right:90px">${esc(code)}</code>
        ${note ? `<div style="margin-top:6px;font:12px var(--sans);color:var(--dim)">💡 ${note}</div>` : ""}
      </div>
    `;
  }

  function sectionCard(num, title, icon, content) {
    return `
      <div style="background:#141318;border:1px solid var(--line);border-radius:6px;padding:22px;margin-bottom:20px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
          <span style="font-size:24px">${icon}</span>
          <h2 style="font-size:19px;margin:0;color:#fff">${num}. ${title}</h2>
        </div>
        ${content}
      </div>
    `;
  }

  // --- 1. WINDOWS ---
  function getWindowsGuide(isKZ) {
    return `
      ${sectionCard("1", isKZ ? "Git орнату және баптау" : "Установка и настройка Git", "📦", `
        <p style="color:var(--text);font-size:14px;line-height:1.5">
          ${isKZ 
            ? "Git — бұл код нұсқаларын басқаруға арналған басты құрал. Терминалды (PowerShell немесе Windows Terminal) ашып, келесі пәрменді орындаңыз:" 
            : "Git — система контроля версий кода. Откройте PowerShell от имени администратора и запустите быструю установку через winget:"}
        </p>
        ${cmdBox("winget install --id Git.Git -e --source winget", isKZ ? "Немесе git-scm.com сайтынан ресми орнатқышты жүктеп алыңыз" : "Либо скачайте официальный инсталлятор с git-scm.com")}
        <p style="color:var(--text);font-size:14px;margin-top:14px">
          ${isKZ ? "Орнатқаннан кейін өз атыңыз бен поштаңызды көрсетіңіз (коммиттер үшін):" : "После установки укажите своё имя и email для GitHub-коммитов:"}
        </p>
        ${cmdBox('git config --global user.name "Ваше Имя"\ngit config --global user.email "ваш@email.com"', isKZ ? "Тырнақшалар ішіне өз деректеріңізді жазыңыз" : "В кавычках укажите ваши реальные данные")}
        <p style="color:var(--text);font-size:14px;margin-top:14px">
          ${isKZ ? "GitHub үшін қауіпсіз SSH кілтін жасау:" : "Генерация безопасного SSH-ключа для работы с GitHub без ввода пароля:"}
        </p>
        ${cmdBox('ssh-keygen -t ed25519 -C "ваш@email.com"', isKZ ? "Барлық сұрақтарда жай ғана Enter басыңыз" : "На все вопросы консоли просто нажимайте Enter")}
      `)}

      ${sectionCard("2", isKZ ? "Go (Golang) орнату және тексеру" : "Установка и проверка Go (Golang)", "🐹", `
        <p style="color:var(--text);font-size:14px;line-height:1.5">
          ${isKZ 
            ? "Go 1.23+ нұсқасын PowerShell арқылы бір пәрменмен орнатыңыз:" 
            : "Установите последнюю версию Go 1.23+ в PowerShell:"}
        </p>
        ${cmdBox("winget install --id GoLang.Go -e", isKZ ? "Немесе go.dev/dl/ сайтынан MSI файлын жүктеңіз" : "Или скачайте .msi установщик с go.dev/dl")}
        <p style="color:var(--text);font-size:14px;margin-top:14px">
          ${isKZ ? "Терминалды қайта ашып, орнатуды тексеріңіз:" : "Перезапустите терминал и проверьте корректность установки:"}
        </p>
        ${cmdBox("go version", isKZ ? "Нәтиже go version go1.23... түрінде шығуы керек" : "Должна отобразиться версия, например go version go1.23.2 windows/amd64")}
        <p style="color:var(--text);font-size:14px;margin-top:14px">
          ${isKZ ? "Алғашқы бағдарламаны жасау және іске қосу:" : "Создайте первую рабочую программу на компьютере:"}
        </p>
        ${cmdBox("mkdir myproject\ncd myproject\ngo mod init myproject\ngo run main.go", isKZ ? "Жоба папкасын жасап, оны Go модулі ретінде инициализациялайды" : "Инициализирует Go-модуль и запускает код")}
      `)}

      ${sectionCard("3", isKZ ? "VS Code орнату және кеңейтімдер" : "Установка VS Code и плагинов", "💻", `
        <p style="color:var(--text);font-size:14px;line-height:1.5">
          ${isKZ 
            ? "Visual Studio Code — Go тілінде жазуға арналған ең танымал тегін редактор:" 
            : "Visual Studio Code — самый популярный редактор для Go разработки:"}
        </p>
        ${cmdBox("winget install -e --id Microsoft.VisualStudioCode", isKZ ? "Немесе code.visualstudio.com сайтынан орнатыңыз" : "Либо скачайте с code.visualstudio.com")}
        <div style="margin-top:14px;background:rgba(255,255,255,0.03);padding:14px;border-radius:4px;border:1px solid var(--line)">
          <b style="color:var(--accent-l)">${isKZ ? "Міндетті түрде орнату керек кеңейтімдер (Extensions):" : "Обязательные расширения (вкладка Extensions в VS Code):"}</b>
          <ul style="margin:8px 0 0 18px;padding:0;font-size:13.5px;color:var(--text);line-height:1.6">
            <li><b>Go</b> (Go Team at Google) — автотолықтыру, құжаттама және сақтау кезінде кодты автоматты түрде реттеу (gofmt).</li>
            <li><b>Error Lens</b> — қателерді біздің сайттағыдай тікелей код жолында көрсетеді.</li>
            <li><b>GitLens</b> — код тарихы мен коммиттерін көруге көмектеседі.</li>
          </ul>
        </div>
      `)}
    `;
  }

  // --- 2. MACOS ---
  function getMacGuide(isKZ) {
    return `
      ${sectionCard("1", isKZ ? "Homebrew және Git орнату" : "Установка Homebrew и Git", "🍎", `
        <p style="color:var(--text);font-size:14px;line-height:1.5">
          ${isKZ 
            ? "macOS-та барлық бағдарламаларды Homebrew пакеттік менеджері арқылы орнату ең ыңғайлы:" 
            : "На Mac всё устанавливается за пару секунд через пакетный менеджер Homebrew:"}
        </p>
        ${cmdBox('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"', isKZ ? "Homebrew орнату пәрмені" : "Установка Homebrew в Terminal")}
        <p style="color:var(--text);font-size:14px;margin-top:14px">
          ${isKZ ? "Git орнату және баптау:" : "Установка Git:"}
        </p>
        ${cmdBox('brew install git\ngit config --global user.name "Имя"\ngit config --global user.email "email@example.com"', isKZ ? "Git-ті орнатып, деректеріңізді тіркейді" : "Устанавливает Git и настраивает профиль")}
        ${cmdBox('ssh-keygen -t ed25519 -C "email@example.com"', isKZ ? "GitHub үшін SSH кілтін жасау" : "Генерация SSH-ключа")}
      `)}

      ${sectionCard("2", isKZ ? "Go (Golang) орнату" : "Установка Go на macOS", "🐹", `
        <p style="color:var(--text);font-size:14px;line-height:1.5">
          ${isKZ ? "Homebrew арқылы Go орнату (Apple Silicon M1/M2/M3 және Intel қолдайды):" : "Установка Go через Homebrew (автоматически поддерживает Apple Silicon M1-M4 и Intel):"}
        </p>
        ${cmdBox("brew install go\ngo version", isKZ ? "Орнатып, нұсқасын тексереді" : "Установка и мгновенная проверка версии")}
      `)}

      ${sectionCard("3", isKZ ? "VS Code орнату" : "Установка VS Code на macOS", "💻", `
        ${cmdBox("brew install --cask visual-studio-code", isKZ ? "VS Code-ты Mac-қа орнатады" : "Устанавливает VS Code в папку Программы")}
        <p style="color:var(--text);font-size:14px;margin-top:14px">
          ${isKZ ? "VS Code-та Command Palette ашыңыз (Cmd + Shift + P) және 'Shell Command: Install code command in PATH' деп жазыңыз. Осыдан кейін терминалдан жай ғана 'code .' деп жобаны аша аласыз." : "В VS Code нажмите Cmd+Shift+P и выполните: 'Shell Command: Install code command in PATH'. Теперь можно открывать любой проект командой 'code .' из терминала!"}
        </p>
      `)}
    `;
  }

  // --- 3. LINUX UBUNTU ---
  function getLinuxGuide(isKZ) {
    return `
      ${sectionCard("1", isKZ ? "Git орнату (Ubuntu / Debian)" : "Установка Git в Ubuntu / Debian", "🐧", `
        <p style="color:var(--text);font-size:14px;line-height:1.5">
          ${isKZ ? "Пакеттерді жаңартып, ресми репозиторийден Git орнатыңыз:" : "Обновите пакеты apt и установите Git:"}
        </p>
        ${cmdBox("sudo apt update && sudo apt install git curl build-essential -y", isKZ ? "Барлық қажетті базалық утилиталарды орнатады" : "Устанавливает Git, Curl и компиляторы")}
        ${cmdBox('git config --global user.name "Ваше Имя"\ngit config --global user.email "email@example.com"\nssh-keygen -t ed25519 -C "email@example.com"', isKZ ? "Git профилін баптау және SSH жасау" : "Настройка профиля и генерация SSH-ключа")}
      `)}

      ${sectionCard("2", isKZ ? "Соңғы Go 1.23+ орнату" : "Установка свежего Go 1.23+ на Linux", "🐹", `
        <p style="color:var(--text);font-size:14px;line-height:1.5">
          ${isKZ ? "Ubuntu репозиторийіндегі Go кейде ескі болады. Соңғы нұсқаны ресми PPA арқылы орнатыңыз:" : "В стандартном репозитории Ubuntu версия Go может отставать. Рекомендуем установку через официальный PPA:"}
        </p>
        ${cmdBox("sudo add-apt-repository ppa:longsleep/golang-backports -y\nsudo apt update\nsudo apt install golang-go -y\ngo version", isKZ ? "Ең соңғы тұрақты Go нұсқасын орнатады" : "Устанавливает свежую версию Go и проверяет её")}
      `)}

      ${sectionCard("3", isKZ ? "VS Code орнату (Snap арқылы)" : "Установка VS Code в Ubuntu", "💻", `
        <p style="color:var(--text);font-size:14px;line-height:1.5">
          ${isKZ ? "Snap пакеттер менеджері арқылы классикалық режимде орнату:" : "Установка через snap с флагом classic:"}
        </p>
        ${cmdBox("sudo snap install --classic code", isKZ ? "VS Code орнату" : "Установка VS Code")}
      `)}
    `;
  }

  function esc(s) {
    return String(s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  }
})();
