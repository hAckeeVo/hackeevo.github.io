// i18n.js: Модуль полной двуязычной локализации (Қазақша / Русский)
(function () {
  const LANG_KEY = "gp_lang";
  let lang = localStorage.getItem(LANG_KEY) || "ru";

  const DICT = {
    ru: {
      langBtn: "KZ",
      brandSub: "Учебная платформа по основам Go и бассейну 01 Edu",
      setupNav: "💻 Настройка окружения",
      arenaNav: "⚡ Тренажёр задач",
      dashboard: "Дашборд",
      logout: "выйти",
      guest: "Гость",
      cloud: "Облако (Supabase)",
      loginTab: "Вход",
      regTab: "Регистрация",
      nickLabel: "Ваш никнейм для лидерборда",
      passLabel: "Пароль (от 6 символов)",
      loginBtn: "Войти в аккаунт",
      regBtn: "Зарегистрироваться",
      guestBtn: "Продолжить без пароля (локально)",
      unlockBtn: "Разблокировать все темы",
      promptCode: "Введите промокод для полной разблокировки:",
      searchPlaceholder: "Поиск по темам и задачам...",
      tracks: {
        base: "💡 Основы Go (Темы 0–13)",
        piscine: "🏊 01 Edu Piscine (Алгоритмы, Quad, Указатели, Рекурсия)",
        backend: "🚀 Backend, Сеть и Базы данных (Темы 26–30)"
      },
      topicPassed: "пройдена",
      topicLocked: "закрыта",
      simulatorBadge: "🎮 Тренажёр",
      quizName: "Мини-тест",
      stepTheory: "Шаг 1 · Лекция",
      stepExamples: "Шаг 2 · Примеры",
      stepQuiz: "Шаг 3 · Мини-тест",
      stepPractice: "Практика",
      stepExam: "★ Экзамен 01 Edu",
      needHint: "Нужна подсказка?",
      moreHint: "Ещё подсказка",
      openInEditor: "Открыть в редакторе →",
      checkBtn: "Проверить",
      resetBtn: "Сбросить",
      nextTopic: "Следующая тема",
      backToDash: "На дашборд",
      setupTitle: "Настройка окружения для 01 Edu Piscine",
      setupSubtitle: "Пошаговая инструкция для работы дома и в кампусе 01 Edu (Git, Gitea, z01, VS Code)",
      arenaTitle: "Арена задач (Практический тренажёр)",
      arenaSubtitle: "Дополнительные задачи для оттачивания алгоритмов, бэкенда и подготовки к бассейну 01 Edu",
      allTopics: "Все темы",
      filterDiff: "Сложность",
      allDiffs: "Все уровни",
      easyDiff: "🟢 Легко",
      medDiff: "🟡 Средне",
      examDiff: "🔴 Экзамен 01 Edu",
      solveTask: "Решать задачу →",
      solvedBadge: "✓ Решено",
      expectedOutput: "Ожидаемый вывод",
      runCode: "Проверить решение ▶",
      copyCode: "Копировать",
      copied: "Скопировано!",
      
      // Crumb & Nav
      crumbDash: "dashboard",
      crumbTopic: "тема",
      crumbIntro: "введение",
      crumbSetup: "setup",
      crumbArena: "arena",

      // Dashboard
      welcome: "Добро пожаловать",
      statTopics: "тем",
      statTasks: "задач",
      statDone: "выполнено",
      allUnlocked: "🔓 Все темы открыты",
      relockBtn: "Включить замки обратно",
      promoPlaceholder: "Введите промокод",
      bannerSetupTitle: "Настройка окружения (Windows, Mac, Linux)",
      bannerSetupSub: "Инструкции по установке Git, Go 1.23+ и плагинов VS Code",
      bannerArenaTitle: "Тренажёр задач Арена (+XP)",
      bannerArenaSub: "Задачи Piscine, LeetCode, Backend и AI Engineering",
      sideWhatNext: "Что дальше",
      sideContinue: "Продолжить →",
      sideAllDone: "Все темы пройдены. Отличная работа!",
      sideLeaderboard: "Лидерборд",
      sideLbTip: "Выполняйте задания и продвигайтесь вперёд.",
      sideCloudRating: "Живой облачный рейтинг потока (Supabase).",

      // Topic View
      tabTheory: "Лекция",
      tabExamples: "Примеры",
      tabSim: "🎮 Симулятор",
      tabQuiz: "Тест",
      tabTask: "Задача",
      heroIntroKicker: "Введение",
      heroTopicKicker: "Тема {0} из {1}",
      heroLead: "В этой теме:",
      step1Kicker: "Шаг 1 · Лекция",
      step1Title: "Что нужно знать",
      step2Kicker: "Шаг 2 · Примеры",
      step2Title: "Как это выглядит",
      stepSimKicker: "🎮 Интерактивный симулятор · Практика",
      stepQuizKicker: "Шаг 3 · Мини-тест",
      stepQuizTitle: "Проверьте себя",
      stepQuizLead: "Выберите правильный ответ. Это не экзамен, а способ закрепить материал (+{0} XP).",
      quizDoneBadge: "Тест пройден ✓",
      quizDoneGain: "Тест пройден! +{0} XP",
      quizWrong: "Не совсем. Подумайте ещё и выберите другой вариант.",

      // Task Block
      badgeExam: "🔴 Piscine Exam",
      badgeHard: "🟡 Практика",
      badgeEasy: "🟢 Обучение",
      kickerHard: "★ Посложнее",
      kickerExam: "★ Экзамен 01 Edu",
      kickerPractice: "Практика",
      stepPracticeKicker: "Шаг {0} · {1} · {2}",
      taskLockedMsg: "Задача пока закрыта",
      taskHardNote: "Это задача посложнее: готовых строк здесь нет. Каркас (package, import, func main) уже введён в редактор справа. Идите по плану и открывайте подсказки, если застрянете. За решение - {0} XP.",
      taskPlan: "План",
      taskExpect: "Ожидаемый вывод",
      taskEasyNote: "Часть кода уже введена в редактор справа - остаётся лишь дополнить его, чтобы программа стала полной.",
      taskStep1: "Читайте код ниже сверху вниз - у каждой строки справа есть пояснение.",
      taskStep2: "Печатайте недостающие строки в редакторе справа или просто кликните по строке ниже - она вставится сама. Отступ - клавиша <kbd>Tab</kbd>.",
      taskStep3: "Нажмите «Проверить» (или <kbd>Ctrl</kbd>+<kbd>Enter</kbd>).",

      // Editor & Console
      statusWaiting: "waiting",
      statusPassed: "passed",
      btnRun: "Проверить",
      btnReset: "Сбросить",
      btnNextTask: "Следующая задача →",
      btnShowAnswer: "Показать ответ",
      consoleRes: "Результат",
      consolePressCheck: "Нажмите «Проверить» (Ctrl+Enter)",
      consoleCodeReset: "Код сброшен к каркасу",
      consoleEmpty: "Вы ещё ничего не дописали. Напечатайте код из задачи слева внутрь func main.",
      consolePassMsg: "проверка пройдена",
      consoleTestPassed: "Тест пройден.",
      consoleAssistedNote: "(ответ был открыт)",
      consoleFailedLead: "Что-то не совпало. Сравните свой код с кодом слева и попробуйте ещё раз.",
      consoleFailedHard: "Пока не всё совпало. Сверьтесь с планом слева и откройте подсказку.",
      consoleTipsTitle: "Возможные причины",
      consoleBracketMsg: "Скобки { } ( ) [ ] и кавычки должны быть парными: каждой открывающей нужна закрывающая",
      badgeSolved: "решено",
      badgeLocked: "закрыто",
      mobTabBook: "Учебник",
      mobTabCode: "Код",

      // Hints
      hintTitle: "Подсказка {0} из {1}",
      hintNeed: "Нужна подсказка?",
      hintMore: "Ещё подсказка",
      hintAllOpen: "Все подсказки открыты. Если не получается - после двух неудачных проверок справа появится «Показать ответ».",

      // Celebrations & Endcard
      endTopicPassed: "{0} пройден{1}",
      endNextIs: "Дальше: {0} — {1}. Узнаем {2}.",
      endBtnNext: "Перейти: {0} →",
      endLastTopic: "Это была последняя тема. Курс пройден!",
      endBtnDash: "На дашборд",
      endLockedTip: "🔒 Чтобы открыть следующую тему, пройдите мини-тест и решите все задачи.",
      modalCongrats: "Поздравляем! {0} пройден{1}",
      modalCourseDone: "Курс пройден!",
      modalCourseSub: "Вы прошли путь от первой программы до веб-сервиса с JSON и базами данных. Отличная работа!"
    },
    kz: {
      langBtn: "RU",
      brandSub: "Go тілінің негіздері мен 01 Edu бассейніне арналған оқу платформасы",
      setupNav: "💻 Ортаны баптау",
      arenaNav: "⚡ Тапсырмалар аренасы",
      dashboard: "Басты бет",
      logout: "шығу",
      guest: "Қонақ",
      cloud: "Бұлттық (Supabase)",
      loginTab: "Кіру",
      regTab: "Тіркелу",
      nickLabel: "Лидербордқа арналған никнейміңіз",
      passLabel: "Құпиясөз (кемінде 6 таңба)",
      loginBtn: "Аккаунтқа кіру",
      regBtn: "Тіркелу",
      guestBtn: "Құпиясөзсіз жалғастыру (жергілікті)",
      unlockBtn: "Барлық тақырыптарды ашу",
      promptCode: "Толық ашу үшін промокодты енгізіңіз:",
      searchPlaceholder: "Тақырыптар мен тапсырмаларды іздеу...",
      tracks: {
        base: "💡 Go негіздері (0–13 тақырыптар)",
        piscine: "🏊 01 Edu Piscine (Алгоритмдер, Quad, Нұсқағыштар, Рекурсия)",
        backend: "🚀 Backend, Желі және Деректер қоры (26–30 тақырыптар)"
      },
      topicPassed: "өтті",
      topicLocked: "жабық",
      simulatorBadge: "🎮 Жаттықтырғыш",
      quizName: "Шағын-тест",
      stepTheory: "1-қадам · Дәріс",
      stepExamples: "2-қадам · Мысалдар",
      stepQuiz: "3-қадам · Шағын-тест",
      stepPractice: "Тәжірибе",
      stepExam: "★ 01 Edu Емтиханы",
      needHint: "Көмек керек пе?",
      moreHint: "Тағы көмек",
      openInEditor: "Редакторда ашу →",
      checkBtn: "Тексеру",
      resetBtn: "Қалпына келтіру",
      nextTopic: "Келесі тақырып",
      backToDash: "Басты бетке",
      setupTitle: "01 Edu Piscine жұмыс ортасын баптау",
      setupSubtitle: "01 Edu кампусында және үйде қатесіз жұмыс істеу бойынша қадамдық нұсқаулық (Git, Gitea, z01, VS Code)",
      arenaTitle: "Тапсырмалар аренасы (Тәжірибелік жаттықтырғыш)",
      arenaSubtitle: "Алгоритмдерді шыңдауға, бэкенд жасауға және 01 Edu бассейніне дайындалуға арналған қосымша есептер",
      allTopics: "Барлық тақырыптар",
      filterDiff: "Күрделілік",
      allDiffs: "Барлық деңгейлер",
      easyDiff: "🟢 Оңай",
      medDiff: "🟡 Орташа",
      examDiff: "🔴 01 Edu Емтиханы",
      solveTask: "Есепті шығару →",
      solvedBadge: "✓ Шешілді",
      expectedOutput: "Күтілетін нәтиже",
      runCode: "Шешімді тексеру ▶",
      copyCode: "Көшіру",
      copied: "Көшірілді!",

      // Crumb & Nav
      crumbDash: "басты бет",
      crumbTopic: "тақырып",
      crumbIntro: "кіріспе",
      crumbSetup: "баптау",
      crumbArena: "арена",

      // Dashboard
      welcome: "Қош келдіңіз",
      statTopics: "тақырып",
      statTasks: "тапсырма",
      statDone: "орындалғаны",
      allUnlocked: "🔓 Барлық тақырыптар ашық",
      relockBtn: "Құлыптарды қосу",
      promoPlaceholder: "Промокодты енгізіңіз",
      bannerSetupTitle: "Ортаны баптау (Windows, Mac, Linux)",
      bannerSetupSub: "Git, Golang және VS Code орнату нұсқаулығы",
      bannerArenaTitle: "Тапсырмалар аренасы (+XP)",
      bannerArenaSub: "Piscine, LeetCode, Backend және AI тапсырмалары",
      sideWhatNext: "КЕЛЕСІ ҚАДАМ",
      sideContinue: "Жалғастыру →",
      sideAllDone: "Барлық тақырыптар өтілді. Тамаша жұмыс!",
      sideLeaderboard: "ЛИДЕРБОРД",
      sideLbTip: "Тапсырмаларды орындап, алға жылжыңыз.",
      sideCloudRating: "Ағымның онлайн рейтингі (Supabase).",

      // Topic View
      tabTheory: "Дәріс",
      tabExamples: "Мысалдар",
      tabSim: "🎮 Жаттықтырғыш",
      tabQuiz: "Тест",
      tabTask: "Тапсырма",
      heroIntroKicker: "Кіріспе",
      heroTopicKicker: "24 тақырыптың {0}-тақырыбы",
      heroLead: "Бұл тақырыпта:",
      step1Kicker: "1-қадам · Дәріс",
      step1Title: "Білу керек жайттар",
      step2Kicker: "2-қадам · Мысалдар",
      step2Title: "Код қалай көрінеді",
      stepSimKicker: "🎮 Интерактивті симулятор · Тәжірибе",
      stepQuizKicker: "3-қадам · Шағын-тест",
      stepQuizTitle: "Өзіңізді тексеріңіз",
      stepQuizLead: "Дұрыс жауапты таңдаңыз. Бұл емтихан емес, білімді бекіту тәсілі (+{0} XP).",
      quizDoneBadge: "Тест тапсырылды ✓",
      quizDoneGain: "Тест тапсырылды! +{0} XP",
      quizWrong: "Олай емес. Тағы ойланып, басқа нұсқаны таңдап көріңіз.",

      // Task Block
      badgeExam: "🔴 Piscine Емтиханы",
      badgeHard: "🟡 Тәжірибе",
      badgeEasy: "🟢 Оқыту",
      kickerHard: "★ Күрделірек",
      kickerExam: "★ 01 Edu Емтиханы",
      kickerPractice: "Тәжірибе",
      stepPracticeKicker: "{0}-қадам · {1} · {2}",
      taskLockedMsg: "Тапсырма әзірге жабық",
      taskHardNote: "Бұл күрделірек тапсырма: мұнда дайын жолдар жоқ. Бағдарлама қаңқасы (package, import, func main) оң жақтағы редакторда дайын тұр. Жоспар бойынша орындаңыз, қиналсаңыз көмектерді ашыңыз. Шешім үшін — {0} XP.",
      taskPlan: "Жоспар",
      taskExpect: "Күтілетін нәтиже",
      taskEasyNote: "Кодтың бір бөлігі оң жақтағы редакторға енгізілген — бағдарлама толық болуы үшін оны толықтыру жеткілікті.",
      taskStep1: "Төмендегі кодты үстінен астына қарай оқыңыз — әр жолдың оң жағында түсіндірмесі бар.",
      taskStep2: "Жетіспейтін жолдарды оң жақтағы редакторға жазыңыз немесе төмендегі жолды басыңыз — ол өзі қойылады. Шегініс — <kbd>Tab</kbd> пернесі.",
      taskStep3: "«Тексеру» түймесін басыңыз (немесе <kbd>Ctrl</kbd>+<kbd>Enter</kbd>).",

      // Editor & Console
      statusWaiting: "күтуде",
      statusPassed: "тапсырылды",
      btnRun: "Тексеру",
      btnReset: "Қалпына келтіру",
      btnNextTask: "Келесі тапсырма →",
      btnShowAnswer: "Жауапты көрсету",
      consoleRes: "Нәтиже",
      consolePressCheck: "«Тексеру» түймесін басыңыз (Ctrl+Enter)",
      consoleCodeReset: "Код бастапқы күйге келтірілді",
      consoleEmpty: "Сіз әлі ештеңе жазбадыңыз. Сол жақтағы тапсырма кодын func main ішіне жазыңыз.",
      consolePassMsg: "тексеруден сәтті өтті",
      consoleTestPassed: "Тесттен сәтті өттіңіз.",
      consoleAssistedNote: "(жауап ашылған)",
      consoleFailedLead: "Бір жері сәйкес келмеді. Өз кодыңызды сол жақтағы кодпен салыстырып, қайталап көріңіз.",
      consoleFailedHard: "Әзірге барлығы сәйкес емес. Сол жақтағы жоспармен салыстырып, көмекті ашыңыз.",
      consoleTipsTitle: "Ықтимал себептер",
      consoleBracketMsg: "Жақшалар { } ( ) [ ] мен тырнақшалар жұп болуы керек: әр ашылғанға жабылатын қажет",
      badgeSolved: "шешілді",
      badgeLocked: "жабық",
      mobTabBook: "Оқулық",
      mobTabCode: "Код",

      // Hints
      hintTitle: "{1} ішінен {0}-көмек",
      hintNeed: "Көмек керек пе?",
      hintMore: "Тағы көмек",
      hintAllOpen: "Барлық көмектер ашылды. Егер шықпаса — екі сәтсіз тексеруден кейін оң жақта «Жауапты көрсету» пайда болады.",

      // Celebrations & Endcard
      endTopicPassed: "{0} аяқталды",
      endNextIs: "Келесі: {0} — {1}. Тақырыбы: {2}.",
      endBtnNext: "Өту: {0} →",
      endLastTopic: "Бұл соңғы тақырып еді. Курс толық аяқталды!",
      endBtnDash: "Басты бетке",
      endLockedTip: "🔒 Келесі тақырыпты ашу үшін шағын-тестті тапсырып, барлық тапсырмаларды шешіңіз.",
      modalCongrats: "Құттықтаймыз! {0} аяқталды",
      modalCourseDone: "Курс аяқталды!",
      modalCourseSub: "Сіз алғашқы қарапайым бағдарламадан бастап JSON мен деректер қоры бар веб-сервиске дейінгі жолдан өттіңіз. Тамаша жұмыс!"
    }
  };

  window.t = function (key, ...args) {
    const cur = DICT[lang] || DICT.ru;
    let str = cur[key] || DICT.ru[key] || key;
    if (typeof str === "string" && args.length) {
      args.forEach((a, i) => {
        str = str.replace(new RegExp(`\\{${i}\\}`, "g"), a);
      });
    }
    return str;
  };

  window.getLang = function () {
    return lang;
  };

  window.setLang = function (newLang) {
    if (newLang !== "ru" && newLang !== "kz") return;
    localStorage.setItem(LANG_KEY, newLang);
    lang = newLang;
    window.location.reload();
  };

  window.toggleLang = function () {
    window.setLang(lang === "ru" ? "kz" : "ru");
  };

  window.tLabel = function (topic) {
    if (!topic) return "";
    const isKZ = lang === "kz";
    return topic.id === 0 ? (isKZ ? "Кіріспе" : "Введение") : (isKZ ? topic.id + "-тақырып" : "Тема " + topic.id);
  };
})();
