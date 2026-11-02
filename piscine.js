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
            { re: /func\s+EightQueens\s*\(\s*\)/, msg: "func EightQueens()" },
            { re: /15863724/, msg: "Первое решение 15863724" },
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
})();
