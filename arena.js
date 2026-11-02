// arena.js: Тренажёр задач / Тапсырмалар аренасы (#/arena)
// Независимый сборник задач по всем темам для дополнительной практики

(function () {
  const ARENA_TASKS = [
    // ----------------------------------------------------
    // TRACK: 01 Edu Piscine
    // ----------------------------------------------------
    {
      id: "ar_comb",
      track: "piscine",
      trackTitle: "01 Edu Piscine",
      title: "PrintComb: комбинации из двух цифр",
      titleKz: "PrintComb: екі таңбалы сандар комбинациясы",
      diff: "easy",
      xp: 40,
      desc: "Напишите функцию, которая выводит в консоль все уникальные комбинации из двух различных цифр в возрастающем порядке через запятую и пробел:\n`01, 02, 03, ..., 78, 79, 89`",
      descKz: "Өспелі ретпен үтір және бос орын арқылы екі әртүрлі цифрдың барлық бірегей комбинацияларын экранға шығаратын функция жазыңыз:\n`01, 02, 03, ..., 78, 79, 89`",
      starter: `package main

import "fmt"

func PrintComb() {
    // Напишите вложенные циклы от '0' до '9'
}

func main() {
    PrintComb()
}
`,
      output: "01, 02, 03, ..., 78, 79, 89",
      checks: [
        { re: /for\s+[a-zA-Z0-9_]+\s*:=\s*['0-9]/, msg: "Используйте цикл for для первой цифры" },
        { re: /for\s+[a-zA-Z0-9_]+\s*:=\s*[a-zA-Z0-9_]+\s*\+\s*1/, msg: "Вторая цифра должна быть строго больше первой (i + 1)" },
        { re: /fmt\.(Print|Printf)/, msg: "Используйте fmt.Print для вывода без лишних переносов строк" }
      ],
      solution: `package main

import "fmt"

func PrintComb() {
    for i := '0'; i <= '8'; i++ {
        for j := i + 1; j <= '9'; j++ {
            fmt.Printf("%c%c", i, j)
            if !(i == '8' && j == '9') {
                fmt.Print(", ")
            }
        }
    }
    fmt.Println()
}

func main() {
    PrintComb()
}
`
    },
    {
      id: "ar_strlen",
      track: "piscine",
      trackTitle: "01 Edu Piscine",
      title: "StrLen: честный подсчёт символов Unicode",
      titleKz: "StrLen: Unicode символдерінің нақты санын табу",
      diff: "easy",
      xp: 35,
      desc: "Обычный `len(str)` в Go считает количество БАЙТ, а не букв (кириллица занимает по 2 байта, эмодзи — 4). Напишите функцию `StrLen(s string) int`, которая возвращает настоящее количество символов строки.",
      descKz: "Go-дағы `len(str)` әріптерді емес, БАЙТ санын санайды (кириллица 2 байт, эмодзи 4 байт алады). Мәтіндегі символдардың нақты санын қайтаратын `StrLen(s string) int` функциясын жазыңыз.",
      starter: `package main

import "fmt"

func StrLen(s string) int {
    // Преобразуйте строку в срез рун []rune
    return 0
}

func main() {
    fmt.Println(StrLen("Сәлем!")) // должно быть 6
    fmt.Println(StrLen("Go 🚀"))  // должно быть 4
}
`,
      output: "6\n4",
      checks: [
        { re: /\[\]rune\(/, msg: "Преобразуйте строку в срез рун []rune(s)" },
        { re: /return\s+len\(/, msg: "Верните длину среза рун len(r)" }
      ],
      solution: `package main

import "fmt"

func StrLen(s string) int {
    return len([]rune(s))
}

func main() {
    fmt.Println(StrLen("Сәлем!"))
    fmt.Println(StrLen("Go 🚀"))
}
`
    },
    {
      id: "ar_rot14",
      track: "piscine",
      trackTitle: "01 Edu Piscine",
      title: "Rot14: шифр Цезаря со сдвигом на 14",
      titleKz: "Rot14: 14 таңбаға ығысатын Цезарь шифры",
      diff: "med",
      xp: 55,
      desc: "Напишите функцию `Rot14(s string) string`, которая сдвигает каждую латинскую букву на 14 позиций вперёд по алфавиту с закольцовыванием от z к a. Регистр букв должен сохраняться, остальные символы не меняются.",
      descKz: "Әрбір латын әрпін алфавит бойынша 14 позицияға алға жылжытатын `Rot14(s string) string` функциясын жазыңыз. Бас әріптер бас әріп болып қалуы керек, басқа таңбалар өзгермейді.",
      starter: `package main

import "fmt"

func Rot14(s string) string {
    r := []rune(s)
    // Обойдите руны и сдвиньте латинские буквы на 14
    return string(r)
}

func main() {
    fmt.Println(Rot14("Hello!")) // должно быть "Vszzc!"
}
`,
      output: "Vszzc!",
      checks: [
        { re: /for\s+.*range/, msg: "Используйте цикл for для обхода символов" },
        { re: /['a']\s*<=\s*.*&&.*<=\s*['z']|['A']\s*<=\s*.*&&.*<=\s*['Z']/, msg: "Проверяйте диапазон 'a'..'z' и 'A'..'Z'" },
        { re: /%\s*26/, msg: "Используйте остаток от деления % 26 для закольцовывания алфавита" }
      ],
      solution: `package main

import "fmt"

func Rot14(s string) string {
    r := []rune(s)
    for i, c := range r {
        if c >= 'a' && c <= 'z' {
            r[i] = 'a' + (c-'a'+14)%26
        } else if c >= 'A' && c <= 'Z' {
            r[i] = 'A' + (c-'A'+14)%26
        }
    }
    return string(r)
}

func main() {
    fmt.Println(Rot14("Hello!"))
}
`
    },

    // ----------------------------------------------------
    // TRACK: Алгоритмы и LeetCode
    // ----------------------------------------------------
    {
      id: "ar_binsearch",
      track: "algo",
      trackTitle: "Алгоритмы",
      title: "BinarySearch: бинарный поиск в срезе",
      titleKz: "BinarySearch: сұрыпталған тілімнен екілік іздеу",
      diff: "easy",
      xp: 45,
      desc: "Напишите функцию `BinarySearch(arr []int, target int) int`. В отсортированном срезе найдите индекс элемента target за O(log N). Если элемент не найден — верните -1.",
      descKz: "Сұрыпталған массивтен target элементінің индексін O(log N) уақытында табатын `BinarySearch(arr []int, target int) int` функциясын жазыңыз. Табылмаса -1 қайтарыңыз.",
      starter: `package main

import "fmt"

func BinarySearch(arr []int, target int) int {
    left, right := 0, len(arr)-1
    // Реализуйте алгоритм деления пополам
    return -1
}

func main() {
    nums := []int{1, 3, 5, 7, 9, 11, 15}
    fmt.Println(BinarySearch(nums, 7))  // 3
    fmt.Println(BinarySearch(nums, 10)) // -1
}
`,
      output: "3\n-1",
      checks: [
        { re: /while|for\s+left\s*<=\s*right/, msg: "Цикл поиска должен продолжаться пока left <= right" },
        { re: /(left\s*\+\s*right)\s*\/\s*2|left\s*\+\s*\(right\s*-\s*left\)\s*\/\s*2/, msg: "Вычисляйте середину mid = (left + right) / 2" },
        { re: /return\s+mid/, msg: "При совпадении верните mid" }
      ],
      solution: `package main

import "fmt"

func BinarySearch(arr []int, target int) int {
    left, right := 0, len(arr)-1
    for left <= right {
        mid := (left + right) / 2
        if arr[mid] == target {
            return mid
        } else if arr[mid] < target {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }
    return -1
}

func main() {
    nums := []int{1, 3, 5, 7, 9, 11, 15}
    fmt.Println(BinarySearch(nums, 7))
    fmt.Println(BinarySearch(nums, 10))
}
`
    },
    {
      id: "ar_twosum",
      track: "algo",
      trackTitle: "Алгоритмы",
      title: "TwoSum: поиск пары с суммой Target за O(N)",
      titleKz: "TwoSum: қосындысы Target болатын жұпты O(N) табу",
      diff: "med",
      xp: 60,
      desc: "Классическая задача с технических собеседований: дан массив целых чисел и число target. Найдите индексы двух чисел, которые в сумме дают target, используя map для хранения просмотренных элементов за O(N).",
      descKz: "Сұхбаттасуларда жиі кездесетін тапсырма: бүтін сандар массиві және target берілген. Қосындысы target-ке тең екі санның индекстерін map арқылы O(N) уақытында табыңыз.",
      starter: `package main

import "fmt"

func TwoSum(nums []int, target int) []int {
    seen := make(map[int]int) // число -> его индекс
    // Пройдите по массиву и проверяйте разность target - num
    return nil
}

func main() {
    res := TwoSum([]int{2, 7, 11, 15}, 9)
    fmt.Println(res) // [0, 1]
}
`,
      output: "[0 1]",
      checks: [
        { re: /make\s*\(\s*map\[int\]int/, msg: "Используйте хеш-таблицу make(map[int]int)" },
        { re: /target\s*-\s*num|target\s*-\s*v|target\s*-\s*nums\[/, msg: "Вычисляйте необходимое второе число: diff = target - num" },
        { re: /return\s+\[\]int\{/, msg: "Верните срез с двумя индексами []int{idx, i}" }
      ],
      solution: `package main

import "fmt"

func TwoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, num := range nums {
        diff := target - num
        if idx, ok := seen[diff]; ok {
            return []int{idx, i}
        }
        seen[num] = i
    }
    return nil
}

func main() {
    res := TwoSum([]int{2, 7, 11, 15}, 9)
    fmt.Println(res)
}
`
    },

    // ----------------------------------------------------
    // TRACK: Backend & Web API
    // ----------------------------------------------------
    {
      id: "ar_email_val",
      track: "backend",
      trackTitle: "Backend & Web",
      title: "Email Validator: базовая валидация email",
      titleKz: "Email Validator: электрондық поштаны тексеру",
      diff: "easy",
      xp: 40,
      desc: "Напишите функцию `IsValidEmail(email string) bool`. Адрес корректен, если в нём есть ровно один символ '@', до '@' есть хотя бы один символ, после '@' есть точка '.', и после точки есть доменная зона.",
      descKz: "Электрондық поштаның дұрыстығын тексеретін `IsValidEmail(email string) bool` функциясын жазыңыз. Онда дәл бір '@' және одан кейін кемінде бір нүкте '.' болуы керек.",
      starter: `package main

import (
    "fmt"
    "strings"
)

func IsValidEmail(email string) bool {
    parts := strings.Split(email, "@")
    if len(parts) != 2 || parts[0] == "" || parts[1] == "" {
        return false
    }
    return strings.Contains(parts[1], ".") && !strings.HasSuffix(parts[1], ".")
}

func main() {
    fmt.Println(IsValidEmail("user@example.com")) // true
    fmt.Println(IsValidEmail("bad-email@"))        // false
}
`,
      output: "true\nfalse",
      checks: [
        { re: /strings\.Split|strings\.Contains/, msg: "Используйте функции пакета strings" },
        { re: /return/, msg: "Функция должна возвращать булево значение true/false" }
      ],
      solution: `package main

import (
    "fmt"
    "strings"
)

func IsValidEmail(email string) bool {
    parts := strings.Split(email, "@")
    if len(parts) != 2 || parts[0] == "" || parts[1] == "" {
        return false
    }
    return strings.Contains(parts[1], ".") && !strings.HasSuffix(parts[1], ".")
}

func main() {
    fmt.Println(IsValidEmail("user@example.com"))
    fmt.Println(IsValidEmail("bad-email@"))
}
`
    },

    // ----------------------------------------------------
    // TRACK: AI Engineering
    // ----------------------------------------------------
    {
      id: "ar_ai_prompt",
      track: "ai",
      trackTitle: "AI Engineering",
      title: "Prompt Template: безопасный шаблонизатор промптов",
      titleKz: "Prompt Template: қауіпсіз промпт шаблонизаторы",
      diff: "easy",
      xp: 45,
      desc: "В AI-инженерии критически важно безопасно подставлять переменные в промпт для LLM (Gemini, ChatGPT). Напишите функцию `BuildPrompt(template string, vars map[string]string) string`, которая заменяет все `{{key}}` на соответствующие значения из словаря vars.",
      descKz: "AI-инженерияда LLM модельдеріне (Gemini, ChatGPT) айнымалыларды қауіпсіз енгізу маңызды. `{{key}}` белгілерін берілген vars сөздігіндегі мәндермен алмастыратын `BuildPrompt` функциясын жазыңыз.",
      starter: `package main

import (
    "fmt"
    "strings"
)

func BuildPrompt(tmpl string, vars map[string]string) string {
    res := tmpl
    // Обойдите vars и замените {{key}} на value через strings.ReplaceAll
    return res
}

func main() {
    t := "Ты — ментор по {{language}}. Объясни тему {{topic}} для новичка."
    data := map[string]string{
        "language": "Go",
        "topic":    "Указатели",
    }
    fmt.Println(BuildPrompt(t, data))
}
`,
      output: "Ты — ментор по Go. Объясни тему Указатели для новичка.",
      checks: [
        { re: /strings\.ReplaceAll/, msg: "Используйте strings.ReplaceAll(res, placeholder, val)" },
        { re: /\{\{.*\}\}/, msg: "Заменяйте плейсхолдеры в фигурных скобках {{key}}" }
      ],
      solution: `package main

import (
    "fmt"
    "strings"
)

func BuildPrompt(tmpl string, vars map[string]string) string {
    res := tmpl
    for k, v := range vars {
        res = strings.ReplaceAll(res, "{{"+k+"}}", v)
    }
    return res
}

func main() {
    t := "Ты — ментор по {{language}}. Объясни тему {{topic}} для новичка."
    data := map[string]string{
        "language": "Go",
        "topic":    "Указатели",
    }
    fmt.Println(BuildPrompt(t, data))
}
`
    },
    {
      id: "ar_ai_clean_json",
      track: "ai",
      trackTitle: "AI Engineering",
      title: "CleanLLMJSON: извлечение чистого JSON из ответа нейросети",
      titleKz: "CleanLLMJSON: нейрожелі жауабынан таза JSON бөліп алу",
      diff: "med",
      xp: 55,
      desc: "Нейросети часто оборачивают структурированный ответ в маркдаун с тройными кавычками ````json { ... } ````. Напишите функцию `CleanLLMJSON(raw string) string`, которая аккуратно очищает обёртку и возвращает валидную JSON строку.",
      descKz: "Нейрожелілер көбінесе жауапты ````json { ... } ```` маркдаунына орап жібереді. Осы орамды тазартып, таза JSON мәтінін қайтаратын `CleanLLMJSON` функциясын жазыңыз.",
      starter: `package main

import (
    "fmt"
    "strings"
)

func CleanLLMJSON(raw string) string {
    s := strings.TrimSpace(raw)
    // Удалите начальные \`\`\`json или \`\`\` и завершающие \`\`\`
    return s
}

func main() {
    raw := "\`\`\`json\\n{\\"status\\": \\"success\\", \\"code\\": 200}\\n\`\`\`"
    fmt.Println(CleanLLMJSON(raw))
}
`,
      output: `{"status": "success", "code": 200}`,
      checks: [
        { re: /strings\.TrimPrefix/, msg: "Используйте strings.TrimPrefix для удаления ```json" },
        { re: /strings\.TrimSuffix/, msg: "Используйте strings.TrimSuffix для удаления завершающих ```" }
      ],
      solution: `package main

import (
    "fmt"
    "strings"
)

func CleanLLMJSON(raw string) string {
    s := strings.TrimSpace(raw)
    if strings.HasPrefix(s, "\`\`\`json") {
        s = strings.TrimPrefix(s, "\`\`\`json")
    } else if strings.HasPrefix(s, "\`\`\`") {
        s = strings.TrimPrefix(s, "\`\`\`")
    }
    s = strings.TrimSuffix(s, "\`\`\`")
    return strings.TrimSpace(s)
}

func main() {
    raw := "\`\`\`json\\n{\\"status\\": \\"success\\", \\"code\\": 200}\\n\`\`\`"
    fmt.Println(CleanLLMJSON(raw))
}
`
    }
  ];

  window.ARENA_TASKS = ARENA_TASKS;

  window.renderArenaPage = function (container, user) {
    const lang = (window.getLang && window.getLang()) || "ru";
    const isKZ = lang === "kz";
    const done = (window.store && window.store.get("done:" + user)) || {};

    let currentTrack = "all";
    let currentDiff = "all";

    container.innerHTML = `
      <div class="arena-wrap" style="max-width:1080px;margin:24px auto 60px;padding:0 20px">
        <div style="margin-bottom:24px">
          <a href="#/" class="btn ghost small" style="margin-bottom:14px;display:inline-flex;align-items:center;gap:6px">
            ← ${isKZ ? "Басты бетке" : "На дашборд"}
          </a>
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:14px">
            <div>
              <h1 style="font-size:28px;margin:0 0 8px;color:#fff">
                ⚡ ${isKZ ? "Тапсырмалар аренасы (Практикалық тренажер)" : "Арена задач (Практический тренажёр)"}
              </h1>
              <p style="color:var(--dim);font-size:15px;margin:0;line-height:1.5">
                ${isKZ
                  ? "Алгоритмдерді шыңдау, 01 Edu бассейніне дайындық және Backend / AI инженерия бойынша тәуелсіз есептер жинағы."
                  : "Независимый сборник задач для оттачивания алгоритмов, подготовки к бассейну 01 Edu и прокачки в Backend / AI инженерии."}
              </p>
            </div>
            <div style="background:#141318;border:1px solid var(--line);border-radius:6px;padding:12px 18px;text-align:right">
              <span style="font-size:12px;color:var(--muted);text-transform:uppercase;font-family:var(--mono)">${isKZ ? "Шешілгені" : "Решено в Арене"}</span>
              <div style="font-size:22px;font-weight:700;color:var(--accent-l)" id="arenaSolvedCount">0 / ${ARENA_TASKS.length}</div>
            </div>
          </div>
        </div>

        <!-- Фильтры -->
        <div class="arena-filters" style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px;background:#141318;padding:14px 18px;border-radius:6px;border:1px solid var(--line)">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:13px;color:var(--muted);font-weight:600">${isKZ ? "Бағыт:" : "Трек:"}</span>
            <select id="arenaTrackSelect" style="padding:6px 12px;background:#0d0c10;border:1px solid var(--line);border-radius:4px;color:#fff;font:500 13px var(--sans)">
              <option value="all">${isKZ ? "Барлық бағыттар" : "Все направления"}</option>
              <option value="piscine">🏊 01 Edu Piscine</option>
              <option value="algo">⚡ Алгоритмы & LeetCode</option>
              <option value="backend">🚀 Backend & Web</option>
              <option value="ai">🤖 AI Engineering</option>
            </select>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:13px;color:var(--muted);font-weight:600">${isKZ ? "Күрделілік:" : "Сложность:"}</span>
            <select id="arenaDiffSelect" style="padding:6px 12px;background:#0d0c10;border:1px solid var(--line);border-radius:4px;color:#fff;font:500 13px var(--sans)">
              <option value="all">${isKZ ? "Барлық деңгейлер" : "Все уровни"}</option>
              <option value="easy">🟢 Easy (${isKZ ? "Оңай" : "Легко"})</option>
              <option value="med">🟡 Medium (${isKZ ? "Орташа" : "Средне"})</option>
            </select>
          </div>
        </div>

        <!-- Сетка задач -->
        <div class="arena-grid" id="arenaGrid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:16px"></div>

        <!-- Модалка решения задачи -->
        <div id="arenaModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:999;overflow-y:auto;padding:20px"></div>
      </div>
    `;

    const grid = container.querySelector("#arenaGrid");
    const trackSelect = container.querySelector("#arenaTrackSelect");
    const diffSelect = container.querySelector("#arenaDiffSelect");
    const solvedCountEl = container.querySelector("#arenaSolvedCount");
    const modal = container.querySelector("#arenaModal");

    function renderCards() {
      const filtered = ARENA_TASKS.filter(t => {
        const matchTrack = currentTrack === "all" || t.track === currentTrack;
        const matchDiff = currentDiff === "all" || t.diff === currentDiff;
        return matchTrack && matchDiff;
      });

      const solvedTotal = ARENA_TASKS.filter(t => done[t.id]).length;
      solvedCountEl.textContent = `${solvedTotal} / ${ARENA_TASKS.length}`;

      if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1;padding:40px;text-align:center;color:var(--dim)">${isKZ ? "Таңдалған сүзгілер бойынша тапсырмалар табылмады" : "По выбранным фильтрам задач не найдено"}</div>`;
        return;
      }

      grid.innerHTML = filtered.map(t => {
        const isSolved = !!done[t.id];
        const diffBadge = t.diff === "easy" 
          ? '<span style="font-size:11px;padding:2px 8px;border-radius:10px;background:rgba(79,209,139,0.15);color:var(--ok);border:1px solid rgba(79,209,139,0.3)">🟢 Easy</span>'
          : '<span style="font-size:11px;padding:2px 8px;border-radius:10px;background:rgba(245,158,11,0.15);color:#f59e0b;border:1px solid rgba(245,158,11,0.3)">🟡 Medium</span>';

        return `
          <div class="arena-card" style="background:#141318;border:1px solid ${isSolved ? "var(--ok)" : "var(--line)"};border-radius:6px;padding:18px;display:flex;flex-direction:column;justify-content:space-between;transition:border-color .15s">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                <span style="font:600 11px var(--mono);text-transform:uppercase;color:var(--accent-l)">${esc(t.trackTitle)}</span>
                <div style="display:flex;gap:6px;align-items:center">
                  ${diffBadge}
                  <span style="font:600 11px var(--mono);color:var(--muted)">+${t.xp} XP</span>
                </div>
              </div>
              <h3 style="font-size:16px;margin:0 0 8px;color:#fff">${esc(isKZ && t.titleKz ? t.titleKz : t.title)}</h3>
              <p style="font-size:13px;color:var(--dim);margin:0 0 14px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">
                ${esc(isKZ && t.descKz ? t.descKz : t.desc)}
              </p>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid var(--line)">
              ${isSolved 
                ? '<span style="color:var(--ok);font:600 12px var(--mono)">✓ Шешілді</span>' 
                : '<span style="color:var(--muted);font:500 12px var(--mono)">Жаңа</span>'}
              <button class="btn small ${isSolved ? "ghost" : "primary"} open-task-btn" data-tid="${t.id}">
                ${isSolved ? (isKZ ? "Қайта ашу" : "Повторить") : (isKZ ? "Есепті шығару →" : "Решать задачу →")}
              </button>
            </div>
          </div>
        `;
      }).join("");

      grid.querySelectorAll(".open-task-btn").forEach(b => {
        b.onclick = () => {
          const tid = b.dataset.tid;
          const task = ARENA_TASKS.find(x => x.id === tid);
          if (task) openTaskModal(task);
        };
      });
    }

    trackSelect.onchange = () => { currentTrack = trackSelect.value; renderCards(); };
    diffSelect.onchange = () => { currentDiff = diffSelect.value; renderCards(); };

    function openTaskModal(t) {
      modal.style.display = "block";
      const isSolved = !!done[t.id];
      const savedCode = (window.store && window.store.get(`arena_code:${user}:${t.id}`)) || t.starter;

      modal.innerHTML = `
        <div style="max-width:880px;margin:40px auto;background:#171520;border:1px solid var(--line);border-radius:8px;padding:24px;box-shadow:0 12px 40px rgba(0,0,0,0.6)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;border-bottom:1px solid var(--line);padding-bottom:12px">
            <div>
              <span style="font:600 11px var(--mono);text-transform:uppercase;color:var(--accent-l)">${esc(t.trackTitle)} · +${t.xp} XP</span>
              <h2 style="font-size:20px;margin:4px 0 0;color:#fff">${esc(isKZ && t.titleKz ? t.titleKz : t.title)}</h2>
            </div>
            <button id="closeModalBtn" class="btn ghost small" style="font-size:16px;line-height:1;padding:6px 12px">✕</button>
          </div>

          <p style="font-size:14px;color:var(--text);line-height:1.55;white-space:pre-wrap;margin:0 0 16px">${esc(isKZ && t.descKz ? t.descKz : t.desc)}</p>

          <div style="margin-bottom:14px">
            <span style="font:600 12px var(--mono);color:var(--muted)">main.go (Редактор кода):</span>
            <textarea id="arenaCodeInput" style="width:100%;height:220px;margin-top:6px;background:#0d0c10;border:1px solid var(--line);border-radius:4px;padding:12px;color:#f1eff8;font:13.5px var(--mono);line-height:1.5;resize:vertical;outline:none">${esc(savedCode)}</textarea>
          </div>

          <div style="display:flex;gap:10px;align-items:center;margin-bottom:16px">
            <button class="btn primary" id="arenaCheckBtn">${isKZ ? "Шешімді тексеру ▶" : "Проверить решение ▶"}</button>
            <button class="btn ghost small" id="arenaResetBtn">${isKZ ? "Бастапқы код" : "Сбросить к каркасу"}</button>
            <button class="btn ghost small" id="arenaSolutionBtn" style="margin-left:auto">${isKZ ? "Жауапты көрсету" : "Показать ответ"}</button>
          </div>

          <div id="arenaResultArea" style="display:none;background:#0d0c10;border:1px solid var(--line);border-radius:4px;padding:14px;font-size:13.5px"></div>
        </div>
      `;

      const codeInput = modal.querySelector("#arenaCodeInput");
      const checkBtn = modal.querySelector("#arenaCheckBtn");
      const resetBtn = modal.querySelector("#arenaResetBtn");
      const solBtn = modal.querySelector("#arenaSolutionBtn");
      const resArea = modal.querySelector("#arenaResultArea");
      const closeBtn = modal.querySelector("#closeModalBtn");

      closeBtn.onclick = () => { modal.style.display = "none"; renderCards(); };
      modal.onclick = (e) => { if (e.target === modal) { modal.style.display = "none"; renderCards(); } };

      codeInput.oninput = () => {
        if (window.store) window.store.set(`arena_code:${user}:${t.id}`, codeInput.value);
      };

      resetBtn.onclick = () => {
        codeInput.value = t.starter;
        codeInput.oninput();
        resArea.style.display = "none";
      };

      solBtn.onclick = () => {
        codeInput.value = t.solution;
        codeInput.oninput();
        resArea.style.display = "block";
        resArea.innerHTML = `<span style="color:var(--dim)">${isKZ ? "Дайын жауап енгізілді. Оны тексеру үшін 'Шешімді тексеру' батырмасын басыңыз." : "Эталонное решение вставлено в редактор. Нажмите «Проверить решение» для зачёта."}</span>`;
      };

      checkBtn.onclick = () => {
        const src = codeInput.value.replace(/\/\/.*$/gm, "");
        const results = t.checks.map(c => ({ ok: c.re.test(src), msg: c.msg }));
        const passed = results.every(r => r.ok);

        resArea.style.display = "block";
        if (passed) {
          resArea.innerHTML = `
            <div style="color:var(--ok);font-weight:700;font-size:15px;margin-bottom:6px">
              🎉 ${isKZ ? "Тамаша! Барлық тексерулер сәтті өтті! +" + t.xp + " XP" : "Тест пройден! Решение верно! +" + t.xp + " XP"}
            </div>
            <div style="color:var(--muted);margin-bottom:8px">${isKZ ? "Күтілетін нәтиже:" : "Ожидаемый вывод программы:"}</div>
            <pre style="background:#141318;padding:8px 12px;border-radius:4px;font:12.5px var(--mono);color:var(--ok)">${esc(t.output)}</pre>
          `;
          if (!done[t.id]) {
            done[t.id] = true;
            if (window.store) window.store.set("done:" + user, done);
            if (window.sbSyncTask) window.sbSyncTask(t.id, t.xp, false);
            if (window.refreshBadges) window.refreshBadges();
            if (window.chrome) window.chrome();
          }
        } else {
          resArea.innerHTML = `
            <div style="color:var(--bad);font-weight:700;font-size:14px;margin-bottom:6px">
              ${isKZ ? "Қателер анықталды:" : "Решение ещё неполное:"}
            </div>
            <ul style="margin:6px 0 0 18px;padding:0;color:#e5e3ec">
              ${results.map(r => `<li style="color:${r.ok ? "var(--ok)" : "var(--bad)"}">${r.ok ? "✓ " : "✗ "}${esc(r.msg)}</li>`).join("")}
            </ul>
          `;
        }
      };
    }

    renderCards();
  };

  function esc(s) {
    return String(s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  }
})();

