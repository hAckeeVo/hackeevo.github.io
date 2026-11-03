// tools/piscine_quests_ext_data.js
// 01 Edu Piscine Go: Quest 02 (PrintComb), Quest 11 (Linked Lists), Quest 12 (Binary Trees), Raid 02 (Sudoku)
// Deep explanations for beginners, computer science mental models, and edge case test suites

const R = String.raw;
const F = "```";

const EXT_TOPICS_RU = [
  // ==========================================
  // ТЕМА: Quest 02 — Комбинаторика и Циклы (PrintComb & PrintNbr)
  // ==========================================
  {
    id: 26,
    piscineQuest: "Quest 02",
    widgetTitle: "Интерактивный кодовый замок (PrintComb Visualizer)",
    title: "Циклы и комбинаторика: PrintComb & PrintNbr (01 Edu Quest 02)",
    about: "вложенные циклы, генерация уникальных комбинаций цифр без сторонних библиотек и разложение чисел на цифры",
    mentorTip: "Представьте кодовый замок от велосипеда с тремя колёсиками. Чтобы комбинации не повторялись, каждое следующее колёсико всегда строго больше предыдущего: первое от 0 до 7, второе от i+1 до 8, третье от j+1 до 9.",
    theory: R`
В квесте 02 бассейна 01 Edu проверяется фундаментальное умение: как заставить компьютер перебирать варианты и генерировать комбинации по строгим правилам.

### 1. Метафора кодового замка: PrintComb
Задача {{PrintComb}} требует вывести все комбинации из 3 РАЗНЫХ цифр в порядке возрастания:
{{012, 013, 014, ... 789}}

Почему первое число 012, а последнее 789?
- Цифры строго возрастают: {{первая < вторая < третья}}.
- Первая цифра {{i}} не может быть больше 7 (иначе не останется двух больших цифр: 8 и 9).
- Вторая цифра {{j}} всегда начинается с {{i + 1}} и не может быть больше 8.
- Третья цифра {{k}} всегда начинается с {{j + 1}} и доходит до 9.

Это реализуется тремя вложенными циклами:
{{for i := '0'; i <= '7'; i++}}
{{    for j := i + 1; j <= '8'; j++}}
{{        for k := j + 1; k <= '9'; k++}}

### 2. Как вывести число без fmt.Println: PrintNbr
В реальном программировании процессор не знает, что такое «число 42». Он умеет посылать на экран только отдельные символы (байты).
Чтобы напечатать число {{42}}, его нужно разбить на цифры:
- Последняя цифра: {{42 % 10 == 2}} (остаток от деления).
- Отрезаем последнюю цифру: {{42 / 10 == 4}}.
- Превращаем цифру в символ руны: {{'0' + rune(digit)}}.
`,
    examples: R`
Пример печати пар чисел (PrintComb2):

${F}
package main

import "fmt"

func PrintComb2() {
    for a := 0; a <= 98; a++ {
        for b := a + 1; b <= 99; b++ {
            if a == 0 && b == 1 {
                fmt.Printf("%02d %02d", a, b)
            } else {
                fmt.Printf(", %02d %02d", a, b)
            }
        }
    }
    fmt.Println()
}

func main() {
    PrintComb2()
}
${F}
`,
    quiz: [
      {
        q: "Почему в задаче PrintComb внешний цикл i идёт только до '7'?",
        o: [
          "Потому что после 7 должны идти две строго большие цифры: 8 и 9 (789 — последняя комбинация)",
          "Потому что цифры 8 и 9 запрещены",
          "Это случайное ограничение"
        ],
        why: "Если i = 8, то j должно быть >= 9, а для k цифр больше 9 уже не останется."
      },
      {
        q: "Как получить символ цифры '5' из целого числа 5?",
        o: [
          "'0' + rune(5) (код символа '0' плюс смещение 5)",
          "string(5)",
          "rune('5') - 5"
        ],
        why: "В ASCII символы '0'..'9' идут подряд. '0' имеет код 48, 48 + 5 = 53 (символ '5')."
      }
    ],
    tasks: [
      {
        id: "p_print_comb",
        title: "PrintComb: комбинации из 3 уникальных цифр",
        desc: "Напишите функцию PrintComb(), которая выводит все уникальные комбинации из трёх различных цифр в возрастающем порядке через запятую и пробел: 012, 013, ... 789. После последней комбинации 789 запятая не ставится, а делается перенос строки.",
        hard: false,
        plan: [
          "1. Запустите цикл для первой цифры i от '0' до '7'",
          "2. Внутри цикл для второй цифры j от i+1 до '8'",
          "3. Внутри цикл для третьей цифры k от j+1 до '9'",
          "4. Выведите символы i, j, k",
          "5. Если комбинация не последняя (не 789), напечатайте ', '; в конце напечатайте перенос строки"
        ],
        output: "012, 013, 014, ... 789",
        lines: [
          ["package main", "Каркас."],
          ["", ""],
          ['import "fmt"', "Пакет fmt."],
          ["", ""],
          ["func PrintComb() {", "Функция вывода комбинаций."],
          ["    for i := '0'; i <= '7'; i++ {", "Первая цифра: от '0' до '7'."],
          ["        for j := i + 1; j <= '8'; j++ {", "Вторая цифра: строго больше первой."],
          ["            for k := j + 1; k <= '9'; k++ {", "Третья цифра: строго больше второй."],
          ['                fmt.Printf("%c%c%c", i, j, k)', "Печатаем три символа цифр подряд."],
          ["                if !(i == '7' && j == '8' && k == '9') {", "Если это не последняя комбинация."],
          ['                    fmt.Print(", ")', "Ставим запятую с пробелом."],
          ["                }", "Конец if."],
          ["            }", "Конец k."],
          ["        }", "Конец j."],
          ["    }", "Конец i."],
          ["    fmt.Println()", "Завершающий перенос строки."],
          ["}", "Конец PrintComb."],
          ["", ""],
          ["func main() {", "Точка входа."],
          ["    PrintComb()", "Вызываем PrintComb."],
          ["}", "Конец main."]
        ],
        hint: "Главный секрет: начинайте j с i + 1, а k с j + 1. Тогда все цифры гарантированно будут разными и строго возрастающими.",
        checks: [
          { re: /func\s+PrintComb\s*\(\s*\)/, msg: "Объявите func PrintComb()" },
          { re: /'7'|7/, msg: "Первый цикл ограничен цифрой 7" },
          { re: /'8'|8/, msg: "Второй цикл ограничен цифрой 8" },
          { re: /'9'|9/, msg: "Третий цикл ограничен цифрой 9" }
        ],
        starter: "package main\n\nimport \"fmt\"\n\n// Напишите PrintComb()\n\nfunc main() {\n    PrintComb()\n}\n",
        solution: "package main\n\nimport \"fmt\"\n\nfunc PrintComb() {\n    for i := '0'; i <= '7'; i++ {\n        for j := i + 1; j <= '8'; j++ {\n            for k := j + 1; k <= '9'; k++ {\n                fmt.Printf(\"%c%c%c\", i, j, k)\n                if !(i == '7' && j == '8' && k == '9') {\n                    fmt.Print(\", \")\n                }\n            }\n        }\n    }\n    fmt.Println()\n}\n\nfunc main() {\n    PrintComb()\n}\n"
      },
      {
        id: "p_print_nbr",
        title: "PrintNbr: печать любого числа через руны и рекурсию",
        desc: "Напишите функцию PrintNbr(n int), которая печатает целое число в консоль, используя только посимвольный вывод fmt.Print(rune). Функция обязана корректно обрабатывать отрицательные числа, ноль и большие числа.",
        hard: true,
        plan: [
          "1. Если n == 0, напечатайте символ '0' и выйдите",
          "2. Если n < 0, напечатайте '-' и смените знак n = -n",
          "3. Если n >= 10, рекурсивно вызовите PrintNbr(n / 10)",
          "4. Напечатайте последнюю цифру: fmt.Printf(\"%c\", '0'+rune(n%10))"
        ],
        output: "-42\n1337\n0",
        lines: [
          ["package main", "Каркас."],
          ["", ""],
          ['import "fmt"', "Пакет fmt."],
          ["", ""],
          ["func PrintNbr(n int) {", "Функция посимвольного вывода числа."],
          ["    if n == 0 {", "Edge case: ноль."],
          ['        fmt.Print("0")', "Печатаем ноль."],
          ["        return", "Выходим."],
          ["    }", "Конец проверки нуля."],
          ["    if n < 0 {", "Edge case: отрицательное число."],
          ['        fmt.Print("-")', "Печатаем знак минус."],
          ["        n = -n", "Делаем число положительным."],
          ["    }", "Конец проверки знака."],
          ["    if n >= 10 {", "Рекурсивный шаг: если есть старшие разряды."],
          ["        PrintNbr(n / 10)", "Сначала печатаем старшие цифры."],
          ["    }", "Конец рекурсии."],
          ['    fmt.Printf("%c", \'0\'+rune(n%10))', "Печатаем текущую цифру как ASCII-символ."],
          ["}", "Конец PrintNbr."],
          ["", ""],
          ["func main() {", "Точка входа."],
          ["    PrintNbr(-42)", "Печатаем -42."],
          ["    fmt.Println()", "Перенос."],
          ["    PrintNbr(1337)", "Печатаем 1337."],
          ["    fmt.Println()", "Перенос."],
          ["}", "Конец main."]
        ],
        hint: "Рекурсивный вызов PrintNbr(n / 10) гарантирует, что цифры напечатаются в правильном порядке — слева направо!",
        checks: [
          { re: /func\s+PrintNbr\s*\(\s*\w+\s+int\s*\)/, msg: "Объявите func PrintNbr(n int)" },
          { re: /PrintNbr\s*\(\s*\w+\s*\/\s*10\s*\)/, msg: "Используйте рекурсивный вызов n / 10" },
          { re: /'0'/, msg: "Используйте символ '0' для преобразования цифры в руну" }
        ],
        starter: "package main\n\nimport \"fmt\"\n\n// Напишите PrintNbr(n int)\n\nfunc main() {\n    PrintNbr(-42)\n    fmt.Println()\n    PrintNbr(1337)\n    fmt.Println()\n}\n",
        solution: "package main\n\nimport \"fmt\"\n\nfunc PrintNbr(n int) {\n    if n == 0 {\n        fmt.Print(\"0\")\n        return\n    }\n    if n < 0 {\n        fmt.Print(\"-\")\n        n = -n\n    }\n    if n >= 10 {\n        PrintNbr(n / 10)\n    }\n    fmt.Printf(\"%c\", '0'+rune(n%10))\n}\n\nfunc main() {\n    PrintNbr(-42)\n    fmt.Println()\n    PrintNbr(1337)\n    fmt.Println()\n}\n"
      }
    ]
  },

  // ==========================================
  // ТЕМА: Quest 11 — Связные списки (Linked Lists)
  // ==========================================
  {
    id: 27,
    piscineQuest: "Quest 11",
    widgetTitle: "Интерактивный поезд связного списка (Linked List Train)",
    title: "Связные списки: указатели и цепочки Node (01 Edu Quest 11)",
    about: "динамические структуры данных, узлы Node, указатели Next, добавление в хвост/голову и разворот списка",
    mentorTip: "Представьте поезд: каждый вагон (Node) держит полезный груз (Data) и сцепку со следующим вагоном (указатель Next). Если сцепка nil — это последний вагон. Вставить новый вагон в начало или конец можно мгновенно, просто переставив одну сцепку!",
    theory: R`
В квесте 11 студенты знакомятся с классической структурой Computer Science — **односвязным списком (Singly Linked List)**.

### 1. Почему массивов и срезов недостаточно?
В обычном срезе {{[]int}} все элементы лежат в памяти строго вплотную друг к другу. Чтобы вставить элемент в начало массива, процессору приходится сдвигать миллион других элементов вправо ($O(N)$).
В связном списке узлы могут быть разбросаны в любых уголках оперативной памяти!

### 2. Структура узла Node
Каждый узел описывается структурой:
${F}
type Node struct {
    Data interface{} // любые данные (число, строка)
    Next *Node       // указатель на следующий вагон в памяти
}
type List struct {
    Head *Node       // локомотив: указатель на первый вагон
    Tail *Node       // указатель на последний вагон
}
${F}

- Если список пуст: {{Head == nil}}.
- Последний элемент всегда имеет: {{Next == nil}}.
- Чтобы обойти весь список, используем цикл:
{{for it := l.Head; it != nil; it = it.Next}}
`,
    examples: R`
Пример связывания трёх узлов вручную:

${F}
package main

import "fmt"

type Node struct {
    Data string
    Next *Node
}

func main() {
    c := &Node{Data: "Вагон 3", Next: nil}
    b := &Node{Data: "Вагон 2", Next: c}
    a := &Node{Data: "Локомотив 1", Next: b}

    // Идём по цепочке указателей
    for cur := a; cur != nil; cur = cur.Next {
        fmt.Println(cur.Data)
    }
}
${F}
`,
    quiz: [
      {
        q: "Как определить, что мы дошли до последнего узла связного списка?",
        o: [
          "У последнего узла поле Next равно nil",
          "У последнего узла поле Data равно 0",
          "Вызывается ошибка компиляции"
        ],
        why: "Сцепка последнего узла никуда не ведет, поэтому pointer Next равен nil."
      },
      {
        q: "Какова временная сложность добавления нового узла в начало списка (ListPushFront)?",
        o: [
          "O(1) (мгновенно, нужно просто обновить указатель Head)",
          "O(N) (нужно скопировать весь список)",
          "O(log N)"
        ],
        why: "Вставка в голову требует лишь привязать newNode.Next = l.Head и l.Head = newNode, без сдвига остальных элементов."
      }
    ],
    tasks: [
      {
        id: "p_list_push_back",
        title: "ListPushBack: добавление узла в конец списка",
        desc: "Опишите структуры NodeL и List. Напишите функцию ListPushBack(l *List, data interface{}), которая создает новый узел с данными data и прикрепляет его в конец связного списка l. Обновите указатели Head и Tail.",
        hard: false,
        plan: [
          "1. Создайте новый узел: node := &NodeL{Data: data, Next: nil}",
          "2. Если список пуст (l.Head == nil), установите l.Head = node и l.Tail = node",
          "3. Иначе: привяжите текущий хвост l.Tail.Next = node и обновите l.Tail = node"
        ],
        output: "Hello -> 42 -> Go",
        lines: [
          ["package main", "Каркас."],
          ["", ""],
          ['import "fmt"', "Пакет fmt."],
          ["", ""],
          ["type NodeL struct {", "Структура узла списка."],
          ["    Data interface{}", "Полезные данные любого типа."],
          ["    Next *NodeL", "Указатель на следующий узел."],
          ["}", "Конец NodeL."],
          ["", ""],
          ["type List struct {", "Структура заголовка списка."],
          ["    Head *NodeL", "Указатель на первый элемент."],
          ["    Tail *NodeL", "Указатель на последний элемент."],
          ["}", "Конец List."],
          ["", ""],
          ["func ListPushBack(l *List, data interface{}) {", "Функция вставки в хвост."],
          ["    node := &NodeL{Data: data, Next: nil}", "Создаём новый узел."],
          ["    if l.Head == nil {", "Если поезд был пуст."],
          ["        l.Head = node", "Новый узел становится головой."],
          ["        l.Tail = node", "И хвостом."],
          ["    } else {", "Если в поезде уже есть вагоны."],
          ["        l.Tail.Next = node", "Прицепляем новый узел к старому хвосту."],
          ["        l.Tail = node", "Передвигаем метку хвоста на новый узел."],
          ["    }", "Конец if."],
          ["}", "Конец ListPushBack."],
          ["", ""],
          ["func main() {", "Точка входа."],
          ["    link := &List{}", "Создаём пустой список."],
          ['    ListPushBack(link, "Hello")', "Добавляем 1-й элемент."],
          ["    ListPushBack(link, 42)", "Добавляем 2-й элемент."],
          ['    ListPushBack(link, "Go")', "Добавляем 3-й элемент."],
          ["    for it := link.Head; it != nil; it = it.Next {", "Обходим список."],
          ['        fmt.Print(it.Data, " ")', "Печатаем данные."],
          ["    }", "Конец цикла."],
          ["    fmt.Println()", "Перенос."],
          ["}", "Конец main."]
        ],
        hint: "Не забывайте проверить случай пустого списка l.Head == nil — в этом случае новый узел одновременно является и Head, и Tail.",
        checks: [
          { re: /type\s+NodeL\s+struct/, msg: "Объявите type NodeL struct" },
          { re: /type\s+List\s+struct/, msg: "Объявите type List struct" },
          { re: /func\s+ListPushBack\s*\(\s*\w+\s+\*List\s*,\s*\w+\s+interface\{\}\s*\)/, msg: "Объявите func ListPushBack(l *List, data interface{})" }
        ],
        starter: "package main\n\nimport \"fmt\"\n\n// Объявите NodeL, List и ListPushBack\n\nfunc main() {\n    link := &List{}\n    ListPushBack(link, \"Hello\")\n    ListPushBack(link, 42)\n    for it := link.Head; it != nil; it = it.Next {\n        fmt.Print(it.Data, \" \")\n    }\n    fmt.Println()\n}\n",
        solution: "package main\n\nimport \"fmt\"\n\ntype NodeL struct {\n    Data interface{}\n    Next *NodeL\n}\n\ntype List struct {\n    Head *NodeL\n    Tail *NodeL\n}\n\nfunc ListPushBack(l *List, data interface{}) {\n    node := &NodeL{Data: data, Next: nil}\n    if l.Head == nil {\n        l.Head = node\n        l.Tail = node\n    } else {\n        l.Tail.Next = node\n        l.Tail = node\n    }\n}\n\nfunc main() {\n    link := &List{}\n    ListPushBack(link, \"Hello\")\n    ListPushBack(link, 42)\n    for it := link.Head; it != nil; it = it.Next {\n        fmt.Print(it.Data, \" \")\n    }\n    fmt.Println()\n}\n"
      },
      {
        id: "p_list_size",
        title: "ListSize: подсчёт длины связного списка",
        desc: "Напишите функцию ListSize(l *List) int, которая проходит по связному списку от Head до конца (пока Next != nil) и возвращает общее количество узлов.",
        hard: false,
        plan: [
          "1. Заведите счётчик count := 0",
          "2. Запустите цикл for cur := l.Head; cur != nil; cur = cur.Next",
          "3. На каждой итерации увеличивайте count++",
          "4. Верните count"
        ],
        output: "3\n0",
        lines: [
          ["package main", "Каркас."],
          ["", ""],
          ['import "fmt"', "Пакет fmt."],
          ["", ""],
          ["type NodeL struct {", "Узел."],
          ["    Data interface{}", "Данные."],
          ["    Next *NodeL", "Указатель."],
          ["}", "Конец."],
          ["", ""],
          ["type List struct {", "Список."],
          ["    Head *NodeL", "Голова."],
          ["    Tail *NodeL", "Хвост."],
          ["}", "Конец."],
          ["", ""],
          ["func ListSize(l *List) int {", "Функция подсчёта размера списка."],
          ["    count := 0", "Счётчик узлов."],
          ["    for cur := l.Head; cur != nil; cur = cur.Next {", "Проходим по всем сцепкам Next."],
          ["        count++", "Считаем узел."],
          ["    }", "Конец обхода."],
          ["    return count", "Возвращаем длину списка."],
          ["}", "Конец ListSize."],
          ["", ""],
          ["func main() {", "Точка входа."],
          ["    c := &NodeL{Data: 3, Next: nil}", "Узел 3."],
          ["    b := &NodeL{Data: 2, Next: c}", "Узел 2."],
          ["    a := &NodeL{Data: 1, Next: b}", "Узел 1."],
          ["    l := &List{Head: a, Tail: c}", "Список из 3 элементов."],
          ["    fmt.Println(ListSize(l))", "Выведет 3."],
          ["    fmt.Println(ListSize(&List{}))", "Пустой список: выведет 0."],
          ["}", "Конец main."]
        ],
        hint: "Если список пуст (l.Head == nil), цикл ни разу не выполнится и функция корректно вернет 0.",
        checks: [
          { re: /func\s+ListSize\s*\(\s*\w+\s+\*List\s*\)\s*int/, msg: "Объявите func ListSize(l *List) int" },
          { re: /cur\s*=\s*cur\.Next|it\s*=\s*it\.Next/, msg: "Переходите к следующему узлу через .Next" }
        ],
        starter: "package main\n\nimport \"fmt\"\n\n// Напишите ListSize(l *List) int\n\nfunc main() {\n    l := &List{}\n    fmt.Println(ListSize(l))\n}\n",
        solution: "package main\n\nimport \"fmt\"\n\ntype NodeL struct {\n    Data interface{}\n    Next *NodeL\n}\n\ntype List struct {\n    Head *NodeL\n    Tail *NodeL\n}\n\nfunc ListSize(l *List) int {\n    count := 0\n    for cur := l.Head; cur != nil; cur = cur.Next {\n        count++\n    }\n    return count\n}\n\nfunc main() {\n    c := &NodeL{Data: 3, Next: nil}\n    b := &NodeL{Data: 2, Next: c}\n    a := &NodeL{Data: 1, Next: b}\n    l := &List{Head: a, Tail: c}\n    fmt.Println(ListSize(l))\n    fmt.Println(ListSize(&List{}))\n}\n"
      }
    ]
  },

  // ==========================================
  // ТЕМА: Quest 12 — Двоичные деревья поиска (Binary Search Trees)
  // ==========================================
  {
    id: 28,
    piscineQuest: "Quest 12",
    widgetTitle: "Интерактивное двоичное дерево (BST Visualizer)",
    title: "Двоичные деревья поиска: BST и обход узлов (01 Edu Quest 12)",
    about: "древовидные структуры данных, корень Root, ветви Left/Right, быстрый поиск O(log N) и симметричный обход Inorder",
    mentorTip: "Представьте картотеку библиотеки: корень наверху. Если число меньше текущего — идем в левый шкаф (Left), если больше — в правый (Right). Дерево позволяет найти любое число среди миллиона всего за 20 шагов!",
    theory: R`
Квест 12 знакомит с одной из самых мощных структур данных в информатике — **Двоичным деревом поиска (Binary Search Tree / BST)**.

### 1. Архитектура дерева
Каждый узел дерева содержит данные и две ссылки:
${F}
type TreeNode struct {
    Data   string
    Left   *TreeNode // всё, что меньше Data
    Right  *TreeNode // всё, что больше Data
    Parent *TreeNode
}
${F}

### 2. Главное правило BST:
Для любого узла {{X}}:
- Все элементы в его левом поддереве {{Left}} **строго меньше** {{X.Data}}.
- Все элементы в его правом поддереве {{Right}} **строго больше** {{X.Data}}.

### 3. Симметричный обход (Inorder Traversal)
Самая элегантная операция с BST:
1. Рекурсивно обойти левое поддерево: {{Inorder(root.Left)}}.
2. Обработать текущий узел: {{fmt.Println(root.Data)}}.
3. Рекурсивно обойти правое поддерево: {{Inorder(root.Right)}}.

Магия: такой обход автоматически печатает все элементы дерева в **идеально отсортированном порядке**!
`,
    examples: R`
Пример вставки и поиска в дереве:

${F}
package main

import "fmt"

type TreeNode struct {
    Data  int
    Left  *TreeNode
    Right *TreeNode
}

func Insert(root *TreeNode, data int) *TreeNode {
    if root == nil {
        return &TreeNode{Data: data}
    }
    if data < root.Data {
        root.Left = Insert(root.Left, data)
    } else {
        root.Right = Insert(root.Right, data)
    }
    return root
}

func main() {
    var root *TreeNode
    root = Insert(root, 4)
    root = Insert(root, 2)
    root = Insert(root, 6)
    fmt.Println("Корень:", root.Data)
    fmt.Println("Левый потомок:", root.Left.Data)
    fmt.Println("Правый потомок:", root.Right.Data)
}
${F}
`,
    quiz: [
      {
        q: "В какую ветку BST пойдет число 3, если в текущем узле находится число 5?",
        o: [
          "В левую ветку (Left), так как 3 < 5",
          "В правую ветку (Right)",
          "В корень (Root)"
        ],
        why: "В двоичном дереве поиска меньшие элементы всегда направляются в левое поддерево."
      },
      {
        q: "Что делает обход Inorder (Левый -> Корень -> Правый) над деревом поиска?",
        o: [
          "Выводит элементы в отсортированном порядке по возрастанию",
          "Удаляет все листья дерева",
          "Инвертирует дерево"
        ],
        why: "Сначала обходятся все меньшие элементы слева, затем текущий, затем большие справа — в итоге получается естественная сортировка."
      }
    ],
    tasks: [
      {
        id: "p_btree_insert",
        title: "BTreeInsertData: добавление данных в дерево поиска",
        desc: "Опишите структуру TreeNode. Напишите функцию BTreeInsertData(root *TreeNode, data string) *TreeNode, которая вставляет значение data в дерево поиска согласно правилу BST (меньшие влево, большие вправо) и возвращает указатель на корень дерева.",
        hard: false,
        plan: [
          "1. Если root == nil, создайте и верните новый узел &TreeNode{Data: data}",
          "2. Если data < root.Data, установите root.Left = BTreeInsertData(root.Left, data)",
          "3. Иначе: установите root.Right = BTreeInsertData(root.Right, data)",
          "4. Верните root"
        ],
        output: "Root: 4, Left: 2, Right: 6",
        lines: [
          ["package main", "Каркас."],
          ["", ""],
          ['import "fmt"', "Пакет fmt."],
          ["", ""],
          ["type TreeNode struct {", "Структура узла дерева."],
          ["    Data  string", "Данные узла."],
          ["    Left  *TreeNode", "Левый потомок."],
          ["    Right *TreeNode", "Правый потомок."],
          ["}", "Конец структуры."],
          ["", ""],
          ["func BTreeInsertData(root *TreeNode, data string) *TreeNode {", "Функция вставки в BST."],
          ["    if root == nil {", "Если ветка пуста, сажаем новый узел."],
          ["        return &TreeNode{Data: data}", "Возвращаем созданный узел."],
          ["    }", "Конец проверки."],
          ["    if data < root.Data {", "Если значение меньше текущего корня."],
          ["        root.Left = BTreeInsertData(root.Left, data)", "Идём в левую ветку."],
          ["    } else {", "Если значение больше или равно."],
          ["        root.Right = BTreeInsertData(root.Right, data)", "Идём в правую ветку."],
          ["    }", "Конец сравнения."],
          ["    return root", "Возвращаем неизменный корень."],
          ["}", "Конец BTreeInsertData."],
          ["", ""],
          ["func main() {", "Точка входа."],
          ["    var root *TreeNode", "Изначально дерево пустое."],
          ['    root = BTreeInsertData(root, "4")', "Корень."],
          ['    root = BTreeInsertData(root, "2")', "Левый потомок."],
          ['    root = BTreeInsertData(root, "6")', "Правый потомок."],
          ['    fmt.Printf("Root: %s, Left: %s, Right: %s\\n", root.Data, root.Left.Data, root.Right.Data)', "Проверяем структуру."],
          ["}", "Конец main."]
        ],
        hint: "Рекурсивная вставка проста: корень перенаправляет вставку влево или вправо, пока не встретит nil.",
        checks: [
          { re: /type\s+TreeNode\s+struct/, msg: "Объявите type TreeNode struct" },
          { re: /func\s+BTreeInsertData\s*\(\s*\w+\s+\*TreeNode\s*,\s*\w+\s+string\s*\)\s*\*TreeNode/, msg: "Объявите func BTreeInsertData(root *TreeNode, data string) *TreeNode" },
          { re: /root\.Left\s*=|root\.Right\s*=/, msg: "Привязывайте потомков к root.Left и root.Right" }
        ],
        starter: "package main\n\nimport \"fmt\"\n\n// Объявите TreeNode и BTreeInsertData\n\nfunc main() {\n    var root *TreeNode\n    root = BTreeInsertData(root, \"4\")\n    root = BTreeInsertData(root, \"2\")\n    root = BTreeInsertData(root, \"6\")\n    fmt.Printf(\"Root: %s, Left: %s, Right: %s\\n\", root.Data, root.Left.Data, root.Right.Data)\n}\n",
        solution: "package main\n\nimport \"fmt\"\n\ntype TreeNode struct {\n    Data  string\n    Left  *TreeNode\n    Right *TreeNode\n}\n\nfunc BTreeInsertData(root *TreeNode, data string) *TreeNode {\n    if root == nil {\n        return &TreeNode{Data: data}\n    }\n    if data < root.Data {\n        root.Left = BTreeInsertData(root.Left, data)\n    } else {\n        root.Right = BTreeInsertData(root.Right, data)\n    }\n    return root\n}\n\nfunc main() {\n    var root *TreeNode\n    root = BTreeInsertData(root, \"4\")\n    root = BTreeInsertData(root, \"2\")\n    root = BTreeInsertData(root, \"6\")\n    fmt.Printf(\"Root: %s, Left: %s, Right: %s\\n\", root.Data, root.Left.Data, root.Right.Data)\n}\n"
      },
      {
        id: "p_btree_inorder",
        title: "BTreeApplyInorder: симметричный обход и автоматическая сортировка",
        desc: "Напишите функцию BTreeApplyInorder(root *TreeNode, f func(...string)), которая рекурсивно обходит дерево в порядке Inorder (левое поддерево -> корень -> правое поддерево) и применяет функцию f к значению Data каждого узла.",
        hard: false,
        plan: [
          "1. Проверьте: если root == nil, сразу вернитесь (выход из рекурсии)",
          "2. Рекурсивно вызовите BTreeApplyInorder(root.Left, f)",
          "3. Вызовите функцию f(root.Data)",
          "4. Рекурсивно вызовите BTreeApplyInorder(root.Right, f)"
        ],
        output: "1 2 3 4 5",
        lines: [
          ["package main", "Каркас."],
          ["", ""],
          ['import "fmt"', "Пакет fmt."],
          ["", ""],
          ["type TreeNode struct {", "Узел."],
          ["    Data  string", "Данные."],
          ["    Left  *TreeNode", "Левый."],
          ["    Right *TreeNode", "Правый."],
          ["}", "Конец."],
          ["", ""],
          ["func BTreeApplyInorder(root *TreeNode, f func(...string)) {", "Функция обхода Inorder."],
          ["    if root == nil {", "Базовый случай рекурсии: дошли до пустоты."],
          ["        return", "Возвращаемся."],
          ["    }", "Конец проверки."],
          ["    BTreeApplyInorder(root.Left, f)", "Шаг 1: сначала обходим всё меньшее слева."],
          ["    f(root.Data)", "Шаг 2: обрабатываем текущий узел."],
          ["    BTreeApplyInorder(root.Right, f)", "Шаг 3: затем обходим всё большее справа."],
          ["}", "Конец BTreeApplyInorder."],
          ["", ""],
          ["func main() {", "Точка входа."],
          ["    root := &TreeNode{Data: \"3\"}", "Корень."],
          ["    root.Left = &TreeNode{Data: \"1\"}", "Слева 1."],
          ["    root.Left.Right = &TreeNode{Data: \"2\"}", "Между 1 и 3."],
          ["    root.Right = &TreeNode{Data: \"5\"}", "Справа 5."],
          ["    root.Right.Left = &TreeNode{Data: \"4\"}", "Между 3 и 5."],
          ["    BTreeApplyInorder(root, fmt.Print)", "Печатаем отсортированное дерево."],
          ["    fmt.Println()", "Перенос."],
          ["}", "Конец main."]
        ],
        hint: "Порядок строк в теле функции критичен: сначала Left, потом текущий узел, потом Right.",
        checks: [
          { re: /func\s+BTreeApplyInorder/, msg: "Объявите func BTreeApplyInorder" },
          { re: /BTreeApplyInorder\s*\(\s*\w+\.Left/, msg: "Рекурсивно обходите root.Left" },
          { re: /BTreeApplyInorder\s*\(\s*\w+\.Right/, msg: "Рекурсивно обходите root.Right" }
        ],
        starter: "package main\n\nimport \"fmt\"\n\n// Напишите BTreeApplyInorder\n\nfunc main() {\n    // Проверка обхода Inorder\n}\n",
        solution: "package main\n\nimport \"fmt\"\n\ntype TreeNode struct {\n    Data  string\n    Left  *TreeNode\n    Right *TreeNode\n}\n\nfunc BTreeApplyInorder(root *TreeNode, f func(...string)) {\n    if root == nil {\n        return\n    }\n    BTreeApplyInorder(root.Left, f)\n    f(root.Data)\n    BTreeApplyInorder(root.Right, f)\n}\n\nfunc main() {\n    root := &TreeNode{Data: \"3\"}\n    root.Left = &TreeNode{Data: \"1\"}\n    root.Left.Right = &TreeNode{Data: \"2\"}\n    root.Right = &TreeNode{Data: \"5\"}\n    BTreeApplyInorder(root, fmt.Print)\n    fmt.Println()\n}\n"
      }
    ]
  },

  // ==========================================
  // ТЕМА: Raid 02 — Решатель Судоку (Sudoku Solver & Backtracking)
  // ==========================================
  {
    id: 29,
    piscineQuest: "Raid 02",
    widgetTitle: "Интерактивная доска Судоку (Sudoku Solver & Backtracking)",
    title: "Судоку Солвер: Рекурсивный поиск с возвратом (01 Edu Raid 02)",
    about: "легендарный рейд 01 Edu, рекурсивный алгоритм Backtracking, валидация строки, столбца и квадрата 3х3",
    mentorTip: "Backtracking — это выход из лабиринта: ставим пробную цифру от 1 до 9. Если правила судоку не нарушены — идем в следующую клетку. Если зашли в тупик — возвращаемся назад, стираем цифру и пробуем следующую!",
    theory: R`
**Raid 02 (Судоку)** — командный рейд бассейна 01 Edu, где студенты решают доску $9 \times 9$ с помощью алгоритма поиска с возвратом (**Backtracking**).

### 1. Три правила валидности Судоку
В клетку {{(row, col)}} можно поставить цифру {{d}}, если:
1. Цифры {{d}} ещё нет в текущей строке: {{for c := 0; c < 9; c++ { if board[row][c] == d return false }}}.
2. Цифры {{d}} ещё нет в текущем столбце: {{for r := 0; r < 9; r++ { if board[r][col] == d return false }}}.
3. Цифры {{d}} нет в малом квадрате $3 \times 3$. Координаты левого верхнего угла квадрата вычисляются целочисленным делением:
{{startRow := (row / 3) * 3}}, {{startCol := (col / 3) * 3}}.

### 2. Сила Backtracking
Вместо перебора $9^{81}$ вариантов алгоритм отсекает неверные ветви за доли миллисекунды. Если для клетки не подошла ни одна цифра от 1 до 9, функция возвращает {{false}}, предыдущий вызов стирает свою цифру (ставит обратно точку {{'.'}}) и пробует другое число.
`,
    examples: R`
Пример проверки валидности цифры в судоку:

${F}
package main

import "fmt"

func isValid(board [][]rune, r, c int, ch rune) bool {
    for i := 0; i < 9; i++ {
        if board[r][i] == ch || board[i][c] == ch {
            return false
        }
        if board[3*(r/3)+i/3][3*(c/3)+i%3] == ch {
            return false
        }
    }
    return true
}

func main() {
    fmt.Println("Проверка клетки готова к решению!")
}
${F}
`,
    quiz: [
      {
        q: "Как вычислить начальные координаты строки и столбца малого квадрата 3х3 для клетки (5, 7)?",
        o: [
          "startRow = (5 / 3) * 3 = 3, startCol = (7 / 3) * 3 = 6",
          "startRow = 5, startCol = 7",
          "startRow = 0, startCol = 0"
        ],
        why: "Целочисленное деление на 3 отбрасывает остаток, определяя блок: 5/3=1 (блок 3..5), 7/3=2 (блок 6..8)."
      },
      {
        q: "Что делает функция решения судоку, если для текущей пустой клетки ни одна цифра 1..9 не подошла?",
        o: [
          "Очищает клетку (ставит '.') и возвращает false, откатывая рекурсию назад (Backtrack)",
          "Завершает программу с паникой",
          "Ставит цифру 0"
        ],
        why: "Это ключевой принцип Backtracking: признать тупик, откатить ход и попробовать другую цифру на предыдущем шаге."
      }
    ],
    tasks: [
      {
        id: "p_sudoku_valid",
        title: "SudokuValidator: проверка строки, столбца и квадрата 3х3",
        desc: "Напишите функцию IsValidSudokuMove(board [9][9]rune, row, col int, ch rune) bool, которая проверяет, можно ли поставить символ ch ('1'..'9') в клетку (row, col) без нарушения правил судоку.",
        hard: false,
        plan: [
          "1. Проверьте строку: ни в одной ячейке board[row][c] не должно быть ch",
          "2. Проверьте столбец: ни в одной ячейке board[r][col] не должно быть ch",
          "3. Вычислите углы квадрата: startR := (row / 3) * 3, startC := (col / 3) * 3",
          "4. Пройдите двумя циклами 3х3 и убедитесь, что в квадрате нет ch",
          "5. Если нарушений нет, верните true"
        ],
        output: "true\nfalse",
        lines: [
          ["package main", "Каркас."],
          ["", ""],
          ['import "fmt"', "Пакет fmt."],
          ["", ""],
          ["func IsValidSudokuMove(board [9][9]rune, row, col int, ch rune) bool {", "Функция проверки хода судоку."],
          ["    for c := 0; c < 9; c++ {", "Проверяем горизонтальную строку."],
          ["        if board[row][c] == ch {", "Если цифра уже есть в строке."],
          ["            return false", "Ход недопустим."],
          ["        }", "Конец проверки строки."],
          ["    }", "Конец цикла."],
          ["    for r := 0; r < 9; r++ {", "Проверяем вертикальный столбец."],
          ["        if board[r][col] == ch {", "Если цифра уже есть в столбце."],
          ["            return false", "Ход недопустим."],
          ["        }", "Конец проверки столбца."],
          ["    }", "Конец цикла."],
          ["    startR := (row / 3) * 3", "Верхняя строка малого квадрата 3х3."],
          ["    startC := (col / 3) * 3", "Левый столбец малого квадрата 3х3."],
          ["    for r := 0; r < 3; r++ {", "Обходим 3 строки квадрата."],
          ["        for c := 0; c < 3; c++ {", "Обходим 3 столбца квадрата."],
          ["            if board[startR+r][startC+c] == ch {", "Если цифра уже есть в квадрате 3х3."],
          ["                return false", "Ход недопустим."],
          ["            }", "Конец if."],
          ["        }", "Конец c."],
          ["    }", "Конец r."],
          ["    return true", "Все 3 правила соблюдены, ход корректен!"],
          ["}", "Конец функции."],
          ["", ""],
          ["func main() {", "Точка входа."],
          ["    var b [9][9]rune", "Создаём пустую доску."],
          ["    for r := 0; r < 9; r++ {", "Заполняем точками."],
          ["        for c := 0; c < 9; c++ {", "Каждую клетку."],
          ["            b[r][c] = '.'", "Точка значит пустая клетка."],
          ["        }", "Конец c."],
          ["    }", "Конец r."],
          ["    b[0][0] = '5'", "Ставим '5' в угол."],
          ["    fmt.Println(IsValidSudokuMove(b, 0, 1, '4'))", "В (0,1) можно поставить '4' (true)."],
          ["    fmt.Println(IsValidSudokuMove(b, 0, 1, '5'))", "В (0,1) нельзя ставить '5', она уже в строке (false)."],
          ["}", "Конец main."]
        ],
        hint: "Квадрат 3х3 вычисляется через целочисленное деление: startR := (row / 3) * 3.",
        checks: [
          { re: /func\s+IsValidSudokuMove/, msg: "Объявите func IsValidSudokuMove" },
          { re: /\/\s*3\s*\)?\s*\*\s*3/, msg: "Вычислите квадрат 3х3 через (row / 3) * 3" },
          { re: /return\s+true/, msg: "Возвращайте true при успешной валидации" }
        ],
        starter: "package main\n\nimport \"fmt\"\n\n// Напишите IsValidSudokuMove\n\nfunc main() {\n    // Тест IsValidSudokuMove\n}\n",
        solution: "package main\n\nimport \"fmt\"\n\nfunc IsValidSudokuMove(board [9][9]rune, row, col int, ch rune) bool {\n    for c := 0; c < 9; c++ {\n        if board[row][c] == ch {\n            return false\n        }\n    }\n    for r := 0; r < 9; r++ {\n        if board[r][col] == ch {\n            return false\n        }\n    }\n    startR := (row / 3) * 3\n    startC := (col / 3) * 3\n    for r := 0; r < 3; r++ {\n        for c := 0; c < 3; c++ {\n            if board[startR+r][startC+c] == ch {\n                return false\n            }\n        }\n    }\n    return true\n}\n\nfunc main() {\n    var b [9][9]rune\n    for r := 0; r < 9; r++ {\n        for c := 0; c < 9; c++ {\n            b[r][c] = '.'\n        }\n    }\n    b[0][0] = '5'\n    fmt.Println(IsValidSudokuMove(b, 0, 1, '4'))\n    fmt.Println(IsValidSudokuMove(b, 0, 1, '5'))\n}\n"
      }
    ]
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { EXT_TOPICS_RU };
}
