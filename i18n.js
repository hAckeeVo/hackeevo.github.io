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
        backend: "🚀 Backend, Сеть и Базы данных (Темы 20–24)"
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
      copied: "Скопировано!"
    },
    kz: {
      langBtn: "RU",
      brandSub: "Go тілінің негіздері және 01 Edu бассейніне арналған оқу платформасы",
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
        backend: "🚀 Backend, Желі және Деректер қоры (20–24 тақырыптар)"
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
      copied: "Көшірілді!"
    }
  };

  // Перевод названий тем для казахского языка
  const TOPIC_TITLES_KZ = {
    0: { title: "Бағдарлама деген не?", about: "компьютер кодты қалай түсінеді және неге Go таңдалады" },
    1: { title: "Бағдарлама құрылымы", about: "Go бағдарламасының құрылымы: package, import және func main" },
    2: { title: "Экранға шығару", about: "fmt.Println, fmt.Print және мәтінді шығару тәсілдері" },
    3: { title: "Айнымалылар", about: "var, қысқаша жазу := және мәліметтерді жадта сақтау" },
    4: { title: "Деректер типтері", about: "int, float64, string, bool және Go-дағы қатаң типтеу" },
    5: { title: "Арифметика және тұрақтылар", about: "+, -, *, /, % амалдары және const тұрақтылары" },
    6: { title: "Шартты операторлар if / else", about: "логикалық тармақталу, салыстыру және шешім қабылдау" },
    7: { title: "switch таңдау операторы", about: "көптеген if-тердің орнына ыңғайлы құрылым" },
    8: { title: "for циклдері", about: "әрекеттерді қайталау, санауыштар және Go-дағы жалғыз цикл" },
    9: { title: "Функциялар", about: "параметрлер, нәтиже қайтару (return) және кодты бөлшектеу" },
    10: { title: "Тілімдер (slices)", about: "динамикалық массивтер, append() және жадты кеңейту" },
    11: { title: "Карталар (мапалар / сөздіктер)", about: "кілт-мән (key-value) бойынша жедел іздеу" },
    12: { title: "Құрылымдар мен әдістер (struct)", about: "өзіндік деректер типтерін және объектілерді жасау" },
    13: { title: "Қателерді өңдеу (error)", about: "Go-дағы қателерді дұрыс тексеру (if err != nil)" },
    14: { title: "Тор мен координаттар: Quad (01 Edu)", about: "ішкі циклдер, (x, y) координаттары және аты аңызға айналған Quad есебі" },
    15: { title: "Нұсқағыштар және жад: Pointers (01 Edu)", about: "жад ұяшықтарының адрестері (&), оқу (*) және мәндерді тікелей өзгерту" },
    16: { title: "Жолдар, руналар және ASCII (01 Edu Piscine)", about: "Unicode, UTF-8 символдары, StrRev және жолды аудару" },
    17: { title: "Итерация vs Рекурсия: Факториал және Дәреже", about: "функцияның өзін-өзі шақыруы, тоқтау шарты және стек жады" },
    18: { title: "Алгоритмдер: Фибоначчи, Түбір және Жай сандар", about: "жай сандарды тексеру IsPrime және O(√N) тиімділігі" },
    19: { title: "Piscine шыңы: 8 ферзь есебі (EightQueens)", about: "шахмат тақтасындағы кері шегіну (backtracking) алгоритмі" },
    20: { title: "JSON деректер форматы", about: "құрылымдарды JSON-ға айналдыру және желілік деректермен алмасу" },
    21: { title: "HTTP-сервер", about: "Go-да веб-сервер көтеру және сұраныстарды қабылдау" },
    22: { title: "REST API жасау", about: "GET/POST сұраныстары, JSON жауаптары және маршрутизация" },
    23: { title: "Деректер қоры және SQL", about: "SQLite, SELECT, INSERT және қауіпсіз параметрленген сұраныстар" },
    24: { title: "Мини-жоба: Тапсырмалар тізімі (Todo API)", about: "барлық білімді біріктіріп, нақты жұмыс істейтін толық веб-сервис жасау" }
  };

  window.t = function (key) {
    const cur = DICT[lang] || DICT.ru;
    return cur[key] || DICT.ru[key] || key;
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

  window.getLocalizedTopic = function (topic) {
    if (lang === "kz" && TOPIC_TITLES_KZ[topic.id]) {
      return {
        ...topic,
        title: TOPIC_TITLES_KZ[topic.id].title,
        about: TOPIC_TITLES_KZ[topic.id].about
      };
    }
    return topic;
  };
})();

