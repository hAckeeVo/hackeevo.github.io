// 01 Edu Piscine Go: Квесты 2, 3, 4 (Quad, Указатели, Строки/Руны, Рекурсия, Алгоритмы, 8 Ферзей).
// Подключается перед more.js или сортируется в app.js. Темы 14-19.

(function () {
  const R = String.raw;
  const F = "```";

  function makeTask(o) {
    const body = o.body || [];
    const lines = o.lines || [
      ["package main", "Каркас программы."],
      ["", ""],
      ['import "fmt"', "Подключаем инструмент вывода текста."],
      ["", ""],
      ...body,
    ];
    return {
      id: o.id,
      title: o.title,
      desc: o.desc,
      hard: !!o.hard,
      exam: !!o.exam,
      plan: o.plan || null,
      lines,
      output: o.output,
      hint: o.hint,
      checks: o.checks,
      starter: o.starter || "package main\n\nimport \"fmt\"\n\n// Пишите функцию здесь\n\nfunc main() {\n    // Проверка решения\n}\n",
      solution: o.solution || lines.map(l => l[0]).join("\n") + "\n",
    };
  }

  const PISCINE_TOPICS = [
    // ==========================================
    // ТЕМА 14: Сетка и координаты: Quad (01 Edu)
    // ==========================================
    {
      id: 14,
      track: "piscine",
      widgetTitle: "Интерактивный симулятор Quad и 2D-координат",
      title: "Сетка и координаты: Quad (01 Edu)",
      about: "как работают вложенные циклы, система координат (x, y), строки и столбцы на примере легендарной задачи Quad",
      theory: R`
В бассейне 01 Edu задача **Quad** вызывает больше всего ступора у новичков. Студенты путаются во вложенных циклах и не понимают, в какой строке и в каком столбце они находятся прямо сейчас.

Давайте разберёмся раз и навсегда!

Консоль — это двумерная таблица (сетка):
- **X (горизонталь)** — это ширина, количество столбцов (слева направо от {{0}} до {{x - 1}}). В коде его называют {{col}} (column).
- **Y (вертикаль)** — это высота, количество строк (сверху вниз от {{0}} до {{y - 1}}). В коде его называют {{row}} (ряд/строка).

Чтобы обойти такую сетку, используют **два вложенных цикла**:
1. Внешний цикл перебирает строки: {{for row := 0; row < y; row++}}.
2. Внутренний цикл печатает символы в текущей строке: {{for col := 0; col < x; col++}}.
3. В конце каждой строки (после внутреннего цикла) обязательно делается перенос строки: {{fmt.Println()}}.

Как понять, какой символ печатать в клетке {{(col, row)}}?
- **Углы**: это клетки, где {{row}} — первая (0) или последняя (y-1), И одновременно {{col}} — первый (0) или последний (x-1). В QuadA все 4 угла — буква {{"o"}}.
- **Верх и низ**: {{row == 0 || row == y-1}} (но не углы) — печатаем {{"-"}}.
- **Левый и правый бока**: {{col == 0 || col == x-1}} (но не углы) — печатаем {{"|"}}.
- **Середина**: всё остальное — это пробел {{" "}}!
`,
      examples: R`
Вот как выглядит работающая функция {{QuadA(5, 3)}}:

${F}
package main

import "fmt"

func QuadA(x, y int) {
    if x <= 0 || y <= 0 {
        return
    }
    for row := 0; row < y; row++ {
        for col := 0; col < x; col++ {
            if (row == 0 || row == y-1) && (col == 0 || col == x-1) {
                fmt.Print("o")
            } else if row == 0 || row == y-1 {
                fmt.Print("-")
            } else if col == 0 || col == x-1 {
                fmt.Print("|")
            } else {
                fmt.Print(" ")
            }
        }
        fmt.Println()
    }
}

func main() {
    QuadA(5, 3)
}
${F}

Результат на экране:

${F}
o---o
|   |
o---o
${F}
`,
      quiz: [
        {
          q: "За что отвечает внешний цикл в задаче Quad?",
          o: ["За переход по строкам (row сверху вниз)", "За печать символов в строке", "За подсчёт площади"],
          why: "Внешний цикл перебирает ряды {{row}} от 0 до y-1, а внутренний печатает символы строки.",
        },
        {
          q: "Какое условие определяет верхний левый угол сетки?",
          o: ["row == 0 && col == 0", "row == 0 || col == 0", "row == y-1"],
          why: "Верхний левый угол находится на пересечении первой строки (0) и первого столбца (0).",
        },
      ],
      tasks: [
        makeTask({
          id: "t45",
          title: "QuadA (углы o, границы - и |)",
          desc: R`Напишите функцию {{QuadA(x, y int)}}, которая рисует прямоугольник: углы — {{"o"}}, верх и низ — {{"-"}}, боковые стороны — {{"|"}}, а внутри — пробелы. Если x или y меньше либо равны 0, функция ничего не печатает.`,
          body: [
            ["func QuadA(x, y int) {", "Объявляем функцию QuadA."],
            ["    if x <= 0 || y <= 0 { return }", "Защита: если размеры неположительные, сразу выходим."],
            ["    for row := 0; row < y; row++ {", "Внешний цикл по строкам от 0 до y-1."],
            ["        for col := 0; col < x; col++ {", "Внутренний цикл по колонкам от 0 до x-1."],
            ['            if (row == 0 || row == y-1) && (col == 0 || col == x-1) { fmt.Print("o") }', "Все 4 угла - буква o."],
            ['            else if row == 0 || row == y-1 { fmt.Print("-") }', "Верхняя и нижняя границы."],
            ['            else if col == 0 || col == x-1 { fmt.Print("|") }', "Левая и правая границы."],
            ['            else { fmt.Print(" ") }', "Внутри - пробел."],
            ["        }", "Конец строки."],
            ["        fmt.Println()", "Перевод строки в конце каждого ряда."],
            ["    }", "Конец внешнего цикла."],
            ["}", "Конец функции."],
            ["", ""],
            ["func main() {", "Точка входа."],
            ["    QuadA(5, 3)", "Проверяем на 5х3."],
            ["}", "Конец main."],
          ],
          output: "o---o\n|   |\no---o",
          hint: "Обратите внимание: внутри клетки используется fmt.Print (без ln), а перевод строки fmt.Println() делается после выхода из внутреннего цикла.",
          checks: [
            { re: /func\s+QuadA\s*\(\s*x\s*,\s*y\s+int\s*\)/, msg: "func QuadA(x, y int)" },
            { re: /for\s+row\s*:=\s*0\s*;\s*row\s*<\s*y/, msg: "Цикл по строкам: for row := 0; row < y; row++" },
            { re: /for\s+col\s*:=\s*0\s*;\s*col\s*<\s*x/, msg: "Цикл по колонкам: for col := 0; col < x; col++" },
            { re: /"o"/, msg: 'Печать углов: "o"' },
            { re: /"-"/, msg: 'Печать границ: "-"' },
            { re: /"\|"/, msg: 'Печать боковых сторон: "|"' },
            { re: /QuadA\s*\(\s*5\s*,\s*3\s*\)/, msg: "Вызов QuadA(5, 3) в main" },
          ],
        }),
        makeTask({
          id: "t46",
          hard: true,
          title: "QuadB (углы / и \\, границы *)",
          desc: R`Решите задачу QuadB самостоятельно! В QuadB:
- Верхний левый угол и нижний правый угол — это слэш {{"/"}}.
- Верхний правый угол и нижний левый угол — это обратный слэш {{"\\"}}.
- Все остальные границы (верх, низ, лево, право) — это звёздочка {{"*"}}.
- Внутри — пробел {{" "}}.`,
          plan: [
            "Создайте функцию func QuadB(x, y int) с проверкой x <= 0 || y <= 0",
            "Запустите вложенные циклы: for row := 0; row < y ... for col := 0; col < x",
            "Проверьте верхний левый угол (row == 0 && col == 0) и нижний правый (row == y-1 && col == x-1 && x > 1 && y > 1) -> печатаем '/'",
            "Проверьте верхний правый и нижний левый углы -> печатаем '\\'",
            "Проверьте остальные границы -> печатаем '*'",
            "Иначе -> печатаем пробел ' '",
            "После внутреннего цикла сделайте fmt.Println()",
            "Вызовите QuadB(5, 3) в func main()",
          ],
          output: "/**/\\\n*  *\n\\**/",
          hint: "Обратный слэш в строке пишется как \"\\\\\" (экранирование).",
          checks: [
            { re: /func\s+QuadB\s*\(\s*x\s*,\s*y\s+int\s*\)/, msg: "func QuadB(x, y int)" },
            { re: /"\/"/, msg: 'Печать слэша: "/"' },
            { re: /"\\\\"|"\\"|'\\'/, msg: 'Печать обратного слэша: "\\"' },
            { re: /"\*"/, msg: 'Печать границы: "*"' },
            { re: /QuadB\s*\(\s*5\s*,\s*3\s*\)/, msg: "Вызов QuadB(5, 3) в main" },
          ],
          starter: "package main\n\nimport \"fmt\"\n\n// Напишите QuadB(x, y int) здесь\n\nfunc main() {\n    QuadB(5, 3)\n}\n",
          solution: `package main

import "fmt"

func QuadB(x, y int) {
    if x <= 0 || y <= 0 {
        return
    }
    for row := 0; row < y; row++ {
        for col := 0; col < x; col++ {
            if row == 0 && col == 0 {
                fmt.Print("/")
            } else if row == 0 && col == x-1 {
                fmt.Print("\\")
            } else if row == y-1 && col == 0 {
                fmt.Print("\\")
            } else if row == y-1 && col == x-1 {
                fmt.Print("/")
            } else if row == 0 || row == y-1 || col == 0 || col == x-1 {
                fmt.Print("*")
            } else {
                fmt.Print(" ")
            }
        }
        fmt.Println()
    }
}

func main() {
    QuadB(5, 3)
}
`,
        }),
        makeTask({
          id: "p_quad_c",
          hard: true,
          exam: true,
          title: "QuadC (Экзамен 01 Edu: углы A и C, границы B)",
          desc: R`Экзаменационная версия Quad! Напишите функцию {{QuadC(x, y int)}}:
- Верхний левый и верхний правый углы — буква {{"A"}}.
- Нижний левый и нижний правый углы — буква {{"C"}}.
- Все границы (верх, низ, лево, право) — буква {{"B"}}.
- Внутри — пробелы {{" "}}.`,
          plan: [
            "Создайте func QuadC(x, y int)",
            "Если x <= 0 || y <= 0, ничего не выводите",
            "Верхние углы (row == 0 && (col == 0 || col == x-1)): печать 'A'",
            "Нижние углы (row == y-1 && (col == 0 || col == x-1)): печать 'C'",
            "Границы (row == 0 || row == y-1 || col == 0 || col == x-1): печать 'B'",
            "Внутри: пробел ' '",
          ],
          output: "ABBA\nB  B\nCBBC",
          hint: "В QuadC верхние углы одинаковые (A), а нижние тоже одинаковые (C).",
          checks: [
            { re: /func\s+QuadC\s*\(\s*x\s*,\s*y\s+int\s*\)/, msg: "func QuadC(x, y int)" },
            { re: /"A"/, msg: 'Печать углов "A"' },
            { re: /"C"/, msg: 'Печать углов "C"' },
            { re: /"B"/, msg: 'Печать границы "B"' },
            { re: /QuadC\s*\(\s*4\s*,\s*3\s*\)/, msg: "Вызов QuadC(4, 3) в main" },
          ],
          starter: "package main\n\nimport \"fmt\"\n\n// Напишите QuadC(x, y int) здесь\n\nfunc main() {\n    QuadC(4, 3)\n}\n",
          solution: `package main

import "fmt"

func QuadC(x, y int) {
    if x <= 0 || y <= 0 {
        return
    }
    for row := 0; row < y; row++ {
        for col := 0; col < x; col++ {
            if row == 0 && (col == 0 || col == x-1) {
                fmt.Print("A")
            } else if row == y-1 && (col == 0 || col == x-1) {
                fmt.Print("C")
            } else if row == 0 || row == y-1 || col == 0 || col == x-1 {
                fmt.Print("B")
            } else {
                fmt.Print(" ")
            }
        }
        fmt.Println()
    }
}

func main() {
    QuadC(4, 3)
}
`,
        }),
      ],
    },

    // ==========================================
    // ТЕМА 15: Указатели и память: Pointers (01 Edu)
    // ==========================================
    {
      id: 15,
      track: "piscine",
      widgetTitle: "Интерактивная память (RAM) и разыменование указателей",
      title: "Указатели и память: Pointers (01 Edu)",
      about: "что такое адреса в памяти, операторы & и *, и как передавать переменные в функции по ссылке",
      theory: R`
В 3-м квесте бассейна 01 Edu начинаются **указатели** — и это главная проверка на то, понимаете ли вы, как устроен компьютер.

Представьте память компьютера как улицу с пронумерованными домами:
- **Переменная** — это дом. У него есть **номер (адрес)**, например {{0x1004}}, и **жилец (значение)** внутри, например число {{42}}.
- **Обычная передача в функцию**: функция получает копию жильца. Если функция изменит число внутри себя, оригинал в main останется нетронутым!
- **Указатель**: это записка с адресом дома! Тип указателя на int пишется как {{*int}}.

Два волшебных знака:
1. {{&a}} («взять адрес»): даёт адрес переменной {{a}} в памяти.
2. {{*p}} («разыменование» / «пойти по адресу»): открывает дверь дома по адресу {{p}} и меняет то, что внутри!

Пример:
- {{var a int = 10}}
- {{var p *int = &a}} (указатель p хранит адрес переменной a)
- {{*p = 20}} (мы пошли по адресу и положили 20. Теперь и {{a}} равна 20!).
`,
      examples: R`
Как функция меняет переменную снаружи:

${F}
package main

import "fmt"

func SetToZero(ptr *int) {
    *ptr = 0 // идём по адресу и записываем 0
}

func main() {
    n := 42
    fmt.Println("До:", n) // 42
    SetToZero(&n)         // передаём адрес n через &
    fmt.Println("После:", n) // 0!
}
${F}
`,
      quiz: [
        {
          q: "Что делает оператор & перед именем переменной (&x)?",
          o: ["Возвращает адрес переменной в памяти", "Умножает x на 2", "Создаёт копию переменной"],
          why: "Знак & берёт адрес ячейки памяти, где живёт переменная.",
        },
        {
          q: "Что делает *ptr внутри функции (*ptr = 5)?",
          o: ["Идёт по адресу и записывает 5 в исходную ячейку", "Объявляет новую переменную", "Умножает ptr на 5"],
          why: "*ptr разыменовывает указатель — обращается к ячейке памяти по записанному в нём адресу.",
        },
      ],
      tasks: [
        makeTask({
          id: "t47",
          title: "PointOne: изменить значение через указатель",
          desc: R`Напишите функцию {{PointOne(n *int)}}, которая принимает указатель на int и записывает по этому адресу число {{1}}.`,
          body: [
            ["func PointOne(n *int) {", "Функция принимает указатель n на число int."],
            ["    *n = 1", "Разыменовываем указатель n и кладём по адресу единицу."],
            ["}", "Конец функции."],
            ["", ""],
            ["func main() {", "Точка входа."],
            ["    val := 42", "Переменная val равна 42."],
            ["    PointOne(&val)", "Передаём адрес переменной val."],
            ["    fmt.Println(val)", "Печатаем val - она стала 1."],
            ["}", "Конец main."],
          ],
          output: "1",
          hint: "Не забудьте звёздочку: *n = 1.",
          checks: [
            { re: /func\s+PointOne\s*\(\s*n\s+\*int\s*\)/, msg: "func PointOne(n *int)" },
            { re: /\*n\s*=\s*1/, msg: "*n = 1" },
            { re: /PointOne\s*\(\s*&\w+\s*\)/, msg: "Вызов PointOne(&val) с передачей адреса" },
          ],
        }),
        makeTask({
          id: "p_ult_point1",
          hard: true,
          exam: true,
          title: "UltimatePointOne: указатель на указатель (****int)",
          desc: R`Легендарная задача 01 Edu на 4 уровня указателей! Напишите функцию {{UltimatePointOne(n ****int)}}, которая принимает четырёхкратный указатель и записывает по конечному адресу число {{1}}.`,
          plan: [
            "Объявите func UltimatePointOne(n ****int)",
            "Разыменуйте 4 раза: ****n = 1",
            "В main создайте n := 0, затем p1 := &n, p2 := &p1, p3 := &p2, p4 := &p3",
            "Вызовите UltimatePointOne(p4) и выведите n",
          ],
          output: "1",
          hint: "Сколько звёздочек в типе параметра (****int), столько же звёздочек нужно для разыменования: ****n = 1.",
          checks: [
            { re: /func\s+UltimatePointOne\s*\(\s*n\s+\*\*\*\*int\s*\)/, msg: "func UltimatePointOne(n ****int)" },
            { re: /\*\*\*\*n\s*=\s*1/, msg: "****n = 1" },
          ],
          starter: "package main\n\nimport \"fmt\"\n\n// func UltimatePointOne(n ****int)\n\nfunc main() {\n    n := 0\n    p1 := &n\n    p2 := &p1\n    p3 := &p2\n    UltimatePointOne(&p3)\n    fmt.Println(n)\n}\n",
          solution: `package main

import "fmt"

func UltimatePointOne(n ****int) {
    ****n = 1
}

func main() {
    n := 0
    p1 := &n
    p2 := &p1
    p3 := &p2
    UltimatePointOne(&p3)
    fmt.Println(n)
}
`,
        }),
        makeTask({
          id: "t48",
          title: "Swap: поменять местами две переменные",
          desc: R`Напишите функцию {{Swap(a *int, b *int)}}, которая меняет местами значения переменных, на которые указывают {{a}} и {{b}}.`,
          body: [
            ["func Swap(a *int, b *int) {", "Функция принимает два указателя a и b."],
            ["    *a, *b = *b, *a", "В Go можно поменять значения в одну строчку без временной переменной!"],
            ["}", "Конец Swap."],
            ["", ""],
            ["func main() {", "Точка входа."],
            ["    x, y := 10, 20", "Создаём x=10 и y=20."],
            ["    Swap(&x, &y)", "Меняем местами."],
            ["    fmt.Println(x, y)", "Печатаем 20 10."],
            ["}", "Конец main."],
          ],
          output: "20 10",
          hint: "Либо *a, *b = *b, *a, либо через временную переменную: tmp := *a; *a = *b; *b = tmp.",
          checks: [
            { re: /func\s+Swap\s*\(\s*a\s*,\s*b\s+\*int\s*\)|func\s+Swap\s*\(\s*a\s+\*int\s*,\s*b\s+\*int\s*\)/, msg: "func Swap(a *int, b *int)" },
            { re: /\*a.*=.*\*b|\*b.*=.*\*a/, msg: "Обмен значений через разыменование" },
            { re: /Swap\s*\(\s*&\w+\s*,\s*&\w+\s*\)/, msg: "Вызов Swap(&x, &y)" },
          ],
        }),
        makeTask({
          id: "t49",
          title: "DivMod: деление и остаток через указатели",
          desc: R`Напишите функцию {{DivMod(a int, b int, div *int, mod *int)}}, которая делит {{a}} на {{b}} и записывает результат деления в {{*div}}, а остаток — в {{*mod}}.`,
          body: [
            ["func DivMod(a int, b int, div *int, mod *int) {", "Функция принимает числа a, b и два указателя."],
            ["    *div = a / b", "Записываем частное по указателю div."],
            ["    *mod = a % b", "Записываем остаток по указателю mod."],
            ["}", "Конец функции."],
            ["", ""],
            ["func main() {", "Точка входа."],
            ["    var d, m int", "Переменные под результат."],
            ["    DivMod(13, 5, &d, &m)", "Делим 13 на 5."],
            ['    fmt.Println("div:", d, "mod:", m)', "Печатаем div: 2 mod: 3."],
            ["}", "Конец main."],
          ],
          output: "div: 2 mod: 3",
          hint: "*div = a / b и *mod = a % b.",
          checks: [
            { re: /func\s+DivMod\s*\(/, msg: "func DivMod(a int, b int, div *int, mod *int)" },
            { re: /\*div\s*=\s*a\s*\/\s*b/, msg: "*div = a / b" },
            { re: /\*mod\s*=\s*a\s*%\s*b/, msg: "*mod = a % b" },
            { re: /DivMod\s*\(\s*13\s*,\s*5\s*,\s*&\w+\s*,\s*&\w+\s*\)/, msg: "Вызов DivMod(13, 5, &d, &m)" },
          ],
        }),
      ],
    },

    // ==========================================
    // ТЕМА 16: Строки, руны и ASCII (01 Edu Piscine)
    // ==========================================
    {
      id: 16,
      track: "piscine",
      widgetTitle: "Интерактивный сканер строк, байтов, рун и ASCII",
      title: "Строки, руны и ASCII (01 Edu Piscine)",
      about: "почему len(\"Привет\") не равен количеству букв, как устроена таблица ASCII и как вручную парсить строки без strconv",
      theory: R`
В бассейне 01 Edu работа со строками — это ежедневная рутина. И здесь спотыкаются 90% новичков, потому что в Go строки хранятся в кодировке **UTF-8**.

Главные правила:
1. **Байт vs Руна**:
   - Английская буква или цифра занимает **1 байт** (например, 'A' — код 65, '0' — код 48).
   - Русская буква или эмодзи занимает **2 или 4 байта** (например, 'П' — код 1055, но в памяти занимает 2 байта).
   - Поэтому стандартный {{len("Привет")}} вернёт 12, а не 6!
   - Чтобы получить честное количество символов, строку преобразуют в срез рун: {{[]rune(s)}}. Длина {{len([]rune("Привет"))}} будет ровно 6!

2. **ASCII-магия (как превратить цифру в int без strconv)**:
   - В компьютере символ {{'0'}} имеет код 48, {{'1'}} — код 49, а {{'9'}} — код 57.
   - Если из кода символа вычесть код символа {{'0'}}, получится настоящее число:
     {{'5' - '0' = 53 - 48 = 5}}!
   - Чтобы собрать число из строки {{"123"}}: берём 1, умножаем на 10 и прибавляем 2 (12), умножаем на 10 и прибавляем 3 (123).
`,
      examples: R`
Разворот строки на месте:

${F}
package main

import "fmt"

func StrRev(s string) string {
    r := []rune(s)
    for i, j := 0, len(r)-1; i < j; i, j = i+1, j-1 {
        r[i], r[j] = r[j], r[i]
    }
    return string(r)
}

func main() {
    fmt.Println(StrRev("Hello"))  // olleH
    fmt.Println(StrRev("Привет")) // тевирП (не ломается!)
}
${F}
`,
      quiz: [
        {
          q: "Почему len(\"Привет\") в Go равен 12, а не 6?",
          o: ["Потому что каждая кириллическая буква в UTF-8 занимает 2 байта", "Это ошибка компилятора Go", "Потому что считаются невидимые пробелы"],
          why: "В Go функция len(string) считает количество байт, а не символов. В UTF-8 русские буквы двухбайтовые.",
        },
        {
          q: "Чему равно выражение int('7' - '0') в Go?",
          o: ["Числу 7", "Символу '70'", "Ошибке компиляции"],
          why: "Код '7' (55) минус код '0' (48) равен 7. Это стандартный трюк перевода символа в число.",
        },
      ],
      tasks: [
        makeTask({
          id: "p_strlen",
          title: "StrLen: честный подсчёт длины строки",
          desc: R`Напишите функцию {{StrLen(s string) int}}, которая считает количество символов (рун) в строке. Строка может содержать как английские, так и русские буквы. Использовать пакет strings запрещено.`,
          body: [
            ["func StrLen(s string) int {", "Функция принимает строку s."],
            ["    return len([]rune(s))", "Преобразуем строку в срез рун и возвращаем его длину."],
            ["}", "Конец функции."],
            ["", ""],
            ["func main() {", "Точка входа."],
            ['    fmt.Println(StrLen("Hello"))', "Печатаем длину Hello: 5."],
            ['    fmt.Println(StrLen("Привет"))', "Печатаем длину Привет: 6."],
            ["}", "Конец main."],
          ],
          output: "5\n6",
          hint: "Используйте len([]rune(s)) или цикл for range s со счётчиком.",
          checks: [
            { re: /func\s+StrLen\s*\(\s*s\s+string\s*\)\s+int/, msg: "func StrLen(s string) int" },
            { re: /\[\]rune|range/, msg: "Подсчёт рун через []rune(s) или range" },
            { re: /StrLen\s*\(\s*"Hello"\s*\)/, msg: 'Вызов StrLen("Hello")' },
          ],
        }),
        makeTask({
          id: "p_strrev",
          hard: true,
          title: "StrRev: разворот строки задом наперёд",
          desc: R`Напишите функцию {{StrRev(s string) string}}, которая возвращает перевёрнутую строку. Не забывайте о преобразовании в руны {{[]rune(s)}}, иначе русские символы разломаются на битые байты!`,
          plan: [
            "Преобразуйте строку в срез рун: r := []rune(s)",
            "Используйте два указателя: i := 0 в начале и j := len(r)-1 в конце",
            "Пока i < j, меняйте местами r[i] и r[j], сдвигая i++ и j--",
            "Верните string(r)",
          ],
          output: "olleH\nтевирП",
          hint: "Два указателя i и j сходятся к центру строки, меняя руны местами: r[i], r[j] = r[j], r[i].",
          checks: [
            { re: /func\s+StrRev\s*\(\s*s\s+string\s*\)\s+string/, msg: "func StrRev(s string) string" },
            { re: /\[\]rune/, msg: "Преобразование в []rune" },
            { re: /StrRev\s*\(\s*"Hello"\s*\)/, msg: 'Вызов StrRev("Hello")' },
          ],
          starter: "package main\n\nimport \"fmt\"\n\n// Напишите StrRev(s string) string здесь\n\nfunc main() {\n    fmt.Println(StrRev(\"Hello\"))\n    fmt.Println(StrRev(\"Привет\"))\n}\n",
          solution: `package main

import "fmt"

func StrRev(s string) string {
    r := []rune(s)
    for i, j := 0, len(r)-1; i < j; i, j = i+1, j-1 {
        r[i], r[j] = r[j], r[i]
    }
    return string(r)
}

func main() {
    fmt.Println(StrRev("Hello"))
    fmt.Println(StrRev("Привет"))
}
`,
        }),
        makeTask({
          id: "p_basic_atoi",
          hard: true,
          exam: true,
          title: "BasicAtoi: строка цифр в число (без strconv)",
          desc: R`Классика 01 Edu Piscine! Напишите функцию {{BasicAtoi(s string) int}}, которая переводит строку из цифр (например, {{"12345"}}) в число {{12345}} без использования пакета strconv. Строка гарантированно содержит только корректные цифры.`,
          plan: [
            "Создайте переменную результата: n := 0",
            "Пройдитесь циклом for _, r := range s",
            "Для каждой цифры сдвигайте разряд и прибавляйте значение: n = n*10 + int(r - '0')",
            "Верните n",
          ],
          output: "12345\n0",
          hint: "Символ '0' вычитается из r: int(r - '0').",
          checks: [
            { re: /func\s+BasicAtoi\s*\(\s*s\s+string\s*\)\s+int/, msg: "func BasicAtoi(s string) int" },
            { re: /'0'/, msg: "Вычитание символа '0': r - '0'" },
            { re: /BasicAtoi\s*\(\s*"12345"\s*\)/, msg: 'Вызов BasicAtoi("12345")' },
          ],
          starter: "package main\n\nimport \"fmt\"\n\n// Напишите BasicAtoi(s string) int здесь\n\nfunc main() {\n    fmt.Println(BasicAtoi(\"12345\"))\n    fmt.Println(BasicAtoi(\"0\"))\n}\n",
          solution: `package main

import "fmt"

func BasicAtoi(s string) int {
    n := 0
    for _, r := range s {
        n = n*10 + int(r-'0')
    }
    return n
}

func main() {
    fmt.Println(BasicAtoi("12345"))
    fmt.Println(BasicAtoi("0"))
}
`,
        }),
      ],
    },

    // ==========================================
    // ТЕМА 17: Итерация vs Рекурсия (01 Edu)
    // ==========================================
    {
      id: 17,
      track: "piscine",
      widgetTitle: "Интерактивный стек вызовов (Call Stack) рекурсии",
      title: "Итерация vs Рекурсия: Факториал и Степень",
      about: "в чём разница между обычным циклом и вызовом функции самой себя, что такое базовый случай и переполнение стека",
      theory: R`
В 4-м квесте бассейна 01 Edu требуют решить одни и те же задачи двумя способами:
1. **Итеративно** (через обычный цикл for).
2. **Рекурсивно** (функция вызывает саму себя).

**Рекурсия** похожа на матрёшку:
Чтобы открыть большую матрёшку (посчитать 4!), нужно открыть матрёшку поменьше (посчитать 3!).
Каждый вызов кладётся в **стек вызовов** (память компьютера).

Два золотых правила рекурсии:
1. **Базовый случай (дно матрёшки)**: обязательное условие остановки!
   Для факториала: {{0! = 1}} и {{1! = 1}}. Если {{nb == 0 || nb == 1}}, возвращаем 1 без новых вызовов!
   Если забыть базовый случай, функция будет вызывать себя бесконечно, пока не кончится память (Stack Overflow).
2. **Шаг рекурсии**: вызов себя с параметром, приближающим нас к базовому случаю:
   {{return nb * RecursiveFactorial(nb - 1)}}.
`,
      examples: R`
Сравнение наглядно:

${F}
// Итеративный факториал
func IterativeFactorial(nb int) int {
    if nb < 0 || nb > 20 { return 0 }
    res := 1
    for i := 1; i <= nb; i++ {
        res *= i
    }
    return res
}

// Рекурсивный факториал
func RecursiveFactorial(nb int) int {
    if nb < 0 || nb > 20 { return 0 }
    if nb == 0 || nb == 1 { return 1 } // Базовый случай!
    return nb * RecursiveFactorial(nb - 1)
}
${F}
`,
      quiz: [
        {
          q: "Что произойдёт, если в рекурсивной функции забыть базовый случай?",
          o: ["Программа упадёт с ошибкой переполнения стека (Stack Overflow)", "Цикл просто завершится нулём", "Go автоматически добавит выход"],
          why: "Без базового случая функция будет вызывать себя бесконечно, пока не исчерпает стек памяти.",
        },
        {
          q: "Чему равен факториал нуля (0!)?",
          o: ["1", "0", "Ошибке"],
          why: "По математическому определению 0! = 1.",
        },
      ],
      tasks: [
        makeTask({
          id: "t50",
          title: "IterativeFactorial: факториал через цикл for",
          desc: R`Напишите функцию {{IterativeFactorial(nb int) int}}, которая вычисляет факториал числа с помощью цикла. Если число отрицательное или больше 20 (переполнение int), верните 0. Для nb == 0 верните 1.`,
          body: [
            ["func IterativeFactorial(nb int) int {", "Объявляем функцию."],
            ["    if nb < 0 || nb > 20 { return 0 }", "Проверка на отрицательные числа и переполнение."],
            ["    res := 1", "Начальное значение факториала."],
            ["    for i := 1; i <= nb; i++ {", "Цикл от 1 до nb."],
            ["        res *= i", "Умножаем накапливаемый результат."],
            ["    }", "Конец цикла."],
            ["    return res", "Возвращаем ответ."],
            ["}", "Конец функции."],
            ["", ""],
            ["func main() {", "Точка входа."],
            ["    fmt.Println(IterativeFactorial(4))", "4! = 24."],
            ["}", "Конец main."],
          ],
          output: "24",
          hint: "0! = 1, 4! = 1 * 2 * 3 * 4 = 24.",
          checks: [
            { re: /func\s+IterativeFactorial\s*\(\s*nb\s+int\s*\)\s+int/, msg: "func IterativeFactorial(nb int) int" },
            { re: /for\s+/, msg: "Использование цикла for" },
            { re: /IterativeFactorial\s*\(\s*4\s*\)/, msg: "Вызов IterativeFactorial(4)" },
          ],
        }),
        makeTask({
          id: "t51",
          hard: true,
          title: "RecursiveFactorial: факториал через рекурсию",
          desc: R`Напишите функцию {{RecursiveFactorial(nb int) int}}, которая считает факториал рекурсивно, БЕЗ использования циклов! Не забудьте про базовый случай {{nb == 0}} и защиту от отрицательных чисел.`,
          plan: [
            "Проверьте некорректный ввод: if nb < 0 || nb > 20 { return 0 }",
            "Базовый случай: if nb == 0 { return 1 }",
            "Рекурсивный вызов: return nb * RecursiveFactorial(nb - 1)",
          ],
          output: "24",
          hint: "Никаких for! Только вызов RecursiveFactorial(nb - 1).",
          checks: [
            { re: /func\s+RecursiveFactorial\s*\(\s*nb\s+int\s*\)\s+int/, msg: "func RecursiveFactorial(nb int) int" },
            { re: /RecursiveFactorial\s*\(\s*nb\s*-\s*1\s*\)/, msg: "Рекурсивный вызов RecursiveFactorial(nb - 1)" },
          ],
          starter: "package main\n\nimport \"fmt\"\n\n// func RecursiveFactorial(nb int) int\n\nfunc main() {\n    fmt.Println(RecursiveFactorial(4))\n}\n",
          solution: `package main

import "fmt"

func RecursiveFactorial(nb int) int {
    if nb < 0 || nb > 20 {
        return 0
    }
    if nb == 0 {
        return 1
    }
    return nb * RecursiveFactorial(nb-1)
}

func main() {
    fmt.Println(RecursiveFactorial(4))
}
`,
        }),
        makeTask({
          id: "t52",
          title: "IterativePower: возведение в степень циклом",
          desc: R`Напишите функцию {{IterativePower(nb int, power int) int}}, которая возводит число nb в степень power с помощью цикла for. Если степень отрицательная, верните 0. Любое число в степени 0 равно 1.`,
          body: [
            ["func IterativePower(nb int, power int) int {", "Функция принимает число и степень."],
            ["    if power < 0 { return 0 }", "Отрицательная степень в int не представляется."],
            ["    res := 1", "Любое число в степени 0 - это 1."],
            ["    for i := 0; i < power; i++ {", "Цикл по числу умножений."],
            ["        res *= nb", "Умножаем."],
            ["    }", "Конец цикла."],
            ["    return res", "Возвращаем результат."],
            ["}", "Конец функции."],
            ["", ""],
            ["func main() {", "Точка входа."],
            ["    fmt.Println(IterativePower(2, 4))", "2^4 = 16."],
            ["}", "Конец main."],
          ],
          output: "16",
          hint: "2 в степени 4 = 2 * 2 * 2 * 2 = 16.",
          checks: [
            { re: /func\s+IterativePower\s*\(\s*nb\s+int\s*,\s*power\s+int\s*\)\s+int/, msg: "func IterativePower(nb int, power int) int" },
            { re: /for\s+/, msg: "Цикл for" },
            { re: /IterativePower\s*\(\s*2\s*,\s*4\s*\)/, msg: "Вызов IterativePower(2, 4)" },
          ],
        }),
        makeTask({
          id: "t53",
          hard: true,
          title: "RecursivePower: возведение в степень рекурсией",
          desc: R`Напишите функцию {{RecursivePower(nb int, power int) int}}, которая возводит число в степень рекурсивно БЕЗ циклов. Формула: {{nb^power = nb * nb^(power - 1)}}. Базовый случай: при {{power == 0}} возвращаем 1.`,
          plan: [
            "Если power < 0, верните 0",
            "Базовый случай: if power == 0 { return 1 }",
            "Рекурсивный вызов: return nb * RecursivePower(nb, power - 1)",
          ],
          output: "16",
          hint: "Базовый случай: power == 0 вернёт 1.",
          checks: [
            { re: /func\s+RecursivePower\s*\(\s*nb\s+int\s*,\s*power\s+int\s*\)\s+int/, msg: "func RecursivePower(nb int, power int) int" },
            { re: /RecursivePower\s*\(\s*nb\s*,\s*power\s*-\s*1\s*\)/, msg: "Вызов RecursivePower(nb, power - 1)" },
          ],
          starter: "package main\n\nimport \"fmt\"\n\n// func RecursivePower(nb int, power int) int\n\nfunc main() {\n    fmt.Println(RecursivePower(2, 4))\n}\n",
          solution: `package main

import "fmt"

func RecursivePower(nb int, power int) int {
    if power < 0 {
        return 0
    }
    if power == 0 {
        return 1
    }
    return nb * RecursivePower(nb, power-1)
}

func main() {
    fmt.Println(RecursivePower(2, 4))
}
`,
        }),
      ],
    },

    // ==========================================
    // ТЕМА 18: Алгоритмы: Фибоначчи, Корень и Простые числа
    // ==========================================
    {
      id: 18,
      track: "piscine",
      widgetTitle: "Интерактивный тренажёр: Решето простых чисел и Поиск корня",
      title: "Алгоритмы: Фибоначчи, Корень и Простые числа",
      about: "алгоритмические задачи бассейна 01 Edu: ряд Фибоначчи, целочисленный квадратный корень и проверка простых чисел",
      theory: R`
В этих задачах студенты бассейна учатся писать эффективные алгоритмы:

1. **Числа Фибоначчи**:
   - Последовательность, где каждое число — сумма двух предыдущих:
     {{0, 1, 1, 2, 3, 5, 8, 13, 21...}}
   - Базовый случай: {{Fibonacci(0) = 0}}, {{Fibonacci(1) = 1}}.
   - Для отрицательных индексов возвращают -1.
   - Рекуррентная формула: {{Fibonacci(n) = Fibonacci(n-1) + Fibonacci(n-2)}}.

2. **Квадратный корень (Sqrt)**:
   - Ищет такое целое число {{x}}, что {{x * x == nb}}.
   - Если точного корня нет (например, для 5 или 10), функция возвращает 0.

3. **Простые числа (IsPrime / FindNextPrime)**:
   - Число больше 1 называется **простым**, если оно делится только на 1 и на само себя.
   - Лайфхак оптимизации: делители не нужно проверять до самого {{nb}}! Достаточно проверять до {{i * i <= nb}} (то есть до корня из nb). Если до корня делителей нет, дальше их тоже не будет!
`,
      examples: R`
Быстрая проверка простоты числа:

${F}
package main

import "fmt"

func IsPrime(nb int) bool {
    if nb <= 1 { return false }
    for i := 2; i*i <= nb; i++ {
        if nb % i == 0 {
            return false // нашёлся делитель, число составное!
        }
    }
    return true // делителей нет, число простое!
}

func main() {
    fmt.Println(IsPrime(5)) // true
    fmt.Println(IsPrime(4)) // false
}
${F}
`,
      quiz: [
        {
          q: "Почему при проверке простоты числа достаточно проверять делители до корня из N (i * i <= N)?",
          o: ["Потому что все парные делители больше корня зеркальны делителям меньше корня", "Это просто ограничение языка Go", "Потому что корень всегда простое число"],
          why: "Если N = a * b, то один из сомножителей обязательно меньше или равен корню из N.",
        },
      ],
      tasks: [
        makeTask({
          id: "t54",
          title: "Fibonacci: рекурсивное вычисление числа Фибоначчи",
          desc: R`Напишите функцию {{Fibonacci(index int) int}}, которая возвращает число Фибоначчи по его номеру. Если индекс отрицательный, верните -1. Нулевое число равно 0, первое — 1.`,
          body: [
            ["func Fibonacci(index int) int {", "Объявляем функцию Fibonacci."],
            ["    if index < 0 { return -1 }", "Отрицательный индекс - возвращаем -1."],
            ["    if index == 0 { return 0 }", "0-е число Фибоначчи."],
            ["    if index == 1 { return 1 }", "1-е число Фибоначчи."],
            ["    return Fibonacci(index-1) + Fibonacci(index-2)", "Сумма двух предыдущих чисел."],
            ["}", "Конец функции."],
            ["", ""],
            ["func main() {", "Точка входа."],
            ["    fmt.Println(Fibonacci(4))", "Fibonacci(4) = 3."],
            ["}", "Конец main."],
          ],
          output: "3",
          hint: "F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3.",
          checks: [
            { re: /func\s+Fibonacci\s*\(\s*index\s+int\s*\)\s+int/, msg: "func Fibonacci(index int) int" },
            { re: /Fibonacci\s*\(\s*index\s*-\s*1\s*\)/, msg: "Рекурсивный вызов Fibonacci(index - 1)" },
          ],
        }),
        makeTask({
          id: "t55",
          title: "Sqrt: целочисленный квадратный корень",
          desc: R`Напишите функцию {{Sqrt(nb int) int}}, которая возвращает квадратный корень целого числа. Если у числа нет точного целого квадратного корня (например, для 5 или 10), верните 0.`,
          body: [
            ["func Sqrt(nb int) int {", "Объявляем функцию Sqrt."],
            ["    if nb <= 0 { return 0 }", "У отрицательных чисел и нуля в задаче корня нет."],
            ["    for i := 1; i*i <= nb; i++ {", "Ищем число i, квадрат которого равен nb."],
            ["        if i*i == nb { return i }", "Если нашли точный корень, возвращаем i."],
            ["    }", "Конец цикла."],
            ["    return 0", "Если точного корня нет, возвращаем 0."],
            ["}", "Конец функции."],
            ["", ""],
            ["func main() {", "Точка входа."],
            ["    fmt.Println(Sqrt(4))", "Корень из 4 - это 2."],
            ["    fmt.Println(Sqrt(3))", "У 3 нет точного корня - 0."],
            ["}", "Конец main."],
          ],
          output: "2\n0",
          hint: "Проверяйте i*i == nb. Если вышли из цикла и не нашли, верните 0.",
          checks: [
            { re: /func\s+Sqrt\s*\(\s*nb\s+int\s*\)\s+int/, msg: "func Sqrt(nb int) int" },
            { re: /i\s*\*\s*i/, msg: "Проверка i*i" },
            { re: /Sqrt\s*\(\s*4\s*\)/, msg: "Вызов Sqrt(4)" },
          ],
        }),
        makeTask({
          id: "t56",
          hard: true,
          title: "IsPrime & FindNextPrime: простые числа",
          desc: R`Напишите две функции:
1. {{IsPrime(nb int) bool}} — возвращает true, если nb простое, и false в противном случае.
2. {{FindNextPrime(nb int) int}} — возвращает само число nb (если оно простое) или ближайшее следующее простое число больше nb.`,
          plan: [
            "Напишите func IsPrime(nb int) bool: числа <= 1 не простые. Цикл от 2 до i*i <= nb проверяет nb % i == 0",
            "Напишите func FindNextPrime(nb int) int: если nb <= 2, верните 2",
            "Запустите цикл for !IsPrime(nb) { nb++ } и верните nb",
          ],
          output: "true\n5\n7",
          hint: "В FindNextPrime просто проверяйте IsPrime(nb) в цикле, увеличивая nb++.",
          checks: [
            { re: /func\s+IsPrime\s*\(\s*nb\s+int\s*\)\s+bool/, msg: "func IsPrime(nb int) bool" },
            { re: /func\s+FindNextPrime\s*\(\s*nb\s+int\s*\)\s+int/, msg: "func FindNextPrime(nb int) int" },
            { re: /IsPrime\s*\(\s*5\s*\)/, msg: "Вызов IsPrime(5)" },
          ],
          starter: "package main\n\nimport \"fmt\"\n\n// func IsPrime(nb int) bool\n// func FindNextPrime(nb int) int\n\nfunc main() {\n    fmt.Println(IsPrime(5))\n    fmt.Println(FindNextPrime(5))\n    fmt.Println(FindNextPrime(6))\n}\n",
          solution: `package main

import "fmt"

func IsPrime(nb int) bool {
    if nb <= 1 {
        return false
    }
    for i := 2; i*i <= nb; i++ {
        if nb%i == 0 {
            return false
        }
    }
    return true
}

func FindNextPrime(nb int) int {
    if nb <= 2 {
        return 2
    }
    for !IsPrime(nb) {
        nb++
    }
    return nb
}

func main() {
    fmt.Println(IsPrime(5))
    fmt.Println(FindNextPrime(5))
    fmt.Println(FindNextPrime(6))
}
`,
        }),
      ],
    },

    // ==========================================
    // ТЕМА 19: Вершина Piscine: Задача о 8 ферзях (EightQueens)
    // ==========================================
    {
      id: 19,
      track: "piscine",
      widgetTitle: "Интерактивная шахматная доска 8x8 и Backtracking",
      title: "Вершина Piscine: Задача о 8 ферзях (EightQueens)",
      about: "самая знаменитая задача бассейна 01 Edu: рекурсивный алгоритм с возвратом (backtracking) для расстановки 8 ферзей",
      theory: R`
**EightQueens** — культовая задача в 01 Edu Piscine.

**Условие задачи**:
Расставить 8 шахматных ферзей на доске 8х8 так, чтобы ни один ферзь не бил другого (то есть ни два ферзя не стояли на одной горизонтали, вертикали или диагонали).

Формат вывода в 01 Edu:
Каждое решение выводится на отдельной строке в виде 8 цифр, например:
{{15863724}}
Каждая цифра — это номер строки (от 1 до 8), где стоит ферзь в соответствующем столбце (слева направо). Решения должны быть отсортированы по возрастанию! Всего существует ровно 92 решения.

**Как работает алгоритм с возвратом (Backtracking)**:
1. Ставим первого ферзя в 1-й столбец на 1-ю строку.
2. Переходим во 2-й столбец и ищем свободную строку, не атакованную предыдущими ферзями.
3. Если нашли — ставим и рекурсивно переходим в 3-й столбец.
4. **Если зашли в тупик** (в текущем столбце все клетки бьются):
   Делаем шаг назад (**backtrack**), сдвигаем ферзя в предыдущем столбце на строку ниже и пробуем снова!
5. Когда все 8 столбцов успешно заполнены — печатаем найденное 8-значное число.
`,
      examples: R`
Как проверить, бьют ли два ферзя друг друга:

${F}
// Ферзь 1 стоит в (c1, r1), ферзь 2 стоит в (c2, r2)
// Одна строка: r1 == r2
// Одна диагональ: |r1 - r2| == |c1 - c2|
func isSafe(board [8]int, col, row int) bool {
    for prevCol := 0; prevCol < col; prevCol++ {
        prevRow := board[prevCol]
        if prevRow == row { return false } // одна строка
        diffRow := row - prevRow
        if diffRow < 0 { diffRow = -diffRow }
        diffCol := col - prevCol
        if diffRow == diffCol { return false } // одна диагональ
    }
    return true
}
${F}
`,
      quiz: [
        {
          q: "Сколько всего существует правильных решений расстановки 8 ферзей на доске 8х8?",
          o: ["92 решения", "8 решений", "64 решения"],
          why: "На стандартной шахматной доске 8х8 существует ровно 92 неповторяющихся расстановки.",
        },
      ],
      tasks: [
        makeTask({
          id: "t57",
          hard: true,
          exam: true,
          title: "EightQueens: вывод всех 92 решений рекурсией",
          desc: R`Напишите функцию {{EightQueens()}}, которая находит и печатает все решения задачи о восьми ферзях в порядке возрастания. Каждое решение выводится на отдельной строке: первая цифра — позиция ферзя в 1-м столбце, вторая — во 2-м, и так далее. Обязательно используйте рекурсию!`,
          plan: [
            "Создайте массив позиций: var board [8]int, где индекс - столбец, а значение - строка (1..8)",
            "Напишите вспомогательную функцию isSafe(col, row int) bool для проверки строк и диагоналей",
            "Напишите рекурсивную функцию solve(col int): если col == 8, напечатайте все цифры и fmt.Println()",
            "В цикле for row := 1; row <= 8; row++: если isSafe, ставьте board[col] = row и вызывайте solve(col + 1)",
            "В функции EightQueens() запустите solve(0)",
          ],
          output: "15863724\n16837425\n17468253\n...",
          hint: "Проверка диагонали: абсолютная разница строк равна разнице столбцов: abs(row - prevRow) == col - prevCol.",
          checks: [
            { re: /func\s+EightQueens\s*\(\s*\)/, msg: "Объявите func EightQueens()" },
            { re: /solve\s*\(\s*col\s*\+\s*1\s*\)|solve\s*\(\s*0\s*\)/, msg: "Рекурсивный поиск solve(col + 1)" },
            { re: /8/, msg: "Размер доски 8" },
          ],
          starter: "package main\n\nimport \"fmt\"\n\n// func EightQueens()\n\nfunc main() {\n    EightQueens()\n}\n",
          solution: `package main

import "fmt"

func EightQueens() {
    var board [8]int

    var isSafe func(col, row int) bool
    isSafe = func(col, row int) bool {
        for c := 0; c < col; c++ {
            r := board[c]
            if r == row {
                return false
            }
            diffR := row - r
            if diffR < 0 {
                diffR = -diffR
            }
            if diffR == col-c {
                return false
            }
        }
        return true
    }

    var solve func(col int)
    solve = func(col int) {
        if col == 8 {
            for _, r := range board {
                fmt.Print(r)
            }
            fmt.Println()
            return
        }
        for row := 1; row <= 8; row++ {
            if isSafe(col, row) {
                board[col] = row
                solve(col + 1)
            }
        }
    }

    solve(0)
}

func main() {
    EightQueens()
}
`,
        }),
      ],
    },
  ];


  // --- QUESTS 05..10 ADDITIONS ---
  const NEW_QUEST_TOPICS = // tools/piscine_quests_data.js
// 01 Edu Piscine Go: Quests 05, 06, 07, 08, 09, 10
// Full bilingual (RU / KZ) definitions with interactive simulators and rigorous edge case validation

[
  // ==========================================
  // ТЕМА 20: Quest 05 — Продвинутые строки, руны и Capitalize
  // ==========================================
  {
    id: 20,
    track: "piscine",
    widgetTitle: "Интерактивный сканер строк и ASCII (ASCII / String Scanner)",
    title: "Продвинутые строки, руны и Capitalize (01 Edu Quest 05)",
    about: "посимвольный разбор строк, таблица ASCII, проверка регистра, поиск подстроки и культовая задача Capitalize",
    theory: R`
В квесте 05 бассейна 01 Edu проверяется фундаментальное понимание строк. В Go строка — это неизменяемая последовательность байт (UTF-8), а отдельный символ называется {{rune}} (числовой код символа).

### 1. Таблица ASCII и арифметика символов
Символы в памяти компьютера хранятся как числа. Латинские буквы идут строго по порядку:
- Заглавные: {{'A'}} (код 65) ... {{'Z'}} (код 90).
- Строчные: {{'a'}} (код 97) ... {{'z'}} (код 122).
- Цифры: {{'0'}} (код 48) ... {{'9'}} (код 57).

Чтобы проверить, является ли символ заглавной буквой, не нужны регулярные выражения:
{{if c >= 'A' && c <= 'Z'}}

Чтобы превратить строчную букву в заглавную, вычитаем 32 (или {{'a' - 'A'}}):
{{c = c - 32}} (например: {{'b' - 32 == 'B'}})

### 2. Секрет задачи Capitalize
Самая коварная задача квеста — {{Capitalize}}. Правило звучит просто: первая буква каждого слова — заглавная, все остальные буквы слова — строчные.
Но где ошибаются 90% студентов? В **разделителях слов**!
Словом считается любая непрерывная последовательность букв или цифр. **Любой другой символ** (пробел, плюс, минус, точка, подчеркивание, скобка) является разделителем!
Например: {{"hello+world 42school-is_cool"}} превращается в {{"Hello+World 42School-Is_Cool"}}.

Для решения используется флаг состояния:
{{newWord := true}} — перед началом слова. Если встретили букву и {{newWord == true}}, делаем её заглавной и ставим {{newWord = false}}. Если встретили не-букву и не-цифру — снова {{newWord = true}}.
`,
    examples: R`
Вот как работает преобразование строки в заглавный регистр:

${F}
package main

import "fmt"

func ToUpper(s string) string {
    runes := []rune(s)
    for i, c := range runes {
        if c >= 'a' && c <= 'z' {
            runes[i] = c - ('a' - 'A')
        }
    }
    return string(runes)
}

func main() {
    fmt.Println(ToUpper("Hello, 01 Edu!"))
}
${F}

Вывод:
${F}
HELLO, 01 EDU!
${F}
`,
    quiz: [
      {
        q: "Что делает выражение c >= 'A' && c <= 'Z' для переменной c типа rune?",
        o: [
          "Проверяет, является ли символ заглавной латинской буквой",
          "Преобразует символ в заглавную букву",
          "Проверяет, что символ не равен пробелу"
        ],
        why: "В таблице ASCII коды заглавных латинских букв идут подряд от 65 ('A') до 90 ('Z')."
      },
      {
        q: "Что вернёт правильная функция Capitalize для строки 'hello+world'?",
        o: [
          "'Hello+World', так как знак '+' разделяет слова",
          "'Hello+world', так как плюс не является пробелом",
          "'HELLO+WORLD'"
        ],
        why: "По условию 01 Edu разделителем слов является любой не-буквенно-цифровой символ, включая знаки препинания."
      }
    ],
    tasks: [
      {
        id: "p_is_upper",
        title: "IsUpper: строгая проверка заглавного регистра",
        desc: "Напишите функцию IsUpper(s string) bool, которая возвращает true, ТОЛЬКО если строка не пуста и содержит исключительно заглавные латинские буквы ('A'..'Z'). Если строка пуста или содержит пробелы, цифры или строчные буквы — возвращайте false.",
        hard: false,
        plan: [
          "1. Проверьте длину строки: если строка пуста, сразу верните false",
          "2. Пройдите циклом for по символам строки",
          "3. Если текущий символ меньше 'A' или больше 'Z', верните false",
          "4. Если цикл завершился и нарушений не найдено, верните true",
          "5. В main протестируйте с 'HELLO' и 'Hello 01'"
        ],
        output: "true\nfalse",
        lines: [
          ["package main", "Каркас программы."],
          ["", ""],
          ['import "fmt"', "Подключаем вывод."],
          ["", ""],
          ["func IsUpper(s string) bool {", "Объявляем функцию проверки заглавных букв."],
          ["    if len(s) == 0 {", "Edge case: пустая строка не является заглавной."],
          ["        return false", "Возвращаем false для пустой строки."],
          ["    }", "Закрываем проверку пустоты."],
          ["    for _, c := range s {", "Перебираем каждый символ строки."],
          ["        if c < 'A' || c > 'Z' {", "Если символ вне диапазона 'A'..'Z'."],
          ["            return false", "Значит строка не состоит только из заглавных."],
          ["        }", "Конец проверки символа."],
          ["    }", "Конец цикла."],
          ["    return true", "Все символы оказались заглавными."],
          ["}", "Конец функции IsUpper."],
          ["", ""],
          ["func main() {", "Точка входа."],
          ['    fmt.Println(IsUpper("HELLO"))', "Тест 1: истина."],
          ['    fmt.Println(IsUpper("Hello 01"))', "Тест 2: ложь."],
          ["}", "Конец main."]
        ],
        hint: "Не забудьте проверить len(s) == 0 в самом начале: пустая строка по правилам 01 Edu должна возвращать false!",
        checks: [
          { re: /func\s+IsUpper\s*\(\s*\w+\s+string\s*\)\s*bool/, msg: "Объявите func IsUpper(s string) bool" },
          { re: /len\s*\(\s*\w+\s*\)\s*==\s*0/, msg: "Проверьте граничный случай пустой строки len(s) == 0" },
          { re: /['"]A['"]\s*.*['"]Z['"]|['"]Z['"]\s*.*['"]A['"]/, msg: "Проверяйте диапазон 'A' и 'Z'" }
        ],
        starter: "package main\n\nimport \"fmt\"\n\n// Напишите IsUpper(s string) bool\n\nfunc main() {\n    fmt.Println(IsUpper(\"HELLO\"))\n    fmt.Println(IsUpper(\"Hello 01\"))\n}\n",
        solution: "package main\n\nimport \"fmt\"\n\nfunc IsUpper(s string) bool {\n    if len(s) == 0 {\n        return false\n    }\n    for _, c := range s {\n        if c < 'A' || c > 'Z' {\n            return false\n        }\n    }\n    return true\n}\n\nfunc main() {\n    fmt.Println(IsUpper(\"HELLO\"))\n    fmt.Println(IsUpper(\"Hello 01\"))\n}\n"
      },
      {
        id: "p_index",
        title: "Index: поиск подстроки без сторонних пакетов",
        desc: "Напишите функцию Index(s string, toFind string) int, которая находит индекс первого вхождения подстроки toFind в строку s. Если подстрока не найдена, верните -1. Если toFind пустая строка, верните 0.",
        hard: false,
        plan: [
          "1. Проверьте граничный случай: если toFind == \"\", верните 0",
          "2. Если длина toFind больше длины s, верните -1",
          "3. Пройдите внешним циклом i от 0 до len(s) - len(toFind)",
          "4. Проверьте срез s[i : i+len(toFind)] == toFind",
          "5. При совпадении верните индекс i. Если цикл закончился — верните -1"
        ],
        output: "2\n-1",
        lines: [
          ["package main", "Каркас программы."],
          ["", ""],
          ['import "fmt"', "Подключаем fmt."],
          ["", ""],
          ["func Index(s string, toFind string) int {", "Функция ручного поиска подстроки."],
          ['    if toFind == "" {', "Edge case: пустая подстрока."],
          ["        return 0", "Пустая строка всегда находится на позиции 0."],
          ["    }", "Конец проверки."],
          ["    if len(toFind) > len(s) {", "Если искомая строка длиннее исходной."],
          ["        return -1", "Она заведомо не поместится."],
          ["    }", "Конец проверки длины."],
          ["    for i := 0; i <= len(s)-len(toFind); i++ {", "Скользящее окно по строке s."],
          ["        if s[i:i+len(toFind)] == toFind {", "Сравниваем подстроку фиксированной длины."],
          ["            return i", "Найдено первое вхождение, возвращаем индекс."],
          ["        }", "Конец сравнения."],
          ["    }", "Конец цикла."],
          ["    return -1", "Подстрока не встретилась в строке."],
          ["}", "Конец функции Index."],
          ["", ""],
          ["func main() {", "Точка входа."],
          ['    fmt.Println(Index("Hello!", "l"))', "Индекс буквы 'l' в 'Hello!' равен 2."],
          ['    fmt.Println(Index("Piscine", "xyz"))', "Подстрока 'xyz' не найдена (-1)."],
          ["}", "Конец main."]
        ],
        hint: "Используйте срез s[i : i + len(toFind)] для быстрого сравнения кусочков строки в цикле.",
        checks: [
          { re: /func\s+Index\s*\(\s*\w+\s*,\s*\w+\s+string\s*\)\s*int|func\s+Index\s*\(\s*\w+\s+string\s*,\s*\w+\s+string\s*\)\s*int/, msg: "Объявите func Index(s, toFind string) int" },
          { re: /toFind\s*==\s*[""]|len\s*\(\s*toFind\s*\)\s*==\s*0/, msg: "Обработайте случай пустой подстроки toFind == \"\"" },
          { re: /return\s+-1/, msg: "Верните -1, если подстрока не найдена" }
        ],
        starter: "package main\n\nimport \"fmt\"\n\n// Напишите Index(s, toFind string) int\n\nfunc main() {\n    fmt.Println(Index(\"Hello!\", \"l\"))\n    fmt.Println(Index(\"Piscine\", \"xyz\"))\n}\n",
        solution: "package main\n\nimport \"fmt\"\n\nfunc Index(s string, toFind string) int {\n    if toFind == \"\" {\n        return 0\n    }\n    if len(toFind) > len(s) {\n        return -1\n    }\n    for i := 0; i <= len(s)-len(toFind); i++ {\n        if s[i:i+len(toFind)] == toFind {\n            return i\n        }\n    }\n    return -1\n}\n\nfunc main() {\n    fmt.Println(Index(\"Hello!\", \"l\"))\n    fmt.Println(Index(\"Piscine\", \"xyz\"))\n}\n"
      },
      {
        id: "p_capitalize",
        title: "Capitalize: заглавная буква каждого слова (Экзамен 01 Edu)",
        desc: "Напишите функцию Capitalize(s string) string, которая капитализирует первую букву каждого слова, а остальные буквы слова переводит в строчные. Словом является последовательность буквенно-цифровых символов, разделенная любыми знаками.",
        hard: true,
        exam: true,
        plan: [
          "1. Преобразуйте строку в срез рун []rune(s)",
          "2. Заведите булев флаг isNew := true (маркер начала слова)",
          "3. Пройдите циклом по рунам. Напишите вспомогательную проверку isAlphaNum(c)",
          "4. Если встретили букву/цифру: если isNew == true, переведите в заглавную букву; если isNew == false, переведите в строчную. Установите isNew = false",
          "5. Если символ НЕ буква и НЕ цифра: установите isNew = true",
          "6. Верните string(runes)"
        ],
        output: "Hello! How Are You? 42words-Is_Cool",
        lines: [
          ["package main", "Каркас программы."],
          ["", ""],
          ['import "fmt"', "Подключаем fmt."],
          ["", ""],
          ["func isAlphaNum(c rune) bool {", "Проверка на букву или цифру."],
          ["    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9')", "Символ входит в алфавит или цифры."],
          ["}", "Конец функции проверки."],
          ["", ""],
          ["func Capitalize(s string) string {", "Функция капитализации слов."],
          ["    r := []rune(s)", "Превращаем строку в изменяемый срез рун."],
          ["    isNew := true", "Флаг: следующий буквенно-цифровой символ будет началом слова."],
          ["    for i := 0; i < len(r); i++ {", "Идём по каждому символу."],
          ["        if isAlphaNum(r[i]) {", "Если встретили букву или цифру."],
          ["            if isNew {", "Это начало нового слова!"],
          ["                if r[i] >= 'a' && r[i] <= 'z' {", "Если буква строчная."],
          ["                    r[i] = r[i] - 32", "Превращаем в заглавную."],
          ["                }", "Конец проверки регистра."],
          ["                isNew = false", "Мы уже внутри слова."],
          ["            } else {", "Мы в середине или конце слова."],
          ["                if r[i] >= 'A' && r[i] <= 'Z' {", "Если буква заглавная."],
          ["                    r[i] = r[i] + 32", "Переводим в строчную."],
          ["                }", "Конец перевода в строчную."],
          ["            }", "Конец ветки."],
          ["        } else {", "Встретили не-букву и не-цифру (разделитель)."],
          ["            isNew = true", "Следующая буква станет началом нового слова."],
          ["        }", "Конец условия."],
          ["    }", "Конец цикла."],
          ["    return string(r)", "Собираем обратно в строку."],
          ["}", "Конец функции Capitalize."],
          ["", ""],
          ["func main() {", "Точка входа."],
          ['    fmt.Println(Capitalize("hello! How are you? 42words-is_cool"))', "Проверяем сложное предложение с разными разделителями."],
          ["}", "Конец main."]
        ],
        hint: "Не забывайте понижать регистр для букв внутри слова (else if r[i] >= 'A' && r[i] <= 'Z' { r[i] += 32 }), иначе слова вроде 'hELLO' не станут 'Hello'.",
        checks: [
          { re: /func\s+Capitalize\s*\(\s*\w+\s+string\s*\)\s*string/, msg: "Объявите func Capitalize(s string) string" },
          { re: /\[\]rune\s*\(/, msg: "Преобразуйте строку в срез рун []rune(s) для модификации символов" },
          { re: /32|'a'\s*-\s*'A'/, msg: "Используйте сдвиг регистра на 32 или разницу ('a' - 'A')" }
        ],
        starter: "package main\n\nimport \"fmt\"\n\n// Напишите Capitalize(s string) string\n\nfunc main() {\n    fmt.Println(Capitalize(\"hello! How are you? 42words-is_cool\"))\n}\n",
        solution: "package main\n\nimport \"fmt\"\n\nfunc isAlphaNum(c rune) bool {\n    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9')\n}\n\nfunc Capitalize(s string) string {\n    r := []rune(s)\n    isNew := true\n    for i := 0; i < len(r); i++ {\n        if isAlphaNum(r[i]) {\n            if isNew {\n                if r[i] >= 'a' && r[i] <= 'z' {\n                    r[i] = r[i] - 32\n                }\n                isNew = false\n            } else {\n                if r[i] >= 'A' && r[i] <= 'Z' {\n                    r[i] = r[i] + 32\n                }\n            }\n        } else {\n            isNew = true\n        }\n    }\n    return string(r)\n}\n\nfunc main() {\n    fmt.Println(Capitalize(\"hello! How are you? 42words-is_cool\"))\n}\n"
      }
    ]
  },

  // ==========================================
  // ТЕМА 21: Quest 06 — Аргументы командной строки os.Args
  // ==========================================
  {
    id: 21,
    track: "piscine",
    widgetTitle: "Интерактивный терминал CLI (os.Args Visualizer)",
    title: "Аргументы командной строки: os.Args и Сортировка (01 Edu Quest 06)",
    about: "как консольные утилиты принимают параметры, устройство os.Args, вывод в обратном порядке и сортировка аргументов",
    theory: R`
Квест 06 знакомит студента с тем, как устроены реальные CLI-программы в Linux и терминале.

Когда вы запускаете в терминале команду:
{{go run . hello world 42}}

Операционная система передаёт вашей программе массив строк. В Go к нему обращаются через стандартный пакет {{os}}:
{{import "os"}}
{{os.Args}} — это срез строк {{[]string}}.

### Главное правило os.Args:
1. {{os.Args[0]}} — это **всегда путь к самой запущенной программе** (например, {{"./main"}}).
2. Реальные параметры пользователя начинаются с индекса 1: {{os.Args[1]}}, {{os.Args[2]}} и т.д.
3. Срез {{os.Args[1:]}} содержит только аргументы пользователя без имени программы.
4. **Важнейший edge-case:** если пользователь ничего не передал, {{len(os.Args)}} равен {{1}}, а обращение к {{os.Args[1]}} вызовет панику (panic: index out of range)! Всегда проверяйте {{len(os.Args) > 1}}.
`,
    examples: R`
Пример чтения и вывода параметров программы:

${F}
package main

import (
    "fmt"
    "os"
)

func main() {
    // os.Args[0] - имя программы, пропускаем его
    for i := 1; i < len(os.Args); i++ {
        fmt.Println(os.Args[i])
    }
}
${F}

Если запустить:
${F}
./main apple orange banana
${F}

Вывод:
${F}
apple
orange
banana
${F}
`,
    quiz: [
      {
        q: "Чему равен len(os.Args), если пользователь запустил программу без каких-либо аргументов?",
        o: [
          "1 (содержит путь или имя самой программы)",
          "0 (так как параметров нет)",
          "-1"
        ],
        why: "Элемент os.Args[0] всегда зарезервирован под имя бинарного файла."
      },
      {
        q: "Как безопасно получить срез только переданных аргументов пользователя?",
        o: [
          "os.Args[1:]",
          "os.Args[0:]",
          "os.Args[:1]"
        ],
        why: "Срез os.Args[1:] отсекает нулевой элемент с именем файла и оставляет только пользовательские параметры."
      }
    ],
    tasks: [
      {
        id: "p_print_params",
        title: "PrintParams: печать аргументов построчно",
        desc: "Напишите программу, которая выводит каждый переданный аргумент командной строки на отдельной строке. Если аргументов нет (len(os.Args) == 1), программа ничего не выводит.",
        hard: false,
        plan: [
          "1. Подключите пакеты fmt и os",
          "2. В main напишите цикл for, начинающийся с индекса i := 1",
          "3. Цикл продолжается, пока i < len(os.Args)",
          "4. Напечатайте os.Args[i] через fmt.Println"
        ],
        output: "alpha\nbeta\ngamma",
        lines: [
          ["package main", "Каркас программы."],
          ["", ""],
          ['import (', "Многострочный импорт."],
          ['    "fmt"', "Вывод текста."],
          ['    "os"', "Доступ к os.Args."],
          [")", "Конец импорта."],
          ["", ""],
          ["func main() {", "Главная функция."],
          ["    for i := 1; i < len(os.Args); i++ {", "Начинаем с индекса 1, пропуская os.Args[0]."],
          ["        fmt.Println(os.Args[i])", "Печатаем каждый аргумент на новой строке."],
          ["    }", "Конец цикла."],
          ["}", "Конец программы."]
        ],
        hint: "Не выводите os.Args[0] — это имя программы. Начинайте цикл строго с i := 1.",
        checks: [
          { re: /import\s+[\s\S]*"os"/, msg: "Подключите пакет \"os\"" },
          { re: /os\.Args/, msg: "Используйте срез os.Args" },
          { re: /i\s*:=\s*1/, msg: "Начинайте обход аргументов с индекса 1" }
        ],
        starter: "package main\n\nimport (\n    \"fmt\"\n    \"os\"\n)\n\nfunc main() {\n    // Выведите аргументы из os.Args построчно\n}\n",
        solution: "package main\n\nimport (\n    \"fmt\"\n    \"os\"\n)\n\nfunc main() {\n    for i := 1; i < len(os.Args); i++ {\n        fmt.Println(os.Args[i])\n    }\n}\n"
      },
      {
        id: "p_rev_params",
        title: "RevParams: аргументы задом наперёд",
        desc: "Напишите программу, которая выводит все аргументы командной строки в обратном порядке (от последнего к первому), каждый на отдельной строке.",
        hard: false,
        plan: [
          "1. Подключите fmt и os",
          "2. Начните цикл с последнего индекса: i := len(os.Args) - 1",
          "3. Условие продолжения: пока i >= 1 (не доходя до os.Args[0])",
          "4. Шаг цикла: i-- (уменьшение индекса)",
          "5. В теле цикла выводите os.Args[i]"
        ],
        output: "third\nsecond\nfirst",
        lines: [
          ["package main", "Каркас."],
          ["", ""],
          ['import (', "Импорт."],
          ['    "fmt"', "fmt."],
          ['    "os"', "os."],
          [")", "Конец."],
          ["", ""],
          ["func main() {", "Точка входа."],
          ["    for i := len(os.Args) - 1; i >= 1; i-- {", "Идём в обратном порядке до индекса 1."],
          ["        fmt.Println(os.Args[i])", "Выводим текущий аргумент."],
          ["    }", "Конец цикла."],
          ["}", "Конец main."]
        ],
        hint: "Убедитесь, что цикл останавливается при i >= 1, чтобы случайно не напечатать os.Args[0].",
        checks: [
          { re: /os\.Args/, msg: "Используйте os.Args" },
          { re: /len\s*\(\s*os\.Args\s*\)\s*-\s*1/, msg: "Начните с последнего элемента: len(os.Args) - 1" },
          { re: /i--/, msg: "Уменьшайте счётчик цикла i--" }
        ],
        starter: "package main\n\nimport (\n    \"fmt\"\n    \"os\"\n)\n\nfunc main() {\n    // Выведите аргументы в обратном порядке\n}\n",
        solution: "package main\n\nimport (\n    \"fmt\"\n    \"os\"\n)\n\nfunc main() {\n    for i := len(os.Args) - 1; i >= 1; i-- {\n        fmt.Println(os.Args[i])\n    }\n}\n"
      },
      {
        id: "p_sort_params",
        title: "SortParams: сортировка аргументов по ASCII (Экзамен 01 Edu)",
        desc: "Напишите программу, которая принимает параметры командной строки, сортирует их в возрастающем порядке ASCII и выводит каждый отсортированный аргумент на отдельной строке.",
        hard: true,
        exam: true,
        plan: [
          "1. Сделайте копию аргументов: args := os.Args[1:]",
          "2. Примените алгоритм пузырьковой сортировки: два вложенных цикла for",
          "3. Если args[j] > args[j+1], поменяйте их местами: args[j], args[j+1] = args[j+1], args[j]",
          "4. В конце выведите элементы отсортированного среза args построчно"
        ],
        output: "123\nHello\nWorld\naaa",
        lines: [
          ["package main", "Каркас программы."],
          ["", ""],
          ['import (', "Импорт пакетов."],
          ['    "fmt"', "Пакет fmt."],
          ['    "os"', "Пакет os."],
          [")", "Конец импорта."],
          ["", ""],
          ["func main() {", "Главная функция."],
          ["    args := os.Args[1:]", "Берём срез только переданных параметров."],
          ["    for i := 0; i < len(args); i++ {", "Внешний проход сортировки."],
          ["        for j := 0; j < len(args)-1; j++ {", "Внутренний проход сравнения пар."],
          ["            if args[j] > args[j+1] {", "Сравнение строк по ASCII-кодам."],
          ["                args[j], args[j+1] = args[j+1], args[j]", "Меняем местами элементы."],
          ["            }", "Конец if."],
          ["        }", "Конец внутреннего цикла."],
          ["    }", "Конец внешнего цикла."],
          ["    for _, arg := range args {", "Печатаем отсортированный результат."],
          ["        fmt.Println(arg)", "Каждый аргумент с новой строки."],
          ["    }", "Конец вывода."],
          ["}", "Конец main."]
        ],
        hint: "В Go строки можно сравнивать стандартными операторами > и < — они сравнивают по кодам ASCII посимвольно.",
        checks: [
          { re: /os\.Args\[1:\]/, msg: "Создайте срез аргументов os.Args[1:]" },
          { re: />|<.*=.*,/, msg: "Реализуйте сравнение и обмен элементов местами" },
          { re: /fmt\.Println/, msg: "Выведите отсортированные аргументы построчно" }
        ],
        starter: "package main\n\nimport (\n    \"fmt\"\n    \"os\"\n)\n\nfunc main() {\n    // Отсортируйте аргументы в порядке ASCII и напечатайте\n}\n",
        solution: "package main\n\nimport (\n    \"fmt\"\n    \"os\"\n)\n\nfunc main() {\n    args := os.Args[1:]\n    for i := 0; i < len(args); i++ {\n        for j := 0; j < len(args)-1; j++ {\n            if args[j] > args[j+1] {\n                args[j], args[j+1] = args[j+1], args[j]\n            }\n        }\n    }\n    for _, arg := range args {\n        fmt.Println(arg)\n    }\n}\n"
      }
    ]
  },

  // ==========================================
  // ТЕМА 22: Quest 07 — Динамические срезы, make и Split
  // ==========================================
  {
    id: 22,
    track: "piscine",
    widgetTitle: "Рентген аллокации памяти: make vs append & Split",
    title: "Динамические срезы, make и Split (01 Edu Quest 07)",
    about: "выделение памяти через make, разница len и cap, правильное возвращение nil и разбиение строк на слова",
    theory: R`
В квесте 07 бассейн погружает в устройство срезов (slices) и управление памятью.

### 1. Как устроен срез под капотом
Срез в Go — это маленькая структура из трёх полей:
- **Указатель (Data ptr)**: адрес в памяти, где лежит настоящий массив данных.
- **Длина (Len)**: сколько элементов сейчас доступно в срезе.
- **Вместимость (Cap)**: сколько памяти уже выделено в запасе.

### 2. make против append
Когда мы заранее знаем размер, мы выделяем память одной командой:
{{s := make([]int, size)}} — быстро, без повторных перевыделений памяти.

Когда размер неизвестен:
{{s = append(s, value)}} — если вместимости не хватает, Go втайне выделяет новый массив в 2 раза больше и копирует туда данные.

### 3. Главный подводный камень: nil-слайс
В задачах бассейна (например, {{AppendRange}} и {{MakeRange}}), если начальное число {{min >= max}}, функция **ОБЯЗАНА вернуть nil**, а не пустой срез!
- {{var res []int = nil}} — это {{nil}}.
- {{res := []int{}}} — это не {{nil}}, это пустой не-nil срез! Тесты 01 Edu проверяют {{res == nil}}, поэтому возвращайте именно {{nil}}.
`,
    examples: R`
Пример выделения памяти и проверки на nil:

${F}
package main

import "fmt"

func MakeRange(min, max int) []int {
    if min >= max {
        return nil
    }
    size := max - min
    res := make([]int, size)
    for i := 0; i < size; i++ {
        res[i] = min + i
    }
    return res
}

func main() {
    fmt.Println(MakeRange(5, 10))
    fmt.Println(MakeRange(10, 5) == nil)
}
${F}

Вывод:
${F}
[5 6 7 8 9]
true
${F}
`,
    quiz: [
      {
        q: "Что должна вернуть функция MakeRange(10, 5) по стандартам 01 Edu?",
        o: [
          "nil (пустой указатель на срез)",
          "[] (пустой слайс длиной 0)",
          "Панику (panic)"
        ],
        why: "Если min >= max, диапазон некорректен, и по условию задачи возвращается именно nil."
      },
      {
        q: "В чём преимущество make([]int, size) перед постепенным append?",
        o: [
          "Память выделяется один раз сразу, без лишних копирований массива при расширении",
          "make работает только со строками",
          "make автоматически сортирует элементы"
        ],
        why: "Функция make резервирует память точного размера, устраняя накладные расходы на постоянный реаллок."
      }
    ],
    tasks: [
      {
        id: "p_append_range",
        title: "AppendRange: наполнение среза через append",
        desc: "Напишите функцию AppendRange(min, max int) []int, которая возвращает срез целых чисел от min до max-1. Если min >= max, функция должна возвращать nil.",
        hard: false,
        plan: [
          "1. Проверьте: если min >= max, сразу верните nil",
          "2. Создайте пустую переменную var res []int (она изначально равна nil)",
          "3. Пройдите циклом for i := min; i < max; i++",
          "4. Добавляйте каждое i через res = append(res, i)",
          "5. Верните res"
        ],
        output: "[5 6 7 8 9]\ntrue",
        lines: [
          ["package main", "Каркас."],
          ["", ""],
          ['import "fmt"', "Подключаем fmt."],
          ["", ""],
          ["func AppendRange(min, max int) []int {", "Функция наполнения диапазона."],
          ["    if min >= max {", "Edge case: пустой или некорректный диапазон."],
          ["        return nil", "Обязательно возвращаем nil по условию 01 Edu."],
          ["    }", "Конец проверки."],
          ["    var res []int", "Инициализируем срез."],
          ["    for i := min; i < max; i++ {", "Идём от min включительно до max исключительно."],
          ["        res = append(res, i)", "Добавляем число в конец среза."],
          ["    }", "Конец цикла."],
          ["    return res", "Возвращаем полученный срез."],
          ["}", "Конец функции."],
          ["", ""],
          ["func main() {", "Точка входа."],
          ["    fmt.Println(AppendRange(5, 10))", "Диапазон от 5 до 10."],
          ["    fmt.Println(AppendRange(10, 5) == nil)", "Проверка возврата nil."],
          ["}", "Конец main."]
        ],
        hint: "Не используйте res := []int{} при объявлении, иначе для min >= max вернётся не nil, а пустой массив. Пишите 'return nil'.",
        checks: [
          { re: /func\s+AppendRange\s*\(\s*min\s*,\s*max\s+int\s*\)\s*\[\]int/, msg: "Объявите func AppendRange(min, max int) []int" },
          { re: /return\s+nil/, msg: "Возвращайте nil при min >= max" },
          { re: /append\s*\(/, msg: "Используйте функцию append" }
        ],
        starter: "package main\n\nimport \"fmt\"\n\n// Напишите AppendRange(min, max int) []int\n\nfunc main() {\n    fmt.Println(AppendRange(5, 10))\n    fmt.Println(AppendRange(10, 5) == nil)\n}\n",
        solution: "package main\n\nimport \"fmt\"\n\nfunc AppendRange(min, max int) []int {\n    if min >= max {\n        return nil\n    }\n    var res []int\n    for i := min; i < max; i++ {\n        res = append(res, i)\n    }\n    return res\n}\n\nfunc main() {\n    fmt.Println(AppendRange(5, 10))\n    fmt.Println(AppendRange(10, 5) == nil)\n}\n"
      },
      {
        id: "p_concat_params",
        title: "ConcatParams: объединение аргументов без хвостового \\n",
        desc: "Напишите функцию ConcatParams(args []string) string, которая объединяет все строки из среза args в одну строку, разделяя их переносом строки '\\n'. После последнего элемента перенос строки ставить НЕЛЬЗЯ.",
        hard: false,
        plan: [
          "1. Проверьте: если len(args) == 0, верните пустую строку \"\"",
          "2. Создайте результирующую строку res := args[0]",
          "3. Пройдите циклом от i := 1 до len(args) - 1",
          "4. К res добавляйте \"\\n\" + args[i]",
          "5. Верните res"
        ],
        output: "Hello\nWorld\n42",
        lines: [
          ["package main", "Каркас программы."],
          ["", ""],
          ['import "fmt"', "Пакет fmt."],
          ["", ""],
          ["func ConcatParams(args []string) string {", "Функция склеивания параметров."],
          ["    if len(args) == 0 {", "Edge case: пустой срез аргументов."],
          ['        return ""', "Возвращаем пустую строку."],
          ["    }", "Конец проверки."],
          ["    res := args[0]", "Первый элемент без ведущего перевода строки."],
          ["    for i := 1; i < len(args); i++ {", "Начинаем со второго элемента."],
          ['        res += "\\n" + args[i]', "Добавляем перевод строки и следующий элемент."],
          ["    }", "Конец цикла."],
          ["    return res", "Возвращаем объединённую строку."],
          ["}", "Конец функции ConcatParams."],
          ["", ""],
          ["func main() {", "Точка входа."],
          ['    test := []string{"Hello", "World", "42"}', "Тестовый срез строк."],
          ["    fmt.Println(ConcatParams(test))", "Выводим склеенный результат."],
          ["}", "Конец main."]
        ],
        hint: "Главная ошибка студентов — добавлять '\\n' после каждого элемента, включая последний. Начните с первого элемента и добавляйте '\\n' перед последующими.",
        checks: [
          { re: /func\s+ConcatParams\s*\(\s*\w+\s+\[\]string\s*\)\s*string/, msg: "Объявите func ConcatParams(args []string) string" },
          { re: /len\s*\(\s*\w+\s*\)\s*==\s*0/, msg: "Обработайте случай пустого среза len(args) == 0" },
          { re: /\\n/, msg: "Разделяйте элементы символом перевода строки '\\n'" }
        ],
        starter: "package main\n\nimport \"fmt\"\n\n// Напишите ConcatParams(args []string) string\n\nfunc main() {\n    test := []string{\"Hello\", \"World\", \"42\"}\n    fmt.Println(ConcatParams(test))\n}\n",
        solution: "package main\n\nimport \"fmt\"\n\nfunc ConcatParams(args []string) string {\n    if len(args) == 0 {\n        return \"\"\n    }\n    res := args[0]\n    for i := 1; i < len(args); i++ {\n        res += \"\\n\" + args[i]\n    }\n    return res\n}\n\nfunc main() {\n    test := []string{\"Hello\", \"World\", \"42\"}\n    fmt.Println(ConcatParams(test))\n}\n"
      },
      {
        id: "p_split_white_spaces",
        title: "SplitWhiteSpaces: парсинг слов со сложными пробелами (Экзамен 01 Edu)",
        desc: "Напишите функцию SplitWhiteSpaces(s string) []string, которая разделяет строку на слова по пробелам, табуляциям '\\t' и переводам строк '\\n'. Функция обязана игнорировать множественные пробелы подряд и не создавать пустых строк.",
        hard: true,
        exam: true,
        plan: [
          "1. Создайте срез var res []string и буфер текущего слова cur := \"\"",
          "2. Пройдите циклом по всем символам строки",
          "3. Если символ пробельный (c == ' ' || c == '\\t' || c == '\\n'): если cur не пуст, добавьте его в res и сбросьте cur = \"\"",
          "4. Иначе: добавьте символ к текущему слову cur += string(c)",
          "5. После цикла: если в cur остался текст (последнее слово строки), добавьте его в res",
          "6. Верните res"
        ],
        output: "[Hello World 01 Edu!]",
        lines: [
          ["package main", "Каркас программы."],
          ["", ""],
          ['import "fmt"', "Пакет fmt."],
          ["", ""],
          ["func SplitWhiteSpaces(s string) []string {", "Функция разбивки текста на слова."],
          ["    var res []string", "Срез для собранных слов."],
          ['    cur := ""', "Буфер текущего слова."],
          ["    for _, c := range s {", "Идём по каждому символу исходной строки."],
          ["        if c == ' ' || c == '\\t' || c == '\\n' {", "Встретили пробельный символ."],
          ['            if cur != "" {', "Если в буфере накопилось слово."],
          ["                res = append(res, cur)", "Сохраняем слово в результат."],
          ['                cur = ""', "Очищаем буфер."],
          ["            }", "Конец проверки буфера."],
          ["        } else {", "Символ является частью слова."],
          ["            cur += string(c)", "Дописываем символ к слову."],
          ["        }", "Конец проверки пробела."],
          ["    }", "Конец обхода строки."],
          ['    if cur != "" {', "Edge case: последнее слово перед концом строки."],
          ["        res = append(res, cur)", "Добавляем последнее слово."],
          ["    }", "Конец проверки последнего слова."],
          ["    return res", "Возвращаем срез слов."],
          ["}", "Конец функции SplitWhiteSpaces."],
          ["", ""],
          ["func main() {", "Точка входа."],
          ['    fmt.Println(SplitWhiteSpaces("  Hello   World\\t01\\nEdu!  "))', "Тест с множественными пробелами и табами."],
          ["}", "Конец main."]
        ],
        hint: "Обязательно проверьте if cur != \"\" после завершения цикла, иначе последнее слово строки потеряется!",
        checks: [
          { re: /func\s+SplitWhiteSpaces\s*\(\s*\w+\s+string\s*\)\s*\[\]string/, msg: "Объявите func SplitWhiteSpaces(s string) []string" },
          { re: /'\\t'|'\\n'/, msg: "Учитывайте знаки табуляции '\\t' и переноса строки '\\n'" },
          { re: /append\s*\(\s*res\s*,\s*cur\s*\)/, msg: "Добавляйте непустые слова через append" }
        ],
        starter: "package main\n\nimport \"fmt\"\n\n// Напишите SplitWhiteSpaces(s string) []string\n\nfunc main() {\n    fmt.Println(SplitWhiteSpaces(\"  Hello   World\\t01\\nEdu!  \"))\n}\n",
        solution: "package main\n\nimport \"fmt\"\n\nfunc SplitWhiteSpaces(s string) []string {\n    var res []string\n    cur := \"\"\n    for _, c := range s {\n        if c == ' ' || c == '\\t' || c == '\\n' {\n            if cur != \"\" {\n                res = append(res, cur)\n                cur = \"\"\n            }\n        } else {\n            cur += string(c)\n        }\n    }\n    if cur != \"\" {\n        res = append(res, cur)\n    }\n    return res\n}\n\nfunc main() {\n    fmt.Println(SplitWhiteSpaces(\"  Hello   World\\t01\\nEdu!  \"))\n}\n"
      }
    ]
  },

  // ==========================================
  // ТЕМА 23: Quest 08 — Структуры, Boolean и Чтение файлов
  // ==========================================
  {
    id: 23,
    track: "piscine",
    widgetTitle: "Виртуальная файловая система и DisplayFile (Quest 08)",
    title: "Структуры, Boolean и Чтение файлов: os.ReadFile (01 Edu Quest 08)",
    about: "пользовательские структуры, передача по указателю *struct, работа с файловой системой и экзаменационная задача DisplayFile",
    theory: R`
Квест 08 проверяет два ключевых навыка программиста:
1. Организация данных в структуры и их модификация через указатели.
2. Взаимодействие с реальной файловой системой операционной системы.

### 1. Структуры по указателю
Когда структура передаётся в функцию без указателя:
{{func Foo(p Point)}} — создаётся **полная копия** структуры. Любые изменения внутри функции пропадут при выходе!
Чтобы функция действительно изменила поля структуры, передаём указатель:
{{func SetPoint(ptr *Point)}}
В Go доступ к полям по указателю лаконичен: {{ptr.X = 42}} (разыменование {{"(*ptr).X"}} компилятор делает сам).

### 2. Строгие требования к DisplayFile и Cat
В экзаменационных задачах на чтение файлов автоматическая проверяющая система 01 Edu сверяет вывод до байта:
- Если имя файла не передано: вывод строго {{"File name missing\n"}}.
- Если аргументов больше одного: вывод строго {{"Too many arguments\n"}}.
- Если файл не существует или нет прав: вывод строго {{"Cannot read file\n"}}.

Для чтения файла в современных версиях Go идеально подходит функция {{os.ReadFile(filename)}}, которая возвращает срез байт {{[]byte}} и ошибку {{error}}.
`,
    examples: R`
Пример безопасного чтения файла:

${F}
package main

import (
    "fmt"
    "os"
)

func main() {
    if len(os.Args) < 2 {
        fmt.Println("File name missing")
        return
    }
    data, err := os.ReadFile(os.Args[1])
    if err != nil {
        fmt.Println("Cannot read file")
        return
    }
    fmt.Print(string(data))
}
${F}
`,
    quiz: [
      {
        q: "Что произойдет, если передать структуру в функцию как func Move(p Point), изменив p.X = 100?",
        o: [
          "Изменится локальная копия структуры, а исходная переменная в месте вызова останется прежней",
          "Изменится исходная переменная",
          "Программа упадет с ошибкой компиляции"
        ],
        why: "В Go все аргументы передаются по значению (копируются), если не использован явный указатель (*Point)."
      },
      {
        q: "Какое сообщение требует вывести 01 Edu, если программе DisplayFile передано 2 файла вместо одного?",
        o: [
          "'Too many arguments'",
          "'Error: maximum 1 argument allowed'",
          "'File name missing'"
        ],
        why: "Система z01 строго проверяет exact-match строки 'Too many arguments\\n'."
      }
    ],
    tasks: [
      {
        id: "p_set_point",
        title: "Point: модификация структуры через указатель",
        desc: "Опишите структуру Point с полями X int и Y int. Напишите функцию SetPoint(ptr *Point), которая изменяет координаты структуры по указателю: X устанавливает в 42, а Y в 21.",
        hard: false,
        plan: [
          "1. Объявите структуру type Point struct { X, Y int }",
          "2. Напишите функцию func SetPoint(ptr *Point)",
          "3. Установите ptr.X = 42",
          "4. Установите ptr.Y = 21",
          "5. В main создайте p := Point{} и передайте её адрес &p в SetPoint"
        ],
        output: "X: 42, Y: 21",
        lines: [
          ["package main", "Каркас программы."],
          ["", ""],
          ['import "fmt"', "Пакет fmt."],
          ["", ""],
          ["type Point struct {", "Объявление структуры Point."],
          ["    X int", "Координата X."],
          ["    Y int", "Координата Y."],
          ["}", "Конец объявления структуры."],
          ["", ""],
          ["func SetPoint(ptr *Point) {", "Функция, принимающая указатель на структуру."],
          ["    ptr.X = 42", "Изменяем поле X исходной структуры."],
          ["    ptr.Y = 21", "Изменяем поле Y исходной структуры."],
          ["}", "Конец функции SetPoint."],
          ["", ""],
          ["func main() {", "Главная функция."],
          ["    p := Point{}", "Создаём структуру."],
          ["    SetPoint(&p)", "Передаём указатель через знак амперсанда &."],
          ['    fmt.Printf("X: %d, Y: %d\\n", p.X, p.Y)', "Печатаем изменённые поля."],
          ["}", "Конец main."]
        ],
        hint: "Не забудьте передать структуру по адресу с помощью символа & в main: SetPoint(&p).",
        checks: [
          { re: /type\s+Point\s+struct/, msg: "Объявите type Point struct" },
          { re: /func\s+SetPoint\s*\(\s*\w+\s+\*Point\s*\)/, msg: "Объявите func SetPoint(ptr *Point)" },
          { re: /42[\s\S]*21|21[\s\S]*42/, msg: "Установите X = 42 и Y = 21" }
        ],
        starter: "package main\n\nimport \"fmt\"\n\n// Объявите type Point struct и func SetPoint(ptr *Point)\n\nfunc main() {\n    p := Point{}\n    SetPoint(&p)\n    fmt.Printf(\"X: %d, Y: %d\\n\", p.X, p.Y)\n}\n",
        solution: "package main\n\nimport \"fmt\"\n\ntype Point struct {\n    X int\n    Y int\n}\n\nfunc SetPoint(ptr *Point) {\n    ptr.X = 42\n    ptr.Y = 21\n}\n\nfunc main() {\n    p := Point{}\n    SetPoint(&p)\n    fmt.Printf(\"X: %d, Y: %d\\n\", p.X, p.Y)\n}\n"
      },
      {
        id: "p_display_file",
        title: "DisplayFile: чтение файла со строгой проверкой аргументов (Экзамен 01 Edu)",
        desc: "Напишите программу DisplayFile, которая принимает имя файла аргументом командной строки и печатает его содержимое. Если аргумент не передан, выведите 'File name missing\\n'. Если передано больше 1 аргумента, выведите 'Too many arguments\\n'. Если при чтении произошла ошибка, выведите 'Cannot read file\\n'.",
        hard: true,
        exam: true,
        plan: [
          "1. Проверьте len(os.Args): если меньше 2, напечатайте 'File name missing' и завершите return",
          "2. Если len(os.Args) больше 2, напечатайте 'Too many arguments' и завершите return",
          "3. Прочитайте файл с помощью os.ReadFile(os.Args[1])",
          "4. Если err != nil, напечатайте 'Cannot read file' и завершите return",
          "5. Иначе напечатайте содержимое string(data)"
        ],
        output: "Hello from file!",
        lines: [
          ["package main", "Каркас."],
          ["", ""],
          ['import (', "Импорт."],
          ['    "fmt"', "Вывод."],
          ['    "os"', "Файловые операции и os.Args."],
          [")", "Конец."],
          ["", ""],
          ["func main() {", "Точка входа."],
          ["    if len(os.Args) < 2 {", "Случай 1: аргумент имени файла не передан."],
          ['        fmt.Println("File name missing")', "Строго по стандарту 01 Edu."],
          ["        return", "Завершаем программу."],
          ["    }", "Конец проверки."],
          ["    if len(os.Args) > 2 {", "Случай 2: передали 2 или более файла."],
          ['        fmt.Println("Too many arguments")', "Строго по стандарту 01 Edu."],
          ["        return", "Завершаем программу."],
          ["    }", "Конец проверки."],
          ["    data, err := os.ReadFile(os.Args[1])", "Пытаемся прочитать файл."],
          ["    if err != nil {", "Случай 3: файл не найден или нет доступа."],
          ['        fmt.Println("Cannot read file")', "Сообщение об ошибке."],
          ["        return", "Завершаем программу."],
          ["    }", "Конец проверки ошибки."],
          ["    fmt.Print(string(data))", "Печатаем прочитанное содержимое файла."],
          ["}", "Конец main."]
        ],
        hint: "Выводите текст точно: 'File name missing', 'Too many arguments' и 'Cannot read file'. Точность формулировок критична для 01 Edu.",
        checks: [
          { re: /"File name missing"/, msg: "Обработайте случай отсутствия аргументов: \"File name missing\"" },
          { re: /"Too many arguments"/, msg: "Обработайте случай лишних аргументов: \"Too many arguments\"" },
          { re: /"Cannot read file"/, msg: "Обработайте ошибку чтения файла: \"Cannot read file\"" }
        ],
        starter: "package main\n\nimport (\n    \"fmt\"\n    \"os\"\n)\n\nfunc main() {\n    // Реализуйте проверки аргументов и чтение файла\n}\n",
        solution: "package main\n\nimport (\n    \"fmt\"\n    \"os\"\n)\n\nfunc main() {\n    if len(os.Args) < 2 {\n        fmt.Println(\"File name missing\")\n        return\n    }\n    if len(os.Args) > 2 {\n        fmt.Println(\"Too many arguments\")\n        return\n    }\n    data, err := os.ReadFile(os.Args[1])\n    if err != nil {\n        fmt.Println(\"Cannot read file\")\n        return\n    }\n    fmt.Print(string(data))\n}\n"
      }
    ]
  },

  // ==========================================
  // ТЕМА 24: Quest 09 — Функции как аргументы: Map, Any и DoOp
  // ==========================================
  {
    id: 24,
    track: "piscine",
    widgetTitle: "Интерактивный конвейер функций (Function Pipeline & DoOp)",
    title: "Функции как аргументы: Map, Any и калькулятор DoOp (01 Edu Quest 09)",
    about: "функции первого класса, передача функций в функции, фильтрация срезов и культовый CLI-калькулятор DoOp с делением на ноль",
    theory: R`
В квесте 09 студенты переходят от процедурного программирования к функциональным паттернам.

### 1. Функции — полноправные объекты (First-Class Citizens)
В Go функция — это такой же тип данных, как {{int}} или {{string}}. Вы можете передать функцию в качестве аргумента другой функции!

Сигнатура функции, принимающей колбэк:
{{func Map(f func(int) bool, a []int) []bool}}
Здесь {{f}} — это функция, которая принимает число {{int}} и возвращает {{bool}}. Внутри {{Map}} мы вызываем её как {{f(a[i])}}.

### 2. Культовая задача DoOp
{{DoOp}} — это консольный калькулятор, который проверяет способность написать чистую логику обработки пользовательского ввода:
- Принимает 3 аргумента: {{число1}}, {{оператор}} ({{"\+"}}, {{"\-"}}, {{"\*"}}, {{"\/"}}, {{"\%"}}), {{число2}}.
- Если деление на 0: вывести строго {{"No division by 0\n"}}.
- Если остаток от 0: вывести строго {{"No modulo by 0\n"}}.
- Если оператор неизвестен или аргументов не 3: ничего не выводить.
`,
    examples: R`
Пример функции Map:

${F}
package main

import "fmt"

func Map(f func(int) bool, a []int) []bool {
    res := make([]bool, len(a))
    for i, v := range a {
        res[i] = f(v)
    }
    return res
}

func main() {
    isEven := func(n int) bool { return n%2 == 0 }
    numbers := []int{1, 2, 3, 4, 5, 6}
    fmt.Println(Map(isEven, numbers))
}
${F}

Вывод:
${F}
[false true false true false true]
${F}
`,
    quiz: [
      {
        q: "Что означает тип func(string) bool в параметрах функции?",
        o: [
          "Функция принимает другую функцию, которая берет строку и возвращает bool",
          "Функция возвращает срез строк",
          "Функция проверяет, является ли строка булевой"
        ],
        why: "Это сигнатура функции высшего порядка (First-Class Function)."
      },
      {
        q: "Какое сообщение требует вывести DoOp при делении 42 / 0?",
        o: [
          "'No division by 0'",
          "'Error: Division by zero'",
          "'Infinity'"
        ],
        why: "Система 01 Edu строго сверяет строку 'No division by 0\\n'."
      }
    ],
    tasks: [
      {
        id: "p_map",
        title: "Map: применение функции к каждому элементу среза",
        desc: "Напишите функцию Map(f func(int) bool, a []int) []bool, которая возвращает новый срез булевых значений, где каждый элемент — это результат вызова функции f на соответствующем элементе a.",
        hard: false,
        plan: [
          "1. Выделите срез res := make([]bool, len(a))",
          "2. Обойдите срез a с помощью цикла for i, v := range a",
          "3. Запишите в res[i] результат вызова f(v)",
          "4. Верните res"
        ],
        output: "[false true false true]",
        lines: [
          ["package main", "Каркас."],
          ["", ""],
          ['import "fmt"', "Пакет fmt."],
          ["", ""],
          ["func Map(f func(int) bool, a []int) []bool {", "Функция высшего порядка Map."],
          ["    res := make([]bool, len(a))", "Аллоцируем срез точного размера."],
          ["    for i, v := range a {", "Идём по элементам входного среза."],
          ["        res[i] = f(v)", "Применяем функцию f к текущему числу."],
          ["    }", "Конец цикла."],
          ["    return res", "Возвращаем срез результатов."],
          ["}", "Конец функции Map."],
          ["", ""],
          ["func main() {", "Точка входа."],
          ["    isEven := func(n int) bool { return n%2 == 0 }", "Анонимная функция проверки на четность."],
          ["    fmt.Println(Map(isEven, []int{1, 2, 3, 4}))", "Применяем Map."],
          ["}", "Конец main."]
        ],
        hint: "Используйте make([]bool, len(a)) для мгновенного выделения памяти нужного размера.",
        checks: [
          { re: /func\s+Map\s*\(\s*\w+\s+func\s*\(\s*int\s*\)\s*bool\s*,\s*\w+\s+\[\]int\s*\)\s*\[\]bool/, msg: "Объявите func Map(f func(int) bool, a []int) []bool" },
          { re: /make\s*\(\s*\[\]bool\s*,\s*len\s*\(/, msg: "Выделите память через make([]bool, len(a))" }
        ],
        starter: "package main\n\nimport \"fmt\"\n\n// Напишите Map(f func(int) bool, a []int) []bool\n\nfunc main() {\n    isEven := func(n int) bool { return n%2 == 0 }\n    fmt.Println(Map(isEven, []int{1, 2, 3, 4}))\n}\n",
        solution: "package main\n\nimport \"fmt\"\n\nfunc Map(f func(int) bool, a []int) []bool {\n    res := make([]bool, len(a))\n    for i, v := range a {\n        res[i] = f(v)\n    }\n    return res\n}\n\nfunc main() {\n    isEven := func(n int) bool {\n        return n%2 == 0\n    }\n    fmt.Println(Map(isEven, []int{1, 2, 3, 4}))\n}\n"
      },
      {
        id: "p_any",
        title: "Any: проверка наличия хотя бы одного совпадения",
        desc: "Напишите функцию Any(f func(string) bool, a []string) bool, которая возвращает true, если хотя бы для одной строки в срезе a вызов f(s) вернул true. Если совпадений нет или срез пуст, верните false.",
        hard: false,
        plan: [
          "1. Пройдите циклом for _, s := range a",
          "2. Если f(s) == true, сразу верните true (ранний выход)",
          "3. Если цикл завершился и совпадений не было, верните false"
        ],
        output: "true\nfalse",
        lines: [
          ["package main", "Каркас."],
          ["", ""],
          ['import "fmt"', "Пакет fmt."],
          ["", ""],
          ["func Any(f func(string) bool, a []string) bool {", "Функция проверки предиката Any."],
          ["    for _, s := range a {", "Перебираем строки из среза."],
          ["        if f(s) {", "Если предикат истинен хотя бы для одного элемента."],
          ["            return true", "Сразу возвращаем true."],
          ["        }", "Конец if."],
          ["    }", "Конец цикла."],
          ["    return false", "Ни один элемент не подошел."],
          ["}", "Конец функции Any."],
          ["", ""],
          ["func main() {", "Точка входа."],
          ['    hasLength3 := func(s string) bool { return len(s) == 3 }', "Предикат: длина равна 3."],
          ['    fmt.Println(Any(hasLength3, []string{"Hello", "cat", "Go"}))', "Тест 1: 'cat' имеет длину 3 (true)."],
          ['    fmt.Println(Any(hasLength3, []string{"Hello", "World"}))', "Тест 2: нет слов длины 3 (false)."],
          ["}", "Конец main."]
        ],
        hint: "Не продолжайте цикл после первого найденного совпадения — сразу возвращайте true.",
        checks: [
          { re: /func\s+Any\s*\(\s*\w+\s+func\s*\(\s*string\s*\)\s*bool\s*,\s*\w+\s+\[\]string\s*\)\s*bool/, msg: "Объявите func Any(f func(string) bool, a []string) bool" },
          { re: /return\s+true/, msg: "Возвращайте true при первом же совпадении" },
          { re: /return\s+false/, msg: "Возвращайте false в конце" }
        ],
        starter: "package main\n\nimport \"fmt\"\n\n// Напишите Any(f func(string) bool, a []string) bool\n\nfunc main() {\n    hasLength3 := func(s string) bool { return len(s) == 3 }\n    fmt.Println(Any(hasLength3, []string{\"Hello\", \"cat\", \"Go\"}))\n    fmt.Println(Any(hasLength3, []string{\"Hello\", \"World\"}))\n}\n",
        solution: "package main\n\nimport \"fmt\"\n\nfunc Any(f func(string) bool, a []string) bool {\n    for _, s := range a {\n        if f(s) {\n            return true\n        }\n    }\n    return false\n}\n\nfunc main() {\n    hasLength3 := func(s string) bool {\n        return len(s) == 3\n    }\n    fmt.Println(Any(hasLength3, []string{\"Hello\", \"cat\", \"Go\"}))\n    fmt.Println(Any(hasLength3, []string{\"Hello\", \"World\"}))\n}\n"
      },
      {
        id: "p_doop",
        title: "DoOp: калькулятор выражений и деление на ноль (Экзамен 01 Edu)",
        desc: "Напишите функцию DoOp(a int, op string, b int), которая выполняет операцию над числами: +, -, *, /, %. Если происходит деление на 0 (/ 0), напечатайте строго 'No division by 0'. Если остаток от 0 (% 0), напечатайте строго 'No modulo by 0'. В остальных случаях напечатайте результат операции.",
        hard: true,
        exam: true,
        plan: [
          "1. Проверьте оператор: switch op",
          "2. Для '/': если b == 0, напечатайте 'No division by 0', иначе a / b",
          "3. Для '%': если b == 0, напечатайте 'No modulo by 0', иначе a % b",
          "4. Для '+', '-', '*' выполните соответствующие арифметические действия",
          "5. В main протестируйте деление на ноль и стандартные операции"
        ],
        output: "25\nNo division by 0\nNo modulo by 0",
        lines: [
          ["package main", "Каркас программы."],
          ["", ""],
          ['import "fmt"', "Пакет fmt."],
          ["", ""],
          ["func DoOp(a int, op string, b int) {", "Функция вычисления операции."],
          ["    switch op {", "Выбираем действие по оператору."],
          ['    case "+":', "Сложение."],
          ["        fmt.Println(a + b)", "Печатаем сумму."],
          ['    case "-":', "Вычитание."],
          ["        fmt.Println(a - b)", "Печатаем разность."],
          ['    case "*":', "Умножение."],
          ["        fmt.Println(a * b)", "Печатаем произведение."],
          ['    case "/":', "Деление."],
          ["        if b == 0 {", "Edge case: деление на ноль!"],
          ['            fmt.Println("No division by 0")', "Строгое сообщение 01 Edu."],
          ["        } else {", "Знаменатель не ноль."],
          ["            fmt.Println(a / b)", "Печатаем частное."],
          ["        }", "Конец проверки делителя."],
          ['    case "%":', "Остаток от деления."],
          ["        if b == 0 {", "Edge case: остаток от нуля!"],
          ['            fmt.Println("No modulo by 0")', "Строгое сообщение 01 Edu."],
          ["        } else {", "Делитель не ноль."],
          ["            fmt.Println(a % b)", "Печатаем остаток."],
          ["        }", "Конец проверки."],
          ["    }", "Конец switch."],
          ["}", "Конец функции DoOp."],
          ["", ""],
          ["func main() {", "Точка входа."],
          ['    DoOp(20, "+", 5)', "20 + 5 = 25."],
          ['    DoOp(42, "/", 0)', "Деление на ноль."],
          ['    DoOp(42, "%", 0)', "Остаток от нуля."],
          ["}", "Конец main."]
        ],
        hint: "Не забудьте кавычки в switch op: case \"+\", case \"/\" и т.д. Обработка нуля в b == 0 спасает от аварийного завершения программы (panic: integer divide by zero).",
        checks: [
          { re: /func\s+DoOp\s*\(\s*\w+\s+int\s*,\s*\w+\s+string\s*,\s*\w+\s+int\s*\)/, msg: "Объявите func DoOp(a int, op string, b int)" },
          { re: /"No division by 0"/, msg: "Выводите \"No division by 0\" при b == 0 для оператора '/'" },
          { re: /"No modulo by 0"/, msg: "Выводите \"No modulo by 0\" при b == 0 для оператора '%'" }
        ],
        starter: "package main\n\nimport \"fmt\"\n\n// Напишите DoOp(a int, op string, b int)\n\nfunc main() {\n    DoOp(20, \"+\", 5)\n    DoOp(42, \"/\", 0)\n    DoOp(42, \"%\", 0)\n}\n",
        solution: "package main\n\nimport \"fmt\"\n\nfunc DoOp(a int, op string, b int) {\n    switch op {\n    case \"+\":\n        fmt.Println(a + b)\n    case \"-\":\n        fmt.Println(a - b)\n    case \"*\":\n        fmt.Println(a * b)\n    case \"/\":\n        if b == 0 {\n            fmt.Println(\"No division by 0\")\n        } else {\n            fmt.Println(a / b)\n        }\n    case \"%\":\n        if b == 0 {\n            fmt.Println(\"No modulo by 0\")\n        } else {\n            fmt.Println(a % b)\n        }\n    }\n}\n\nfunc main() {\n    DoOp(20, \"+\", 5)\n    DoOp(42, \"/\", 0)\n    DoOp(42, \"%\", 0)\n}\n"
      }
    ]
  },

  // ==========================================
  // ТЕМА 25: Quest 10 — Экзамен Piscine: Битовые операции и Алгоритмы
  // ==========================================
  {
    id: 25,
    track: "piscine",
    widgetTitle: "Битовый рентген и Симулятор Коллатца (Quest 10 Exam)",
    title: "Экзамен Piscine: Битовые операции и Алгоритмы (01 Edu Quest 10)",
    about: "побитовые сдвиги, подсчет единичных бит ActiveBits, поиск непарного элемента через XOR и гипотеза Коллатца",
    theory: R`
Квест 10 — это финальный аккорд бассейна перед решающим экзаменом. Здесь соединяются низкоуровневые битовые операции и алгоритмическая смекалка.

### 1. Битовые операции (Bitwise)
Числа внутри процессора хранятся как цепочки битов 0 и 1.
- **Побитовое И ({{&}})**: {{n & 1}} возвращает 1, если последний бит равен 1 (число нечётное), и 0, если чётное.
- **Битовый сдвиг вправо ({{>>}})**: {{n >> 1}} сдвигает все биты вправо на 1 позицию (равносильно целочисленному делению на 2).
- Комбинация {{n & 1}} и {{n >>= 1}} позволяет перебрать все биты числа за микросекунды без перевода в строку!

### 2. Магия XOR: поиск непарного числа
Операция **Исключающее ИЛИ (XOR {{^}})** обладает фантастическими математическими свойствами:
1. {{x ^ x == 0}} (любое число, сложенное само с собой через XOR, уничтожается в 0).
2. {{x ^ 0 == x}} (любое число при XOR с нулём остаётся собой).
3. Операция ассоциативна и коммутативна (порядок чисел не важен).

**Задача Unmatch:** дан массив чисел, где каждое число встречается ровно по 2 раза, и лишь одно число — уникальное.
Вместо того чтобы городить хеш-таблицы {{map}} и тратить оперативную память, достаточно сделать XOR всех чисел подряд:
{{for _, x := range arr { res ^= x }}}
Все дубликаты взаимоуничтожатся в 0, и останется ровно то самое уникальное число! Память $O(1)$, время $O(N)$!
`,
    examples: R`
Пример подсчёта единичных битов (ActiveBits):

${F}
package main

import "fmt"

func ActiveBits(n int) int {
    count := 0
    for n > 0 {
        count += n & 1
        n >>= 1
    }
    return count
}

func main() {
    // 15 в двоичной системе это 1111 (4 единицы)
    fmt.Println(ActiveBits(15))
    // 4 в двоичной системе это 100 (1 единица)
    fmt.Println(ActiveBits(4))
}
${F}

Вывод:
${F}
4
1
${F}
`,
    quiz: [
      {
        q: "Чему равно выражение 7 ^ 7 в языке Go?",
        o: [
          "0 (так как XOR одинаковых чисел даёт 0)",
          "14",
          "49"
        ],
        why: "По свойству XOR: бит ^ тот же бит всегда даёт 0 (1^1=0, 0^0=0)."
      },
      {
        q: "Что делает операция n >>= 1?",
        o: [
          "Сдвигает биты числа вправо на 1 (делит число на 2 на уровне процессора)",
          "Увеличивает число в 2 раза",
          "Сравнивает n с единицей"
        ],
        why: "Битовый сдвиг вправо отбрасывает младший бит и делит целое число на 2."
      }
    ],
    tasks: [
      {
        id: "p_active_bits",
        title: "ActiveBits: быстрый подсчёт единичных битов числа",
        desc: "Напишите функцию ActiveBits(n int) int, которая возвращает количество единичных битов ('1') в двоичном представлении целого положительного числа n с помощью побитовых операций.",
        hard: false,
        plan: [
          "1. Заведите счётчик count := 0",
          "2. Запустите цикл while: for n > 0",
          "3. Добавьте к счётчику младший бит: count += n & 1",
          "4. Сдвиньте число вправо на 1 бит: n >>= 1",
          "5. Верните count"
        ],
        output: "4\n1\n0",
        lines: [
          ["package main", "Каркас."],
          ["", ""],
          ['import "fmt"', "Пакет fmt."],
          ["", ""],
          ["func ActiveBits(n int) int {", "Функция подсчёта активных бит."],
          ["    count := 0", "Счётчик единиц."],
          ["    for n > 0 {", "Пока в числе остались биты."],
          ["        count += n & 1", "Прибавляем младший бит (1 или 0)."],
          ["        n >>= 1", "Сдвигаем число на 1 бит вправо."],
          ["    }", "Конец цикла."],
          ["    return count", "Возвращаем число единичных битов."],
          ["}", "Конец функции ActiveBits."],
          ["", ""],
          ["func main() {", "Точка входа."],
          ["    fmt.Println(ActiveBits(15))", "15 = 0b1111 -> 4 бита."],
          ["    fmt.Println(ActiveBits(4))", "4 = 0b0100 -> 1 бит."],
          ["    fmt.Println(ActiveBits(0))", "0 = 0b0000 -> 0 бит."],
          ["}", "Конец main."]
        ],
        hint: "Используйте побитовое 'И' с единицей: n & 1. Если бит равен 1, к счётчику прибавится 1, если 0 — прибавится 0.",
        checks: [
          { re: /func\s+ActiveBits\s*\(\s*\w+\s+int\s*\)\s*int/, msg: "Объявите func ActiveBits(n int) int" },
          { re: /&\s*1/, msg: "Используйте побитовую операцию n & 1" },
          { re: />>=\s*1|>>\s*1/, msg: "Используйте сдвиг вправо >> 1" }
        ],
        starter: "package main\n\nimport \"fmt\"\n\n// Напишите ActiveBits(n int) int\n\nfunc main() {\n    fmt.Println(ActiveBits(15))\n    fmt.Println(ActiveBits(4))\n    fmt.Println(ActiveBits(0))\n}\n",
        solution: "package main\n\nimport \"fmt\"\n\nfunc ActiveBits(n int) int {\n    count := 0\n    for n > 0 {\n        count += n & 1\n        n >>= 1\n    }\n    return count\n}\n\nfunc main() {\n    fmt.Println(ActiveBits(15))\n    fmt.Println(ActiveBits(4))\n    fmt.Println(ActiveBits(0))\n}\n"
      },
      {
        id: "p_collatz_countdown",
        title: "CollatzCountdown: гипотеза Коллатца (3n+1)",
        desc: "Напишите функцию CollatzCountdown(start int) int, которая возвращает количество шагов, необходимых для достижения числа 1 по правилу Коллатца: если число четное, делим на 2; если нечетное — умножаем на 3 и прибавляем 1. Если start <= 0, верните 0.",
        hard: false,
        plan: [
          "1. Проверьте граничный случай: если start <= 0, верните 0",
          "2. Создайте счётчик шагов steps := 0",
          "3. Запустите цикл for start > 1",
          "4. Если start % 2 == 0, то start /= 2; иначе start = start * 3 + 1",
          "5. Увеличьте steps++",
          "6. После цикла верните steps"
        ],
        output: "7\n0",
        lines: [
          ["package main", "Каркас."],
          ["", ""],
          ['import "fmt"', "Пакет fmt."],
          ["", ""],
          ["func CollatzCountdown(start int) int {", "Функция вычисления шагов 3n+1."],
          ["    if start <= 0 {", "Edge case: неположительные числа."],
          ["        return 0", "Возвращаем 0."],
          ["    }", "Конец проверки."],
          ["    steps := 0", "Счётчик шагов."],
          ["    for start > 1 {", "Пока не дошли до 1."],
          ["        if start%2 == 0 {", "Если число чётное."],
          ["            start /= 2", "Делим на 2."],
          ["        } else {", "Если нечётное."],
          ["            start = start*3 + 1", "Умножаем на 3 и прибавляем 1."],
          ["        }", "Конец if."],
          ["        steps++", "Считаем шаг."],
          ["    }", "Конец цикла."],
          ["    return steps", "Возвращаем общее число шагов."],
          ["}", "Конец функции."],
          ["", ""],
          ["func main() {", "Точка входа."],
          ["    fmt.Println(CollatzCountdown(3))", "Для 3 траектория: 3->10->5->16->8->4->2->1 (7 шагов)."],
          ["    fmt.Println(CollatzCountdown(1))", "Для 1 нужно 0 шагов."],
          ["}", "Конец main."]
        ],
        hint: "Для числа 1 цикл for start > 1 не выполнится ни разу, и функция корректно вернет 0 шагов.",
        checks: [
          { re: /func\s+CollatzCountdown\s*\(\s*\w+\s+int\s*\)\s*int/, msg: "Объявите func CollatzCountdown(start int) int" },
          { re: /start\s*<=?\s*0/, msg: "Проверьте граничный случай start <= 0" },
          { re: /\*?\s*3\s*\+\s*1/, msg: "Используйте формулу start * 3 + 1" }
        ],
        starter: "package main\n\nimport \"fmt\"\n\n// Напишите CollatzCountdown(start int) int\n\nfunc main() {\n    fmt.Println(CollatzCountdown(3))\n    fmt.Println(CollatzCountdown(1))\n}\n",
        solution: "package main\n\nimport \"fmt\"\n\nfunc CollatzCountdown(start int) int {\n    if start <= 0 {\n        return 0\n    }\n    steps := 0\n    for start > 1 {\n        if start%2 == 0 {\n            start /= 2\n        } else {\n            start = start*3 + 1\n        }\n        steps++\n    }\n    return steps\n}\n\nfunc main() {\n    fmt.Println(CollatzCountdown(3))\n    fmt.Println(CollatzCountdown(1))\n}\n"
      },
      {
        id: "p_unmatch",
        title: "Unmatch: поиск непарного элемента через XOR (Экзамен 01 Edu)",
        desc: "Напишите функцию Unmatch(a []int) int, которая находит единственный элемент в срезе, не имеющий пары (все остальные элементы встречаются четное число раз). Если срез пуст, верните -1. Решите задачу оптимально за O(N) по времени и O(1) по памяти.",
        hard: true,
        exam: true,
        plan: [
          "1. Проверьте: если len(a) == 0, верните -1",
          "2. Создайте переменную xorSum := 0",
          "3. Пройдите циклом for _, val := range a",
          "4. Применяйте оператор XOR: xorSum ^= val",
          "5. Верните xorSum"
        ],
        output: "3\n42\n-1",
        lines: [
          ["package main", "Каркас программы."],
          ["", ""],
          ['import "fmt"', "Пакет fmt."],
          ["", ""],
          ["func Unmatch(a []int) int {", "Функция поиска уникального числа через XOR."],
          ["    if len(a) == 0 {", "Edge case: пустой срез."],
          ["        return -1", "Возвращаем -1."],
          ["    }", "Конец проверки."],
          ["    xorSum := 0", "Аккумулятор битовой операции XOR."],
          ["    for _, val := range a {", "Обходим все элементы среза."],
          ["        xorSum ^= val", "Одинаковые числа взаимоуничтожаются (x ^ x = 0)."],
          ["    }", "Конец цикла."],
          ["    return xorSum", "Осталось единственное непарное число."],
          ["}", "Конец функции Unmatch."],
          ["", ""],
          ["func main() {", "Точка входа."],
          ["    fmt.Println(Unmatch([]int{1, 2, 3, 1, 2}))", "Непарное число: 3."],
          ["    fmt.Println(Unmatch([]int{42}))", "Один элемент: 42."],
          ["    fmt.Println(Unmatch([]int{}))", "Пустой срез: -1."],
          ["}", "Конец main."]
        ],
        hint: "Операция xorSum ^= val работает за 1 такт процессора. Одинаковые числа обращаются в 0, а 0 ^ уникальное = уникальное.",
        checks: [
          { re: /func\s+Unmatch\s*\(\s*\w+\s+\[\]int\s*\)\s*int/, msg: "Объявите func Unmatch(a []int) int" },
          { re: /\^=|\^/, msg: "Используйте побитовую операцию XOR (^)" },
          { re: /len\s*\(\s*\w+\s*\)\s*==\s*0/, msg: "Обработайте случай пустого среза len(a) == 0" }
        ],
        starter: "package main\n\nimport \"fmt\"\n\n// Напишите Unmatch(a []int) int\n\nfunc main() {\n    fmt.Println(Unmatch([]int{1, 2, 3, 1, 2}))\n    fmt.Println(Unmatch([]int{42}))\n    fmt.Println(Unmatch([]int{}))\n}\n",
        solution: "package main\n\nimport \"fmt\"\n\nfunc Unmatch(a []int) int {\n    if len(a) == 0 {\n        return -1\n    }\n    xorSum := 0\n    for _, val := range a {\n        xorSum ^= val\n    }\n    return xorSum\n}\n\nfunc main() {\n    fmt.Println(Unmatch([]int{1, 2, 3, 1, 2}))\n    fmt.Println(Unmatch([]int{42}))\n    fmt.Println(Unmatch([]int{}))\n}\n"
      }
    ]
  }
];
  NEW_QUEST_TOPICS.forEach(t => PISCINE_TOPICS.push(t));

  // Добавляем темы бассейна в общий список
  if (window.TOPICS) {
    PISCINE_TOPICS.forEach(t => {
      const idx = TOPICS.findIndex(existing => existing.id === t.id);
      if (idx !== -1) TOPICS[idx] = t;
      else TOPICS.push(t);
    });
  }

  // ==========================================
  // Интерактивные визуализаторы (Interactive Widgets)
  // ==========================================
  window.getPiscineRenderer = function (topicId) {
    if (topicId === 14) return initQuadViz;
    if (topicId === 15) return initPointerViz;
    if (topicId === 16) return initRuneViz;
    if (topicId === 17) return initRecursionViz;
    if (topicId === 18) return initMathViz;
    if (topicId === 19) return initChessViz;
    if (topicId === 20) return window.initStringViz;
    if (topicId === 21) return window.initArgsViz;
    if (topicId === 22) return window.initSplitViz;
    if (topicId === 23) return window.initFileViz;
    if (topicId === 24) return window.initDoOpViz;
    if (topicId === 25) return window.initBitsViz;
    return null;
  };

  window.initPiscineWidgets = function (topicId, container) {
    const fn = window.getPiscineRenderer(topicId);
    if (fn) fn(container);
  };

  // --- 1. Quad Visualizer ---
  function initQuadViz(container) {
    const el = container || document.getElementById("piscineWidgetArea") || document.getElementById("quadVizContainer");
    if (!el) return;

    el.innerHTML = `
      <div class="quad-widget">
        <div class="qw-header">
          <div class="qw-title">🎮 Интерактивный симулятор Quad и координат</div>
          <div class="qw-controls">
            <label>Ширина X: <b id="qwXval">5</b> <input type="range" id="qwX" min="1" max="8" value="5"></label>
            <label>Высота Y: <b id="qwYval">3</b> <input type="range" id="qwY" min="1" max="6" value="3"></label>
            <div class="qw-btns">
              <button class="btn small on" id="qwTypeA">QuadA</button>
              <button class="btn ghost small" id="qwTypeB">QuadB</button>
              <button class="btn ghost small" id="qwTypeC">QuadC</button>
              <button class="btn small" id="qwPlay">▶ Шаг за шагом</button>
            </div>
          </div>
        </div>
        <div class="qw-grid-area">
          <div class="qw-grid" id="qwGrid"></div>
          <div class="qw-info" id="qwInfo">
            <div class="qw-badge">Наведите на клетку таблицы слева</div>
            <div class="qw-desc">Сетка показывает матрицу [row, col] и условие для каждого символа.</div>
          </div>
        </div>
      </div>
    `;

    let x = 5, y = 3, type = "A", animId = null;

    const renderGrid = (activeRow = -1, activeCol = -1) => {
      const grid = document.getElementById("qwGrid");
      if (!grid) return;
      grid.style.gridTemplateColumns = `repeat(${x}, 38px)`;
      let html = "";
      for (let r = 0; r < y; r++) {
        for (let c = 0; c < x; c++) {
          let ch = " ";
          let role = "inner";
          if (type === "A") {
            if ((r === 0 || r === y - 1) && (c === 0 || c === x - 1)) { ch = "o"; role = "corner"; }
            else if (r === 0 || r === y - 1) { ch = "-"; role = "horiz"; }
            else if (c === 0 || c === x - 1) { ch = "|"; role = "vert"; }
          } else if (type === "B") {
            if (r === 0 && c === 0) { ch = "/"; role = "corner"; }
            else if (r === 0 && c === x - 1) { ch = "\\"; role = "corner"; }
            else if (r === y - 1 && c === 0) { ch = "\\"; role = "corner"; }
            else if (r === y - 1 && c === x - 1) { ch = "/"; role = "corner"; }
            else if (r === 0 || r === y - 1 || c === 0 || c === x - 1) { ch = "*"; role = "border"; }
          } else {
            if (r === 0 && (c === 0 || c === x - 1)) { ch = "A"; role = "corner"; }
            else if (r === y - 1 && (c === 0 || c === x - 1)) { ch = "C"; role = "corner"; }
            else if (r === 0 || r === y - 1 || c === 0 || c === x - 1) { ch = "B"; role = "border"; }
          }
          const isActive = (r === activeRow && c === activeCol);
          html += `<div class="qw-cell ${role} ${isActive ? "active" : ""}" data-r="${r}" data-c="${c}" data-ch="${ch}" data-role="${role}">
            <span class="qw-ch">${ch === " " ? "·" : ch}</span>
            <span class="qw-sub">${r},${c}</span>
          </div>`;
        }
      }
      grid.innerHTML = html;
    };

    const updateInfo = (r, c, ch, role) => {
      const info = document.getElementById("qwInfo");
      if (!info) return;
      let text = "";
      if (role === "corner") text = `УГОЛ: row = ${r}, col = ${c} (крайняя строка и крайний столбец) -> символ '${ch}'`;
      else if (role === "horiz") text = `ВЕРХ/НИЗ: row = ${r} (строка 0 или y-1) -> символ '-'`;
      else if (role === "vert") text = `БОКОВАЯ СТОРОНА: col = ${c} (столбец 0 или x-1) -> символ '|'`;
      else if (role === "border") text = `ГРАНИЦА: строка или столбец на краю -> символ '${ch}'`;
      else text = `ВНУТРИ: не угол и не граница -> печатаем ПРОБЕЛ ' '`;

      info.innerHTML = `
        <div class="qw-badge ok">Клетка [row: ${r}, col: ${c}]</div>
        <div class="qw-desc"><b>${text}</b></div>
        <div class="qw-code">if (row == ${r} && col == ${c}) -> fmt.Print("${ch}")</div>
      `;
    };

    renderGrid();

    const xEl = document.getElementById("qwX");
    const yEl = document.getElementById("qwY");
    if (xEl) xEl.oninput = e => { x = +e.target.value; document.getElementById("qwXval").textContent = x; renderGrid(); };
    if (yEl) yEl.oninput = e => { y = +e.target.value; document.getElementById("qwYval").textContent = y; renderGrid(); };

    const setType = (t) => {
      type = t;
      ["A", "B", "C"].forEach(k => {
        const btn = document.getElementById("qwType" + k);
        if (btn) btn.className = (k === t) ? "btn small on" : "btn ghost small";
      });
      renderGrid();
    };

    const bA = document.getElementById("qwTypeA"); if (bA) bA.onclick = () => setType("A");
    const bB = document.getElementById("qwTypeB"); if (bB) bB.onclick = () => setType("B");
    const bC = document.getElementById("qwTypeC"); if (bC) bC.onclick = () => setType("C");

    const gridEl = document.getElementById("qwGrid");
    if (gridEl) {
      gridEl.addEventListener("mouseover", e => {
        const cell = e.target.closest(".qw-cell");
        if (cell) updateInfo(+cell.dataset.r, +cell.dataset.c, cell.dataset.ch, cell.dataset.role);
      });
    }

    const playBtn = document.getElementById("qwPlay");
    if (playBtn) {
      playBtn.onclick = () => {
        clearInterval(animId);
        let curR = 0, curC = 0;
        animId = setInterval(() => {
          renderGrid(curR, curC);
          const cell = document.querySelector(`.qw-cell[data-r="${curR}"][data-c="${curC}"]`);
          if (cell) updateInfo(curR, curC, cell.dataset.ch, cell.dataset.role);
          curC++;
          if (curC >= x) { curC = 0; curR++; }
          if (curR >= y) { clearInterval(animId); setTimeout(() => renderGrid(), 1000); }
        }, 150);
      };
    }
  }

  // --- 2. Pointer Visualizer ---
  function initPointerViz(container) {
    const el = container || document.getElementById("piscineWidgetArea") || document.getElementById("pointerVizContainer");
    if (!el) return;
    const isKZ = (window.getLang && window.getLang()) === "kz";

    el.innerHTML = `
      <div class="ptr-widget">
        <div class="ptr-title">${isKZ ? "📦 Нұсқағыштар қарапайым тілде: «Қорап және адресі бар қағаз»" : "📦 Указатели на пальцах: метафора «Коробка и Записка с адресом»"}</div>
        
        <div class="ptr-explainer" style="background:rgba(153,105,255,0.08);border-left:3px solid var(--accent);padding:10px 14px;border-radius:4px;margin-bottom:14px;font-size:13.5px;line-height:1.5">
          ${isKZ
            ? "<b>Нұсқағыштарды қиын терминдерсіз түсіну:</b><br>• <b>Айнымалы (num)</b> — бұл ішінде сан жатқан <i>қорап</i>.<br>• <b>&num таңбасы</b> — бұл жад қоймасындағы сол қораптың <i>адресі (нөмірі)</i>.<br>• <b>Нұсқағыш (ptr)</b> — бұл қораптың нөмірі жазылған <i>қағаз (жазба)</i>.<br>• <b>*ptr таңбасы</b> — <i>«жазбадағы адрес бойынша барып, қораптың ішіне қара және өзгерт»</i> командасы."
            : "<b>Как понимать указатели без сложной терминологии:</b><br>• <b>Переменная (num)</b> — это <i>коробка</i>, в которой лежит число.<br>• <b>Символ &num</b> — это <i>адрес (номер)</i> этой коробки на складе памяти.<br>• <b>Указатель (ptr)</b> — это <i>записка</i>, в которой записан номер коробки.<br>• <b>Символ *ptr</b> — команда <i>«пойди по адресу из записки и загляни внутрь коробки»</i>."}
        </div>

        <div class="ptr-actions">
          <button class="btn small" id="ptrVal">${isKZ ? "1. Қарапайым: num = 100" : "1. Обычное: num = 100"}</button>
          <button class="btn small on" id="ptrDeref">${isKZ ? "2. Нұсқағышпен: *ptr = 777" : "2. Через указатель: *ptr = 777"}</button>
          <button class="btn small" id="ptrSwap">${isKZ ? "3. Алмасу: Swap(&num, &other)" : "3. Обмен: Swap(&num, &other)"}</button>
          <button class="btn ghost small" id="ptrReset">${isKZ ? "Қалпына келтіру ↺" : "Сброс ↺"}</button>
        </div>

        <div class="ptr-mem" style="margin-top:16px">
          <!-- Коробка 1: num -->
          <div class="ptr-cell" id="cellA" style="border:2px solid var(--accent);background:#171520;position:relative">
            <span class="ptr-addr" style="color:var(--accent-l)">${isKZ ? "📦 Жад ұяшығы №101 (адрес)" : "📦 Ячейка памяти №101 (адрес)"}</span>
            <div class="ptr-val" id="valA" style="font-size:32px;font-weight:700;color:#fff">42</div>
            <span class="ptr-name" style="color:var(--text);font-weight:600">${isKZ ? "Қорап: num (сан)" : "Коробка: num (число)"}</span>
          </div>

          <!-- Записка: ptr -->
          <div class="ptr-arrow" id="ptrArrow" style="font-size:13px;font-weight:600;color:var(--accent-l)">${isKZ ? "⟵ №101-ге нұсқайды ──" : "⟵ указывает на №101 ──"}</div>

          <div class="ptr-cell" id="cellP" style="border:2px dashed #f59e0b;background:#1a1712">
            <span class="ptr-addr" style="color:#f59e0b">${isKZ ? "🏷️ Жад ұяшығы №102" : "🏷️ Ячейка памяти №102"}</span>
            <div class="ptr-val ok" style="color:#f59e0b;font-size:24px;font-weight:700">№101</div>
            <span class="ptr-name" style="color:#f59e0b;font-weight:600">${isKZ ? "Адресі бар қағаз: ptr" : "Записка с адресом: ptr"}</span>
          </div>

          <!-- Коробка 2: other -->
          <div class="ptr-cell" id="cellB" style="margin-left:auto;border:2px solid var(--line);background:#141318">
            <span class="ptr-addr" style="color:var(--muted)">${isKZ ? "📦 Жад ұяшығы №103 (адрес)" : "📦 Ячейка памяти №103 (адрес)"}</span>
            <div class="ptr-val" id="valB" style="font-size:32px;font-weight:700;color:#fff">10</div>
            <span class="ptr-name" style="color:var(--text);font-weight:600">${isKZ ? "Қорап: other (сан)" : "Коробка: other (число)"}</span>
          </div>
        </div>

        <div class="ptr-log" id="ptrLog" style="margin-top:14px;padding:12px 14px;background:#0d0c10;border:1px solid var(--line);border-radius:4px;font-size:13.5px;line-height:1.55">
          ${isKZ ? "Жоғарыдағы түймелерді басыңыз 👆, жад қоймасындағы қораптардың қалай өзгеретінін нақты уақытта көріңіз." : "Нажмите кнопки выше 👆, чтобы в реальном времени увидеть, как меняются коробки и почему указатели позволяют менять данные в памяти из любого места программы."}
        </div>
      </div>
    `;

    const valA = document.getElementById("valA");
    const valB = document.getElementById("valB");
    const cellA = document.getElementById("cellA");
    const cellP = document.getElementById("cellP");
    const cellB = document.getElementById("cellB");
    const log = document.getElementById("ptrLog");

    const btnVal = document.getElementById("ptrVal");
    if (btnVal) btnVal.onclick = () => {
      valA.textContent = "100";
      valA.classList.add("flash");
      cellA.style.borderColor = "var(--ok)";
      setTimeout(() => { valA.classList.remove("flash"); cellA.style.borderColor = "var(--accent)"; }, 500);
      log.innerHTML = isKZ
        ? "<b>Әрекет: <code>num = 100</code></b><br>Біз тікелей <code>num</code> қорабына (№101 ұяшық) барып, оған 100 санын салдық. <code>ptr</code> қағазы өзгерген жоқ — ол әлі де №101 ұяшыққа нұсқап тұр, бірақ енді онда 100 саны тұрғанын көреді!"
        : "<b>Действие: <code>num = 100</code></b><br>Мы напрямую подошли к коробке <code>num</code> (ячейка №101) и положили туда число 100. Записка <code>ptr</code> не изменилась — она по-прежнему указывает на ячейку №101, но теперь видит там число 100!";
    };

    const btnDeref = document.getElementById("ptrDeref");
    if (btnDeref) btnDeref.onclick = () => {
      valA.textContent = "777";
      valA.classList.add("flash");
      cellP.classList.add("flash");
      cellA.style.borderColor = "#f59e0b";
      setTimeout(() => { valA.classList.remove("flash"); cellP.classList.remove("flash"); cellA.style.borderColor = "var(--accent)"; }, 500);
      log.innerHTML = isKZ
        ? "<b>Әрекет: <code>*ptr = 777</code> (Разыменование)</b><br>Нұсқағыштардың сиқыры! Біз <code>num</code> айнымалысына тікелей тиіскен жоқпыз. Біз <code>ptr</code> қағазын алып, ондағы «№101» адресін оқып, сол ұяшықты ашып, ішіне 777 қойдық. Енді <code>num</code> қорабының мәні сырттан өзгерді!"
        : "<b>Действие: <code>*ptr = 777</code> (Разыменование)</b><br>Магия указателей в действии! Мы НЕ трогали переменную <code>num</code> напрямую. Мы взяли записку <code>ptr</code>, прочитали адрес «№101», открыли эту ячейку и положили туда 777. Теперь значение переменной <code>num</code> изменилось на 777 чужими руками!";
    };

    const btnSwap = document.getElementById("ptrSwap");
    if (btnSwap) btnSwap.onclick = () => {
      const t = valA.textContent;
      valA.textContent = valB.textContent;
      valB.textContent = t;
      valA.classList.add("flash"); valB.classList.add("flash");
      cellA.style.borderColor = "var(--ok)"; cellB.style.borderColor = "var(--ok)";
      setTimeout(() => {
        valA.classList.remove("flash"); valB.classList.remove("flash");
        cellA.style.borderColor = "var(--accent)"; cellB.style.borderColor = "var(--line)";
      }, 500);
      log.innerHTML = isKZ
        ? "<b>Әрекет: <code>Swap(&num, &other)</code></b><br>Функция екі қораптың мекенжайын алды (№101 және №103). Уақытша <code>temp</code> ұяшығы арқылы олардың ішіндегі сандарын орындарымен ауыстырды! Нәтижесінде <code>num</code> енді " + valA.textContent + ", ал <code>other</code> — " + valB.textContent + " болды."
        : "<b>Действие: <code>Swap(&num, &other)</code></b><br>Функция получила адреса двух коробок (№101 и №103). Используя временную ячейку <code>temp</code>, она поменяла их содержимое местами! В результате <code>num</code> стал равен " + valA.textContent + ", а <code>other</code> — " + valB.textContent + ".";
    };

    const btnReset = document.getElementById("ptrReset");
    if (btnReset) btnReset.onclick = () => {
      valA.textContent = "42"; valB.textContent = "10";
      log.innerHTML = isKZ
        ? "Жад бастапқы күйге келтірілді: <code>num = 42, other = 10, ptr №101-ге нұсқап тұр</code>."
        : "Память сброшена к начальному состоянию: <code>num = 42, other = 10, ptr указывает на num</code>.";
    };
  }

  // --- 3. Rune & ASCII Visualizer ---
  function initRuneViz(container) {
    const el = container || document.getElementById("piscineWidgetArea");
    if (!el) return;

    el.innerHTML = `
      <div class="rune-widget">
        <div class="qw-title">🔤 Интерактивный сканер строк, байтов и рун (UTF-8 / ASCII)</div>
        <p style="font-size:13px;color:var(--muted);margin:0 0 12px">Введите любой текст (цифры, латиницу, кириллицу) и посмотрите, сколько байтов и рун он занимает:</p>
        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
          <input type="text" id="rwInput" value="Go 2026! Привет" style="padding:8px 12px;font:14px var(--mono);background:#17151c;border:1px solid var(--line);border-radius:4px;color:#fff;flex:1;min-width:200px">
          <button class="btn small on" id="rwSample">Пример: "12345"</button>
        </div>
        <div class="rw-sum" id="rwSum"></div>
        <div style="overflow-x:auto;max-width:100%">
          <table class="rw-table" id="rwTable">
            <thead><tr><th>Символ</th><th>Тип</th><th>ASCII / Rune Code</th><th>Код (Hex)</th><th>Формула (r - '0')</th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    `;

    const inp = document.getElementById("rwInput");
    const sum = document.getElementById("rwSum");
    const tbody = document.querySelector("#rwTable tbody");

    const update = () => {
      const text = (inp && inp.value != null) ? String(inp.value) : "Go 2026! Привет";
      const runes = Array.from(text);
      const byteLen = new TextEncoder().encode(text).length;

      sum.innerHTML = `
        <span>Байт: <b>${byteLen}</b> (len(s))</span>
        <span>Рун: <b>${runes.length}</b> (len([]rune(s)))</span>
        <span style="color:${byteLen === runes.length ? 'var(--ok)' : 'var(--warn)'}">${byteLen === runes.length ? '✓ Все символы 1-байтовые (ASCII)' : '⚠️ Есть многобайтовые символы (кириллица)'}</span>
      `;

      tbody.innerHTML = runes.map(ch => {
        const code = ch.codePointAt(0);
        const isDigit = ch >= '0' && ch <= '9';
        const hex = "0x" + code.toString(16).toUpperCase();
        const formula = isDigit ? `${code} - 48 = <b>${code - 48}</b> (int)` : "-";
        const type = isDigit ? "Цифра" : code < 128 ? "ASCII латиница" : "UTF-8 (2+ байта)";
        return `
          <tr>
            <td><b style="color:var(--accent-l)">'${ch}'</b></td>
            <td>${type}</td>
            <td>${code}</td>
            <td><code>${hex}</code></td>
            <td style="color:${isDigit ? 'var(--ok)' : 'var(--dim)'}">${formula}</td>
          </tr>
        `;
      }).join("");
    };

    inp.oninput = update;
    document.getElementById("rwSample").onclick = () => {
      inp.value = "12345";
      update();
    };
    update();
  }

  // --- 4. Recursion Visualizer ---
  function initRecursionViz(container) {
    const el = container || document.getElementById("piscineWidgetArea") || document.getElementById("recursionVizContainer");
    if (!el) return;

    el.innerHTML = `
      <div class="rec-widget">
        <div class="rec-title">🌲 Стек вызовов рекурсии (Факториал 4!)</div>
        <div class="rec-btns">
          <button class="btn small on" id="recStep">Следующий шаг (Шаг за шагом)</button>
          <button class="btn ghost small" id="recReset">Сброс</button>
        </div>
        <div class="rec-stack" id="recStack">
          <div class="rec-frame init">Нажмите «Следующий шаг», чтобы увидеть, как вызовы накапливаются в стеке до дна (0! = 1), а затем схлопываются обратно.</div>
        </div>
        <div class="rec-desc" id="recDesc"></div>
      </div>
    `;

    const stack = document.getElementById("recStack");
    const desc = document.getElementById("recDesc");
    let step = 0;

    const steps = [
      { text: "Шаг 1 (Погружение): Вызываем Fact(4). Чтобы посчитать 4!, надо знать 3! Запоминаем 4 * Fact(3).", html: `<div class="rec-frame f1"><b>Fact(4)</b> = 4 * Fact(3) <span class="wait">[ждёт результат Fact(3)]</span></div>` },
      { text: "Шаг 2 (Погружение): Вызываем Fact(3). Чтобы посчитать 3!, надо знать 2! Запоминаем 3 * Fact(2).", html: `<div class="rec-frame f1">Fact(4) = 4 * Fact(3)</div><div class="rec-frame f2"><b>Fact(3)</b> = 3 * Fact(2) <span class="wait">[ждёт результат Fact(2)]</span></div>` },
      { text: "Шаг 3 (Погружение): Вызываем Fact(2). Запоминаем 2 * Fact(1).", html: `<div class="rec-frame f1">Fact(4) = 4 * Fact(3)</div><div class="rec-frame f2">Fact(3) = 3 * Fact(2)</div><div class="rec-frame f3"><b>Fact(2)</b> = 2 * Fact(1) <span class="wait">[ждёт результат Fact(1)]</span></div>` },
      { text: "Шаг 4 (Погружение): Вызываем Fact(1). Запоминаем 1 * Fact(0).", html: `<div class="rec-frame f1">Fact(4) = 4 * Fact(3)</div><div class="rec-frame f2">Fact(3) = 3 * Fact(2)</div><div class="rec-frame f3">Fact(2) = 2 * Fact(1)</div><div class="rec-frame f4"><b>Fact(1)</b> = 1 * Fact(0) <span class="wait">[ждёт результат Fact(0)]</span></div>` },
      { text: "Шаг 5 (ДНО МАТРЁШКИ!): Fact(0) срабатывает базовый случай if nb == 0 { return 1 }! Никаких новых вызовов!", html: `<div class="rec-frame f1">Fact(4) = 4 * Fact(3)</div><div class="rec-frame f2">Fact(3) = 3 * Fact(2)</div><div class="rec-frame f3">Fact(2) = 2 * Fact(1)</div><div class="rec-frame f4">Fact(1) = 1 * Fact(0)</div><div class="rec-frame f0 base"><b>Fact(0) = 1</b> (БАЗОВЫЙ СЛУЧАЙ ДОСТИГНУТ ✓)</div>` },
      { text: "Шаг 6 (Всплытие): Fact(0) вернул 1. Fact(1) вычисляет 1 * 1 = 1 и завершается.", html: `<div class="rec-frame f1">Fact(4) = 4 * Fact(3)</div><div class="rec-frame f2">Fact(3) = 3 * Fact(2)</div><div class="rec-frame f3">Fact(2) = 2 * Fact(1)</div><div class="rec-frame f4 ok"><b>Fact(1) = 1</b> ✓</div>` },
      { text: "Шаг 7 (Всплытие): Fact(1) вернул 1. Fact(2) вычисляет 2 * 1 = 2 и завершается.", html: `<div class="rec-frame f1">Fact(4) = 4 * Fact(3)</div><div class="rec-frame f2">Fact(3) = 3 * Fact(2)</div><div class="rec-frame f3 ok"><b>Fact(2) = 2</b> ✓</div>` },
      { text: "Шаг 8 (Всплытие): Fact(2) вернул 2. Fact(3) вычисляет 3 * 2 = 6 и завершается.", html: `<div class="rec-frame f1">Fact(4) = 4 * Fact(3)</div><div class="rec-frame f2 ok"><b>Fact(3) = 6</b> ✓</div>` },
      { text: "Шаг 9 (ФИНАЛ): Fact(3) вернул 6. Fact(4) вычисляет 4 * 6 = 24! Исходный вызов вернул ответ 24.", html: `<div class="rec-frame f1 done"><b>Fact(4) = 24 (ИТОГОВЫЙ ОТВЕТ ✓)</b></div>` },
    ];

    document.getElementById("recStep").onclick = () => {
      if (step >= steps.length) step = 0;
      stack.innerHTML = steps[step].html;
      desc.textContent = steps[step].text;
      step++;
    };

    document.getElementById("recReset").onclick = () => {
      step = 0;
      stack.innerHTML = `<div class="rec-frame init">Нажмите «Следующий шаг», чтобы начать анимацию.</div>`;
      desc.textContent = "";
    };
  }

  // --- 5. Math & Primes Visualizer ---
  function initMathViz(container) {
    const el = container || document.getElementById("piscineWidgetArea");
    if (!el) return;

    el.innerHTML = `
      <div class="math-widget">
        <div class="qw-title">🔢 Интерактивная проверка простых чисел (Оптимизация i*i &le; N)</div>
        <div class="mw-row">
          <label style="font:500 13px var(--mono)">Число N: <input type="number" id="mwNum" value="29" min="1" max="999" style="width:70px;padding:6px 10px;background:#17151c;border:1px solid var(--line);border-radius:4px;color:#fff"></label>
          <button class="btn small on" id="mwCheck">Проверить делители</button>
          <button class="btn ghost small" id="mwNext">Найти следующее простое &rarr;</button>
        </div>
        <div class="mw-steps" id="mwSteps"></div>
      </div>
    `;

    const inp = document.getElementById("mwNum");
    const stepsEl = document.getElementById("mwSteps");

    const check = () => {
      const n = +inp.value;
      if (n <= 1) {
        stepsEl.innerHTML = `<span style="color:var(--bad)">Число ${n} &le; 1: по определению НЕ является простым.</span>`;
        return;
      }
      let log = `Проверяем N = ${n}. Корень &approx; ${Math.floor(Math.sqrt(n))}. Достаточно проверить делители от 2 до ${Math.floor(Math.sqrt(n))}:\n`;
      let prime = true;
      for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) {
          log += `&bull; ${n} % ${i} == 0 &rarr; НАЙДЕН ДЕЛИТЕЛЬ ${i}! Число составное (${n} = ${i} * ${n / i}).\n`;
          prime = false;
          break;
        } else {
          log += `&bull; ${n} % ${i} = ${n % i} != 0 (не делится)\n`;
        }
      }
      if (prime) {
        log += `&bull; Все делители до ${Math.floor(Math.sqrt(n))} проверены. ДЕЛИТЕЛЕЙ НЕТ!\n&rarr; ${n} — ПРОСТОЕ ЧИСЛО! ✓`;
      }
      stepsEl.innerHTML = `<pre style="margin:0;white-space:pre-wrap;font-family:inherit">${log}</pre>`;
    };

    document.getElementById("mwCheck").onclick = check;
    document.getElementById("mwNext").onclick = () => {
      let n = +inp.value + 1;
      const isP = x => {
        if (x <= 1) return false;
        for (let i = 2; i * i <= x; i++) if (x % i === 0) return false;
        return true;
      };
      while (!isP(n)) n++;
      inp.value = n;
      check();
    };
    check();
  }

  // --- 6. Eight Queens Chessboard Visualizer ---
  function initChessViz(container) {
    const el = container || document.getElementById("piscineWidgetArea");
    if (!el) return;

    el.innerHTML = `
      <div class="chess-widget">
        <div class="cw-header">
          <div class="cw-title">♟️ Интерактивная доска 8&times;8 (Задача о 8 ферзях)</div>
          <div class="cw-status" id="cwStatus">Ферзей на доске: 0 / 8 &middot; Кликом ставьте ферзя в клетку</div>
          <div class="cw-actions">
            <button class="btn small on" id="cwDemo">Решение 01 Edu (15863724)</button>
            <button class="btn small" id="cwAuto">▶ Рекурсивный поиск (Backtracking)</button>
            <button class="btn ghost small" id="cwClear">Очистить</button>
          </div>
        </div>
        <div class="cw-board-wrap">
          <div class="cw-board" id="cwBoard"></div>
          <div class="cw-info" id="cwInfo">
            <div class="cw-badge ok">Правило 01 Edu:</div>
            <p>Каждый ферзь находится в своём столбце (от 1 до 8 слева направо). Запись <b>15863724</b> значит: 1-я строка в столбце 1, 5-я строка в столбце 2, 8-я строка в столбце 3 и т.д.</p>
            <div class="cw-sol" id="cwSol">Текущая расстановка: <span>-</span></div>
          </div>
        </div>
      </div>
    `;

    const boardEl = document.getElementById("cwBoard");
    const statusEl = document.getElementById("cwStatus");
    const solEl = document.getElementById("cwSol");
    let queens = [-1, -1, -1, -1, -1, -1, -1, -1]; // queens[col] = row (0..7)
    let animTimer = null;

    const conflicts = () => {
      let conf = 0;
      for (let c1 = 0; c1 < 8; c1++) {
        if (queens[c1] === -1) continue;
        for (let c2 = c1 + 1; c2 < 8; c2++) {
          if (queens[c2] === -1) continue;
          if (queens[c1] === queens[c2] || Math.abs(queens[c1] - queens[c2]) === Math.abs(c1 - c2)) {
            conf++;
          }
        }
      }
      return conf;
    };

    const renderBoard = () => {
      let html = "";
      const confCount = conflicts();
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const isDark = (r + c) % 2 === 1;
          const hasQ = queens[c] === r;
          let hasConflict = false;
          if (hasQ) {
            for (let c2 = 0; c2 < 8; c2++) {
              if (c2 !== c && queens[c2] !== -1) {
                if (queens[c2] === r || Math.abs(queens[c2] - r) === Math.abs(c2 - c)) hasConflict = true;
              }
            }
          }
          html += `<div class="cw-sq ${isDark ? 'dark' : 'light'} ${hasQ ? 'has-q' : ''} ${hasConflict ? 'conflict' : ''}" data-c="${c}" data-r="${r}">
            ${hasQ ? '♛' : ''}
          </div>`;
        }
      }
      boardEl.innerHTML = html;

      const placed = queens.filter(q => q !== -1).length;
      statusEl.innerHTML = `Ферзей: <b>${placed} / 8</b> &middot; Конфликтов: <b style="color:${confCount === 0 ? 'var(--ok)' : 'var(--bad)'}">${confCount}</b>`;

      const numStr = queens.map(q => q === -1 ? '.' : (q + 1)).join("");
      solEl.innerHTML = `Текущая расстановка: <b>${numStr}</b> ${placed === 8 && confCount === 0 ? '<span style="color:var(--ok)">✓ РЕШЕНИЕ НАЙДЕНО!</span>' : ''}`;
    };

    boardEl.onclick = e => {
      const sq = e.target.closest(".cw-sq");
      if (!sq) return;
      clearInterval(animTimer);
      const c = +sq.dataset.c, r = +sq.dataset.r;
      if (queens[c] === r) queens[c] = -1;
      else queens[c] = r;
      renderBoard();
    };

    document.getElementById("cwClear").onclick = () => {
      clearInterval(animTimer);
      queens = [-1, -1, -1, -1, -1, -1, -1, -1];
      renderBoard();
    };

    document.getElementById("cwDemo").onclick = () => {
      clearInterval(animTimer);
      // 15863724 -> 0-based: 0, 4, 7, 5, 2, 6, 1, 3
      queens = [0, 4, 7, 5, 2, 6, 1, 3];
      renderBoard();
    };

    document.getElementById("cwAuto").onclick = () => {
      clearInterval(animTimer);
      queens = [-1, -1, -1, -1, -1, -1, -1, -1];
      let col = 0;
      let row = 0;

      const isSafe = (c, r) => {
        for (let prevC = 0; prevC < c; prevC++) {
          const prevR = queens[prevC];
          if (prevR === r || Math.abs(prevR - r) === Math.abs(prevC - c)) return false;
        }
        return true;
      };

      animTimer = setInterval(() => {
        if (col >= 8) {
          clearInterval(animTimer);
          return;
        }
        while (row < 8 && !isSafe(col, row)) {
          row++;
        }
        if (row < 8) {
          queens[col] = row;
          col++;
          row = 0;
          renderBoard();
        } else {
          // Backtrack
          queens[col] = -1;
          col--;
          if (col < 0) { clearInterval(animTimer); return; }
          row = queens[col] + 1;
          queens[col] = -1;
          renderBoard();
        }
      }, 180);
    };

    renderBoard();
  }

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

})();
