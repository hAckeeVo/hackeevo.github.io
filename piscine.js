// 01 Edu Piscine Go: Квесты 2, 3, 4 (Quad, Указатели, Рекурсия, Алгоритмы, 8 Ферзей).
// Подключается после more.js.

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
    // ТЕМА 19: Сетка и координаты: Quad (01 Edu)
    // ==========================================
    {
      id: 19,
      track: "piscine",
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

Попробуйте интерактивный симулятор ниже — подвигайте ползунки и кликните «Шаг за шагом»!
<div id="quadVizContainer"></div>
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
- Верхний правый угол и нижний левый угол — это обратный слэш {{"\\\\"}}.
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
            { re: /"\\\\"|"\\"/, msg: 'Печать обратного слэша: "\\\\"' },
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
      ],
    },

    // ==========================================
    // ТЕМА 20: Указатели и память: Pointers (01 Edu)
    // ==========================================
    {
      id: 20,
      track: "piscine",
      title: "Указатели и память: Pointers (01 Edu)",
      about: "что такое адреса в памяти, операторы & и *, и как передавать переменные в функции по ссылке",
      theory: R`
В 3-м квесте бассейна 01 Edu начинаются **указатели** — и это главная проверка на то, понимаете ли вы, как устроен компьютер.

Представьте память компьютера как улицу с пронумерованными домами:
- **Переменная** — это дом. У него есть **номер (адрес)**, например {{0x1004}}, и **жилец (значение)** внутри, например число {{42}}.
- **Оператор {{&}} (взятие адреса)**: {{&x}} отвечает на вопрос: «По какому адресу живёт x?».
- **Тип указателя {{*int}}**: переменная, в которую записан адрес дома, а не само число.
- **Оператор {{*}} (разыменование)**: {{*p = 100}} говорит: «Иди по адресу, который записан в p, открой дверь и посели туда 100».

**Зачем указатели функциям?**
В Go все аргументы передаются **по значению (копируются)**!
Если вы передадите в функцию число:
{{func double(n int) { n = n * 2 }}}
Создастся временная копия-двойник. Функция изменит двойника, а оригинал в {{main()}} останется нетронутым!

А если передать указатель:
{{func double(n *int) { *n = *n * 2 }}}
Функция получает настоящий адрес дома и меняет оригинал!

Попробуйте интерактивный симулятор памяти ниже:
<div id="pointerVizContainer"></div>
`,
      examples: R`
Вот классический пример обмена двух переменных через указатели:

${F}
package main

import "fmt"

func Swap(a, b *int) {
    *a, *b = *b, *a
}

func main() {
    x, y := 10, 20
    Swap(&x, &y)
    fmt.Println(x, y) // Выведет 20 10!
}
${F}
`,
      quiz: [
        {
          q: "Что вернёт выражение &a?",
          o: ["Адрес ячейки памяти, где хранится a", "Значение переменной a", "Умножит a на адрес"],
          why: "Символ & - оператор взятия адреса памяти.",
        },
        {
          q: "Что делает запись *ptr = 50?",
          o: ["Записывает 50 по адресу, хранящемуся в ptr", "Умножает ptr на 50", "Создаёт новый указатель"],
          why: "Звёздочка перед указателем разыменовывает его и обращается к значению в ячейке.",
        },
      ],
      tasks: [
        makeTask({
          id: "t47",
          title: "BasicPointer (запись 42 по адресу)",
          desc: R`Напишите функцию {{BasicPointer(n *int)}}, которая принимает указатель на целое число и записывает туда число {{42}}. В {{main}} создайте переменную {{a := 0}}, передайте её адрес {{&a}} в функцию и напечатайте {{a}}.`,
          body: [
            ["func BasicPointer(n *int) {", "Функция принимает указатель n на int."],
            ["    *n = 42", "Разыменовываем указатель и записываем 42."],
            ["}", "Конец функции."],
            ["", ""],
            ["func main() {", "Начало main."],
            ["    a := 0", "Создаём обычную переменную a."],
            ["    BasicPointer(&a)", "Передаём её адрес &a в функцию."],
            ["    fmt.Println(a)", "Печатаем 42."],
            ["}", "Конец main."],
          ],
          output: "42",
          hint: "Чтобы передать указатель в функцию, используйте знак амперсанда: &a.",
          checks: [
            { re: /func\s+BasicPointer\s*\(\s*n\s+\*int\s*\)/, msg: "func BasicPointer(n *int)" },
            { re: /\*n\s*=\s*42/, msg: "Запись по адресу: *n = 42" },
            { re: /BasicPointer\s*\(\s*&\w+\s*\)/, msg: "Передача адреса: BasicPointer(&a)" },
          ],
        }),
        makeTask({
          id: "t48",
          title: "Swap (обмен значениями)",
          desc: R`Напишите функцию {{Swap(a, b *int)}}, которая меняет местами значения двух целых чисел по их адресам.`,
          body: [
            ["func Swap(a, b *int) {", "Функция принимает два указателя на int."],
            ["    *a, *b = *b, *a", "В Go можно поменять значения в одну строчку."],
            ["}", "Конец функции Swap."],
            ["", ""],
            ["func main() {", "Начало main."],
            ["    x, y := 1, 2", "Создаём x=1 и y=2."],
            ["    Swap(&x, &y)", "Передаём адреса &x и &y."],
            ["    fmt.Println(x, y)", "Печатаем результат: 2 1."],
            ["}", "Конец main."],
          ],
          output: "2 1",
          hint: "В Go поддерживается множественное присваивание: *a, *b = *b, *a.",
          checks: [
            { re: /func\s+Swap\s*\(\s*a\s*,\s*b\s+\*int\s*\)/, msg: "func Swap(a, b *int)" },
            { re: /(\*a\s*,\s*\*b\s*=\s*\*b\s*,\s*\*a)|(tmp\s*:=\s*\*a)/, msg: "*a, *b = *b, *a" },
            { re: /Swap\s*\(\s*&\w+\s*,\s*&\w+\s*\)/, msg: "Вызов Swap(&x, &y)" },
          ],
        }),
        makeTask({
          id: "t49",
          hard: true,
          title: "DivMod (деление и остаток через указатели)",
          desc: R`Решите задачу 01 Edu {{DivMod(a int, b int, div *int, mod *int)}} самостоятельно!
Функция делит {{a}} на {{b}}, записывает результат деления по адресу {{div}}, а остаток от деления — по адресу {{mod}}.`,
          plan: [
            "Опишите функцию func DivMod(a int, b int, div *int, mod *int)",
            "Вычислите деление и запишите по адресу div: *div = a / b",
            "Вычислите остаток и запишите по адресу mod: *mod = a % b",
            "В main объявите var d, m int, вызовите DivMod(13, 4, &d, &m) и напечатайте d и m",
          ],
          output: "3 1",
          hint: "Помните про звёздочку: *div = a / b, а не div = a / b.",
          checks: [
            { re: /func\s+DivMod\s*\(\s*a\s*,\s*b\s+int\s*,\s*div\s*,\s*mod\s+\*int\s*\)/, msg: "func DivMod(a, b int, div, mod *int)" },
            { re: /\*div\s*=\s*a\s*\/\s*b/, msg: "*div = a / b" },
            { re: /\*mod\s*=\s*a\s*%\s*b/, msg: "*mod = a % b" },
            { re: /DivMod\s*\(/, msg: "Вызов DivMod в main" },
          ],
          starter: "package main\n\nimport \"fmt\"\n\n// Напишите DivMod здесь\n\nfunc main() {\n    var d, m int\n    DivMod(13, 4, &d, &m)\n    fmt.Println(d, m)\n}\n",
          solution: `package main

import "fmt"

func DivMod(a int, b int, div *int, mod *int) {
    *div = a / b
    *mod = a % b
}

func main() {
    var d, m int
    DivMod(13, 4, &d, &m)
    fmt.Println(d, m)
}
`,
        }),
      ],
    },

    // ==========================================
    // ТЕМА 21: Итерация vs Рекурсия (Piscine)
    // ==========================================
    {
      id: 21,
      track: "piscine",
      title: "Итерация vs Рекурсия: Факториал и Степень",
      about: "как перестать бояться рекурсии: базовый случай, шаг рекурсии, стек вызовов и строгое соблюдение правил 01 Edu",
      theory: R`
Квест 4 бассейна 01 Edu посвящён **рекурсии**. Новички часто впадают в ступор, потому что им говорят: «функция вызывает саму себя». Это звучит как бесконечное зеркало.

На самом деле рекурсия — это **«матрёшка»**:
1. **Базовый случай (дно матрёшки / стоп-сигнал)**: точка, где задача стала настолько простой, что ответ известен без вычислений ($0! = 1$, $x^0 = 1$). Без стоп-сигнала программа падает с переполнением стека (stack overflow).
2. **Шаг рекурсии**: вызов себя с аргументом, который **на один шаг ближе к дну** ($n \times (n-1)!$).

**Сравните:**
- Цикл (итерация): берём копилку {{res = 1}} и в цикле домножаем на 1, 2, 3...
- Рекурсия: «чтобы узнать 4!, умножь 4 на результат 3!». Вызовы накапливаются в памяти как стопка тарелок (стек), доходят до дна ($0! = 1$), а затем схлопываются обратно, перемножая числа.

**Жесткие правила 01 Edu Piscine:**
- Факториал отрицательного числа? {{nb < 0}} $\rightarrow$ строго {{return 0}}.
- Переполнение: 64-битный int вмещает факториалы только до 20! Для {{nb > 20}} $\rightarrow$ {{return 0}}.
- Степень меньше нуля? В целых числах {{power < 0}} $\rightarrow$ {{return 0}}.
- Степень ноль? {{power == 0}} $\rightarrow$ любое число в степени 0 равно {{1}}.

Попробуйте интерактивную визуализацию стека вызовов ниже:
<div id="recursionVizContainer"></div>
`,
      examples: R`
Сравнение двух подходов для вычисления факториала:

${F}
// Итеративный (цикл)
func IterativeFactorial(nb int) int {
    if nb < 0 || nb > 20 { return 0 }
    res := 1
    for i := 1; i <= nb; i++ { res *= i }
    return res
}

// Рекурсивный
func RecursiveFactorial(nb int) int {
    if nb < 0 || nb > 20 { return 0 }
    if nb == 0 { return 1 } // Базовый случай!
    return nb * RecursiveFactorial(nb - 1) // Шаг!
}
${F}
`,
      quiz: [
        {
          q: "Что произойдёт с рекурсивной функцией, если забыть базовый случай?",
          o: ["Произойдёт переполнение стека (Stack Overflow) и программа аварийно завершится", "Функция вернёт 0", "Программа выполнится быстрее"],
          why: "Без базового случая функция будет вызывать себя бесконечно, пока не исчерпает стек памяти.",
        },
        {
          q: "Что по регламенту 01 Edu должен вернуть IterativeFactorial(-5)?",
          o: ["0", "-120", "Ошибка компиляции"],
          why: "В 01 Edu для отрицательных чисел факториал считается невалидным и возвращает 0.",
        },
      ],
      tasks: [
        makeTask({
          id: "t50",
          title: "IterativeFactorial (факториал циклом)",
          desc: R`Напишите функцию {{IterativeFactorial(nb int) int}}, которая вычисляет факториал числа циклом for. Если nb < 0 или nb > 20, возвращайте 0. 0! = 1.`,
          body: [
            ["func IterativeFactorial(nb int) int {", "Функция принимает int и возвращает int."],
            ["    if nb < 0 || nb > 20 {", "Защита от отрицательных чисел и переполнения."],
            ["        return 0", "Возвращаем 0 при ошибке входа."],
            ["    }", "Конец проверки."],
            ["    res := 1", "Начальное значение (0! = 1)."],
            ["    for i := 1; i <= nb; i++ {", "Цикл от 1 до nb."],
            ["        res *= i", "Умножаем накопленный результат на i."],
            ["    }", "Конец цикла."],
            ["    return res", "Возвращаем факториал."],
            ["}", "Конец функции."],
            ["", ""],
            ["func main() {", "Начало main."],
            ["    fmt.Println(IterativeFactorial(4))", "4! = 24."],
            ["    fmt.Println(IterativeFactorial(-2))", "Для отрицательного ответ 0."],
            ["}", "Конец main."],
          ],
          output: "24\n0",
          hint: "Помните про ограничение 01 Edu: if nb < 0 || nb > 20 { return 0 }.",
          checks: [
            { re: /func\s+IterativeFactorial\s*\(\s*nb\s+int\s*\)\s*int\s*\{/, msg: "func IterativeFactorial(nb int) int {" },
            { re: /nb\s*<\s*0/, msg: "Проверка на отрицательное: nb < 0" },
            { re: /for\s+i\s*:=\s*1/, msg: "Цикл for i := 1; i <= nb; i++" },
            { re: /IterativeFactorial\s*\(\s*4\s*\)/, msg: "Вызов IterativeFactorial(4)" },
          ],
        }),
        makeTask({
          id: "t51",
          hard: true,
          title: "RecursiveFactorial (рекурсивный факториал)",
          desc: R`Решите задачу 01 Edu {{RecursiveFactorial(nb int) int}} рекурсивно, **без использования циклов for**!
Правила:
- Если nb < 0 или nb > 20 $\rightarrow$ возвращаем 0.
- Базовый случай: если nb == 0 $\rightarrow$ возвращаем 1.
- Шаг: возвращаем nb * RecursiveFactorial(nb - 1).`,
          plan: [
            "Объявите func RecursiveFactorial(nb int) int",
            "Добавьте защиту: if nb < 0 || nb > 20 { return 0 }",
            "Добавьте базовый случай: if nb == 0 { return 1 }",
            "Сделайте рекурсивный вызов: return nb * RecursiveFactorial(nb - 1)",
            "В main вызовите с 4 (ответ 24) и с 0 (ответ 1)",
          ],
          output: "24\n1",
          hint: "В этой задаче нельзя использовать for. Функция должна вызывать саму себя.",
          checks: [
            { re: /func\s+RecursiveFactorial\s*\(\s*nb\s+int\s*\)\s*int\s*\{/, msg: "func RecursiveFactorial(nb int) int {" },
            { re: /nb\s*<\s*0/, msg: "Проверка на nb < 0" },
            { re: /nb\s*==\s*0/, msg: "Базовый случай: if nb == 0 { return 1 }" },
            { re: /RecursiveFactorial\s*\(\s*nb\s*-\s*1\s*\)/, msg: "Рекурсивный вызов: RecursiveFactorial(nb - 1)" },
          ],
          starter: "package main\n\nimport \"fmt\"\n\n// Напишите RecursiveFactorial здесь\n\nfunc main() {\n    fmt.Println(RecursiveFactorial(4))\n    fmt.Println(RecursiveFactorial(0))\n}\n",
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
    fmt.Println(RecursiveFactorial(0))
}
`,
        }),
        makeTask({
          id: "t52",
          title: "IterativePower (возведение в степень циклом)",
          desc: R`Напишите функцию {{IterativePower(nb int, power int) int}}, которая возводит число nb в степень power циклом for.
Правила 01 Edu:
- Если power < 0 $\rightarrow$ возвращаем 0.
- Если power == 0 $\rightarrow$ возвращаем 1.`,
          body: [
            ["func IterativePower(nb int, power int) int {", "Функция принимает число и степень."],
            ["    if power < 0 { return 0 }", "Отрицательная степень возвращает 0."],
            ["    res := 1", "Любое число в степени 0 равно 1."],
            ["    for i := 0; i < power; i++ {", "Цикл повторяется power раз."],
            ["        res *= nb", "Умножаем результат на nb."],
            ["    }", "Конец цикла."],
            ["    return res", "Возвращаем результат."],
            ["}", "Конец функции."],
            ["", ""],
            ["func main() {", "Точка входа."],
            ["    fmt.Println(IterativePower(2, 3))", "2^3 = 8."],
            ["    fmt.Println(IterativePower(5, -1))", "Для отрицательной степени ответ 0."],
            ["}", "Конец main."],
          ],
          output: "8\n0",
          hint: "Не забудьте: при power == 0 цикл ни разу не выполнится и функция вернёт res = 1, что математически верно.",
          checks: [
            { re: /func\s+IterativePower\s*\(\s*nb\s+int\s*,\s*power\s+int\s*\)\s*int\s*\{/, msg: "func IterativePower(nb int, power int) int {" },
            { re: /power\s*<\s*0/, msg: "if power < 0 { return 0 }" },
            { re: /res\s*\*=\s*nb/, msg: "res *= nb" },
            { re: /IterativePower\s*\(\s*2\s*,\s*3\s*\)/, msg: "Вызов IterativePower(2, 3)" },
          ],
        }),
        makeTask({
          id: "t53",
          hard: true,
          title: "RecursivePower (рекурсивная степень)",
          desc: R`Решите задачу 01 Edu {{RecursivePower(nb int, power int) int}} рекурсивно без циклов for!
Правила:
- Если power < 0 $\rightarrow$ return 0.
- Базовый случай: if power == 0 $\rightarrow$ return 1.
- Шаг: return nb * RecursivePower(nb, power - 1).`,
          plan: [
            "Объявите func RecursivePower(nb int, power int) int",
            "Добавьте защиту: if power < 0 { return 0 }",
            "Добавьте базовый случай: if power == 0 { return 1 }",
            "Сделайте рекурсивный вызов: return nb * RecursivePower(nb, power - 1)",
            "В main проверьте на 2^3 (8) и 4^0 (1)",
          ],
          output: "8\n1",
          hint: "Степень уменьшается на 1 с каждым вызовом: power - 1.",
          checks: [
            { re: /func\s+RecursivePower\s*\(\s*nb\s+int\s*,\s*power\s+int\s*\)\s*int\s*\{/, msg: "func RecursivePower(nb int, power int) int {" },
            { re: /power\s*<\s*0/, msg: "if power < 0 { return 0 }" },
            { re: /power\s*==\s*0/, msg: "Базовый случай: if power == 0 { return 1 }" },
            { re: /RecursivePower\s*\(\s*nb\s*,\s*power\s*-\s*1\s*\)/, msg: "RecursivePower(nb, power - 1)" },
          ],
          starter: "package main\n\nimport \"fmt\"\n\n// Напишите RecursivePower здесь\n\nfunc main() {\n    fmt.Println(RecursivePower(2, 3))\n    fmt.Println(RecursivePower(4, 0))\n}\n",
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
    fmt.Println(RecursivePower(2, 3))
    fmt.Println(RecursivePower(4, 0))
}
`,
        }),
      ],
    },

    // ==========================================
    // ТЕМА 22: Алгоритмы: Фибоначчи, Корень и Простые числа
    // ==========================================
    {
      id: 22,
      track: "piscine",
      title: "Алгоритмы: Фибоначчи, Корень и Простые числа",
      about: "алгоритмы 4-го квеста Piscine: ветвящаяся рекурсия Фибоначчи, целочисленный квадратный корень и оптимизация простых чисел до корня из N",
      theory: R`
Здесь собраны классические задачи 01 Edu Piscine на математические алгоритмы.

### 1. Числа Фибоначчи
Ряд Фибоначчи: {{0, 1, 1, 2, 3, 5, 8, 13, 21...}}
Каждое число — сумма двух предыдущих:
{{Fibonacci(n) = Fibonacci(n-1) + Fibonacci(n-2)}}
- Базовые случаи: {{index == 0 -> 0}}, {{index == 1 -> 1}}.
- Краевое условие 01 Edu: если индекс отрицательный ({{index < 0}}), функция должна вернуть {{-1}}!

### 2. Целочисленный квадратный корень (Sqrt)
Задача: найти целое число $i$, такое что $i \times i = nb$.
Если число не является точным квадратом (например, для 5 или 15), корень не целый — возвращаем {{0}}.
Перебор: идём от $i = 1$ пока $i \times i \le nb$.

### 3. Простые числа (IsPrime и FindNextPrime)
Простое число делится без остатка только на 1 и на само себя.
- Числа $\le 1$ — НЕ простые.
- **Оптимизация**: проверять делители от 2 до $n$ — очень медленно. Достаточно проверять только до $\sqrt{n}$ (то есть {{i * i <= nb}})! Если до корня делителей нет, то и дальше их быть не может.
- Чтобы найти следующее простое (FindNextPrime): просто запускаем цикл {{for !IsPrime(nb) { nb++ }}}!
`,
      examples: R`
Проверка простоты с оптимизацией до корня из n:

${F}
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
${F}
`,
      quiz: [
        {
          q: "Почему при проверке простоты достаточно идти до i*i <= nb?",
          o: ["Если у числа есть делитель больше корня, то парный ему делитель обязательно меньше корня", "Потому что корень - самое большое число", "Это просто эмпирическое правило"],
          why: "Делители всегда ходят парами (например для 36: 2*18, 3*12, 4*9, 6*6). Если до корня пары нет, её нет и после.",
        },
        {
          q: "Что по регламенту 01 Edu должен вернуть Fibonacci(-3)?",
          o: ["-1", "0", "1"],
          why: "Для отрицательных индексов спецификация 01 Edu требует возвращать -1.",
        },
      ],
      tasks: [
        makeTask({
          id: "t54",
          title: "Fibonacci (числа Фибоначчи)",
          desc: R`Напишите функцию {{Fibonacci(index int) int}}, которая возвращает n-е число Фибоначчи. Если index < 0, возвращайте -1.`,
          body: [
            ["func Fibonacci(index int) int {", "Функция принимает индекс."],
            ["    if index < 0 { return -1 }", "Отрицательный индекс возвращает -1."],
            ["    if index == 0 { return 0 }", "Базовый случай 0."],
            ["    if index == 1 { return 1 }", "Базовый случай 1."],
            ["    return Fibonacci(index-1) + Fibonacci(index-2)", "Сумма двух предыдущих."],
            ["}", "Конец функции."],
            ["", ""],
            ["func main() {", "Начало main."],
            ["    fmt.Println(Fibonacci(4))", "Fibonacci(4) = 3."],
            ["    fmt.Println(Fibonacci(-1))", "Для -1 ответ -1."],
            ["}", "Конец main."],
          ],
          output: "3\n-1",
          hint: "Обратите внимание на два базовых случая: для 0 возвращается 0, для 1 возвращается 1.",
          checks: [
            { re: /func\s+Fibonacci\s*\(\s*index\s+int\s*\)\s*int\s*\{/, msg: "func Fibonacci(index int) int {" },
            { re: /index\s*<\s*0/, msg: "if index < 0 { return -1 }" },
            { re: /Fibonacci\s*\(\s*index\s*-\s*1\s*\)\s*\+\s*Fibonacci\s*\(\s*index\s*-\s*2\s*\)/, msg: "Fibonacci(index-1) + Fibonacci(index-2)" },
          ],
        }),
        makeTask({
          id: "t55",
          hard: true,
          title: "Sqrt (целочисленный квадратный корень)",
          desc: R`Решите задачу 01 Edu {{Sqrt(nb int) int}}!
Функция возвращает квадратный корень из nb, если он является целым числом. Если nb <= 0 или число не является точным квадратом, возвращайте 0.`,
          plan: [
            "Объявите func Sqrt(nb int) int",
            "Проверьте if nb <= 0 { return 0 }",
            "Запустите цикл for i := 1; i*i <= nb; i++",
            "Если i*i == nb, верните i",
            "Если цикл завершился и точного совпадения нет, верните 0",
          ],
          output: "4\n0",
          hint: "Для проверки квадрата используйте i*i == nb.",
          checks: [
            { re: /func\s+Sqrt\s*\(\s*nb\s+int\s*\)\s*int\s*\{/, msg: "func Sqrt(nb int) int {" },
            { re: /nb\s*<=\s*0/, msg: "if nb <= 0 { return 0 }" },
            { re: /i\s*\*\s*i\s*==\s*nb/, msg: "if i*i == nb { return i }" },
          ],
          starter: "package main\n\nimport \"fmt\"\n\n// Напишите Sqrt здесь\n\nfunc main() {\n    fmt.Println(Sqrt(16))\n    fmt.Println(Sqrt(5))\n}\n",
          solution: `package main

import "fmt"

func Sqrt(nb int) int {
    if nb <= 0 {
        return 0
    }
    for i := 1; i*i <= nb; i++ {
        if i*i == nb {
            return i
        }
    }
    return 0
}

func main() {
    fmt.Println(Sqrt(16))
    fmt.Println(Sqrt(5))
}
`,
        }),
        makeTask({
          id: "t56",
          hard: true,
          title: "IsPrime & FindNextPrime (простые числа)",
          desc: R`Напишите две функции:
1. {{IsPrime(nb int) bool}}: возвращает true, если число простое. Числа <= 1 не простые.
2. {{FindNextPrime(nb int) int}}: возвращает следующее простое число, большее или равное nb.`,
          plan: [
            "Напишите IsPrime(nb int) bool: проверка nb <= 1 -> false",
            "В цикле for i := 2; i*i <= nb; i++ проверяйте nb%i == 0",
            "Напишите FindNextPrime(nb int) int: если nb <= 2 return 2",
            "Запустите цикл for !IsPrime(nb) { nb++ } и верните nb",
            "В main протестируйте IsPrime(5), IsPrime(4) и FindNextPrime(5), FindNextPrime(14)",
          ],
          output: "true false\n5 17",
          hint: "Функция FindNextPrime может просто вызывать IsPrime внутри цикла!",
          checks: [
            { re: /func\s+IsPrime\s*\(\s*nb\s+int\s*\)\s*bool\s*\{/, msg: "func IsPrime(nb int) bool {" },
            { re: /func\s+FindNextPrime\s*\(\s*nb\s+int\s*\)\s*int\s*\{/, msg: "func FindNextPrime(nb int) int {" },
            { re: /i\s*\*\s*i\s*<=\s*nb/, msg: "Оптимизация до корня: i*i <= nb" },
            { re: /!IsPrime\s*\(\s*nb\s*\)/, msg: "Вызов IsPrime в FindNextPrime" },
          ],
          starter: `package main

import "fmt"

// Напишите IsPrime и FindNextPrime здесь

func main() {
    fmt.Println(IsPrime(5), IsPrime(4))
    fmt.Println(FindNextPrime(5), FindNextPrime(14))
}
`,
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
    fmt.Println(IsPrime(5), IsPrime(4))
    fmt.Println(FindNextPrime(5), FindNextPrime(14))
}
`,
        }),
      ],
    },

    // ==========================================
    // ТЕМА 23: Вершина Piscine: Задача о 8 ферзях (EightQueens)
    // ==========================================
    {
      id: 23,
      track: "piscine",
      title: "Вершина Piscine: Задача о 8 ферзях (EightQueens)",
      about: "самая известная сложная задача бассейна: расставить 8 ферзей на доске без взаимных атак методом поиска с возвратом (бэктрекинг)",
      theory: R`
Задача о восьми ферзях — легенда 01 Edu Piscine.

**Формулировка:**
Расставьте 8 ферзей на шахматной доске 8×8 так, чтобы ни один ферзь не бил другого (ни по горизонтали, ни по вертикали, ни по диагоналям).
Всего существует **ровно 92 решения**. Функция должна напечатать каждое решение отдельной строкой в лексикографическом порядке:
{{15863724}}
{{16837425}}
...
Каждая цифра — это позиция ферзя в соответствующей колонке (от 1 до 8).

### Как решить эту задачу не-программисту?
Если пытаться перебрать все возможные клетки в лоб ($64^8 \approx 280$ триллионов вариантов), компьютер зависнет навсегда.

Поэтому мы используем **Поиск с возвратом (Backtracking)**:
1. **Компактная доска**: массив {{var board [8]int}}.
   Индекс массива — это колонка (от 0 до 7). Значение — строка (от 0 до 7), где стоит ферзь.
   Так ферзи автоматически никогда не окажутся в одной колонке!
2. **Проверка безопасности (isSafe)**:
   Когда мы хотим поставить ферзя в колонку {{col}} на строку {{row}}, мы проверяем только уже стоящих ферзей левее (в колонках от 0 до col-1):
   - Одинаковая строка: {{prevRow == row}} $\rightarrow$ бьют!
   - Одинаковая диагональ: если разница строк равна разнице колонок ({{|prevRow - row| == |prevCol - col|}}) $\rightarrow$ бьют!
3. **Рекурсивный обход {{solve(col)}}**:
   - Если {{col == 8}}: все 8 ферзей успешно расставлены! Печатаем позиции (+1 к каждой) и переводим строку.
   - Иначе: для каждой строки от 0 до 7 проверяем, безопасна ли клетка. Если да — записываем {{board[col] = row}} и вызываем {{solve(col + 1)}}.
   - Если зашли в тупик — рекурсия сама откатывается назад (бэктрекинг) и пробует следующую строку!
`,
      examples: R`
Первое решение {{15863724}} означает:
- 1-я колонка: ферзь на 1-й строке
- 2-я колонка: ферзь на 5-й строке
- 3-я колонка: ферзь на 8-й строке
- 4-я колонка: ферзь на 6-й строке
- 5-я колонка: ферзь на 3-й строке
- 6-я колонка: ферзь на 7-й строке
- 7-я колонка: ферзь на 2-й строке
- 8-я колонка: ферзь на 4-й строке
Ни один ферзь не атакует другого!
`,
      quiz: [
        {
          q: "Почему достаточно массива из 8 чисел для представления доски 8х8?",
          o: ["Потому что в каждой колонке может стоять ровно один ферзь", "Потому что ферзи стоят только по диагонали", "Это ограничение языка Go"],
          why: "Если в одной колонке будет два ферзя, они сразу бьют друг друга. Поэтому индекс - это колонка, а число - строка.",
        },
        {
          q: "Сколько всего существует правильных решений задачи о 8 ферзях?",
          o: ["92", "64", "8"],
          why: "Существует ровно 92 уникальных расстановки 8 ферзей на доске 8х8.",
        },
      ],
      tasks: [
        makeTask({
          id: "t57",
          hard: true,
          exam: true,
          title: "EightQueens (92 решения задачи о ферзях)",
          desc: R`Напишите функцию {{EightQueens()}}, которая рекурсивно находит и печатает все 92 решения задачи о 8 ферзях в порядке возрастания. Каждое решение — отдельная строка из 8 цифр от 1 до 8. Первое решение: {{15863724}}.`,
          plan: [
            "Создайте массив var board [8]int для хранения позиций ферзей",
            "Опишите рекурсивную функцию solve(col int)",
            "Базовый случай: if col == 8 { напечатайте все цифры board[i] + 1 и fmt.Println(); return }",
            "В цикле for row := 0; row < 8; row++ проверяйте безопасность клетки относительно предыдущих колонок",
            "Клетка безопасна, если prevRow != row && |prevRow - row| != col - prevCol",
            "Если безопасна: board[col] = row и solve(col + 1)",
            "В конце функции EightQueens запустите solve(0)",
          ],
          output: "15863724\n16837425\n17468253\n...\n84136275",
          hint: "Для вычисления модуля разницы без math.Abs используйте условие: if diff < 0 { diff = -diff }.",
          checks: [
            { re: /func\s+EightQueens\s*\(\s*\)/, msg: "func EightQueens()" },
            { re: /board/i, msg: "Массив board [8]int" },
            { re: /solve\s*\(\s*(col\s*\+\s*1|\w+)\s*\)/, msg: "Рекурсивный вызов solve(col + 1)" },
            { re: /fmt\.Print/, msg: "Печать решения" },
          ],
          starter: `package main

import "fmt"

func EightQueens() {
    // Реализуйте поиск с возвратом здесь
}

func main() {
    EightQueens()
}
`,
          solution: `package main

import "fmt"

func EightQueens() {
    var board [8]int
    var solve func(col int)
    solve = func(col int) {
        if col == 8 {
            for _, row := range board {
                fmt.Print(row + 1)
            }
            fmt.Println()
            return
        }
        for row := 0; row < 8; row++ {
            safe := true
            for prevCol := 0; prevCol < col; prevCol++ {
                prevRow := board[prevCol]
                diffRow := prevRow - row
                if diffRow < 0 {
                    diffRow = -diffRow
                }
                diffCol := col - prevCol
                if prevRow == row || diffRow == diffCol {
                    safe = false
                    break
                }
            }
            if safe {
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

  // Добавляем новые темы в общий список TOPICS
  TOPICS.push(...PISCINE_TOPICS);

  // ==========================================
  // Интерактивные визуализаторы (Interactive Widgets)
  // ==========================================
  window.initPiscineWidgets = function (topicId) {
    if (topicId === 19) initQuadViz();
    if (topicId === 20) initPointerViz();
    if (topicId === 21) initRecursionViz();
  };

  // --- 1. Quad Visualizer ---
  function initQuadViz() {
    const el = document.getElementById("quadVizContainer");
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
          } else {
            if (r === 0 && c === 0) { ch = "/"; role = "corner"; }
            else if (r === 0 && c === x - 1) { ch = "\\"; role = "corner"; }
            else if (r === y - 1 && c === 0) { ch = "\\"; role = "corner"; }
            else if (r === y - 1 && c === x - 1) { ch = "/"; role = "corner"; }
            else if (r === 0 || r === y - 1 || c === 0 || c === x - 1) { ch = "*"; role = "border"; }
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
      else if (role === "border") text = `ГРАНИЦА: строка или столбец на краю -> символ '*'`;
      else text = `ВНУТРИ: не угол и не граница -> печатаем ПРОБЕЛ ' '`;

      info.innerHTML = `
        <div class="qw-badge ok">Клетка [row: ${r}, col: ${c}]</div>
        <div class="qw-desc"><b>${text}</b></div>
        <div class="qw-code">if (row == ${r} && col == ${c}) -> fmt.Print("${ch}")</div>
      `;
    };

    renderGrid();

    document.getElementById("qwX").oninput = e => { x = +e.target.value; document.getElementById("qwXval").textContent = x; renderGrid(); };
    document.getElementById("qwY").oninput = e => { y = +e.target.value; document.getElementById("qwYval").textContent = y; renderGrid(); };
    document.getElementById("qwTypeA").onclick = () => {
      type = "A";
      document.getElementById("qwTypeA").className = "btn small on";
      document.getElementById("qwTypeB").className = "btn ghost small";
      renderGrid();
    };
    document.getElementById("qwTypeB").onclick = () => {
      type = "B";
      document.getElementById("qwTypeB").className = "btn small on";
      document.getElementById("qwTypeA").className = "btn ghost small";
      renderGrid();
    };

    document.getElementById("qwGrid").addEventListener("mouseover", e => {
      const cell = e.target.closest(".qw-cell");
      if (cell) updateInfo(+cell.dataset.r, +cell.dataset.c, cell.dataset.ch, cell.dataset.role);
    });

    document.getElementById("qwPlay").onclick = () => {
      clearInterval(animId);
      let curR = 0, curC = 0;
      animId = setInterval(() => {
        renderGrid(curR, curC);
        const cell = document.querySelector(`.qw-cell[data-r="${curR}"][data-c="${curC}"]`);
        if (cell) updateInfo(curR, curC, cell.dataset.ch, cell.dataset.role);
        curC++;
        if (curC >= x) { curC = 0; curR++; }
        if (curR >= y) { clearInterval(animId); setTimeout(() => renderGrid(), 1000); }
      }, 160);
    };
  }

  // --- 2. Pointer Visualizer ---
  function initPointerViz() {
    const el = document.getElementById("pointerVizContainer");
    if (!el) return;

    el.innerHTML = `
      <div class="ptr-widget">
        <div class="ptr-title">🧠 Интерактивный симулятор оперативной памяти (RAM)</div>
        <div class="ptr-actions">
          <button class="btn small" id="ptrVal">num = 100 (копия)</button>
          <button class="btn small on" id="ptrDeref">*ptr = 777 (разыменование!)</button>
          <button class="btn ghost small" id="ptrReset">Сброс</button>
        </div>
        <div class="ptr-mem">
          <div class="ptr-cell" id="cellA">
            <span class="ptr-addr">0x20A0 (адрес num)</span>
            <div class="ptr-val" id="valA">42</div>
            <span class="ptr-name">переменная: num (int)</span>
          </div>
          <div class="ptr-arrow" id="ptrArrow">⟵ указывает на адрес 0x20A0 ──</div>
          <div class="ptr-cell" id="cellP">
            <span class="ptr-addr">0x20B8 (адрес ptr)</span>
            <div class="ptr-val ok">0x20A0</div>
            <span class="ptr-name">указатель: ptr (*int)</span>
          </div>
        </div>
        <div class="ptr-log" id="ptrLog">Нажмите кнопки выше, чтобы увидеть, как прямое изменение и изменение через *ptr влияют на одну и ту же ячейку памяти.</div>
      </div>
    `;

    const valA = document.getElementById("valA");
    const log = document.getElementById("ptrLog");

    document.getElementById("ptrVal").onclick = () => {
      valA.textContent = "100";
      valA.classList.add("flash");
      setTimeout(() => valA.classList.remove("flash"), 400);
      log.innerHTML = "Выполнилось: <code>num = 100</code>. Значение в ячейке <code>0x20A0</code> изменилось на 100. Указатель <code>ptr</code> продолжает указывать на неё же!";
    };

    document.getElementById("ptrDeref").onclick = () => {
      valA.textContent = "777";
      valA.classList.add("flash");
      setTimeout(() => valA.classList.remove("flash"), 400);
      log.innerHTML = "Выполнилось: <code>*ptr = 777</code>. Компьютер пошёл по адресу <code>0x20A0</code> и записал туда 777. Теперь и <code>num</code>, и <code>*ptr</code> равны 777!";
    };

    document.getElementById("ptrReset").onclick = () => {
      valA.textContent = "42";
      log.innerHTML = "Память сброшена к исходному состоянию: <code>num = 42</code>.";
    };
  }

  // --- 3. Recursion Visualizer ---
  function initRecursionViz() {
    const el = document.getElementById("recursionVizContainer");
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
})();
