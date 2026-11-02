// pedagogy.js: Современные методы обучения программированию (CS Pedagogy)
// 1. Parsons Problems (Конструктор алгоритмов из перемешанных блоков кода)
// 2. Bug Hunting (Охота на ошибки / Code Review)
// 3. Интерактивная трассировка и рентген кода

(function () {
  const XP_PARSONS = 15;
  const XP_BUGHUNT = 15;

  const DATA = {
    // ----------------------------------------------------
    // ТЕМА 1: Структура программы
    // ----------------------------------------------------
    1: {
      parsons: {
        title: "Конструктор: Первая программа на Go",
        goal: "Расставьте строки так, чтобы получилась работающая программа «Привет, мир!».",
        blocks: [
          { id: "b1", text: 'fmt.Println("Привет, мир!")', indent: 1 },
          { id: "b2", text: "package main", indent: 0 },
          { id: "b3", text: "}", indent: 0 },
          { id: "b4", text: 'import "fmt"', indent: 0 },
          { id: "b5", text: "func main() {", indent: 0 },
        ],
        solution: ["b2", "b4", "b5", "b1", "b3"],
        output: "Привет, мир!",
        explanation: "В Go строгий порядок: сначала объявляется пакет (package main), затем импортируются библиотеки (import \"fmt\"), а затем описывается точка входа — func main().",
      },
      bugHunt: {
        title: "Охота на ошибки: Чувствительность к регистру",
        goal: "Найдите строку, из-за которой программа не компилируется, и исправьте её.",
        lines: [
          'package main',
          '',
          'import "fmt"',
          '',
          'func main() {',
          '    fmt.println("Привет от Go!")',
          '}'
        ],
        bugLine: 5, // 0-indexed (line 6)
        options: [
          { text: 'Заменить fmt.println на fmt.Println с большой буквы', correct: true, why: 'В Go всё, что экспортируется из пакета (публичные функции), обязано начинаться с заглавной буквы: Println, а не println.' },
          { text: 'Убрать кавычки вокруг текста "Привет от Go!"', correct: false, why: 'Строки текста в Go обязательно оборачиваются в двойные кавычки.' },
          { text: 'Добавить точку с запятой в конце строки', correct: false, why: 'Компилятор Go расставляет точки с запятой автоматически, вручную их писать не нужно.' }
        ]
      }
    },

    // ----------------------------------------------------
    // ТЕМА 3: Переменные
    // ----------------------------------------------------
    3: {
      parsons: {
        title: "Конструктор: Расчёт возраста через переменные",
        goal: "Соберите алгоритм вычисления возраста пользователя по году рождения.",
        blocks: [
          { id: "b1", text: "age := currentYear - birthYear", indent: 1 },
          { id: "b2", text: 'fmt.Println("Возраст:", age)', indent: 1 },
          { id: "b3", text: "birthYear := 2004", indent: 1 },
          { id: "b4", text: "currentYear := 2026", indent: 1 },
        ],
        solution: ["b3", "b4", "b1", "b2"],
        output: "Возраст: 22",
        explanation: "Нельзя использовать переменную в выражении до того, как она была объявлена. Поэтому сначала задаём birthYear и currentYear, затем вычисляем age, и только потом печатаем результат.",
      },
      bugHunt: {
        title: "Охота на ошибки: Повторное объявление через :=",
        goal: "В коде допущена частая ошибка начинающих при изменении переменной. Найдите проблемную строку.",
        lines: [
          'package main',
          'import "fmt"',
          'func main() {',
          '    score := 100',
          '    score := 150',
          '    fmt.Println(score)',
          '}'
        ],
        bugLine: 4,
        options: [
          { text: 'Заменить score := 150 на score = 150 (без двоеточия)', correct: true, why: 'Оператор := объявляет НОВУЮ переменную. Если переменная score уже создана строкой выше, для изменения её значения используется обычное присваивание =.' },
          { text: 'Написать var score = 150', correct: false, why: 'var тоже объявляет новую переменную, компилятор выдаст ошибку "score redeclared in this block".' },
          { text: 'Переименовать переменную в score2', correct: false, why: 'Это создаст две разные переменные вместо обновления существующей.' }
        ]
      }
    },

    // ----------------------------------------------------
    // ТЕМА 6: Условия if / else
    // ----------------------------------------------------
    6: {
      parsons: {
        title: "Конструктор: Проверка допуска в клуб",
        goal: "Соберите условие: если возраст от 18 — вход разрешён, иначе если с родителями — вход с сопровождением, иначе отказ.",
        blocks: [
          { id: "b1", text: '} else if withParents {', indent: 1 },
          { id: "b2", text: 'if age >= 18 {', indent: 1 },
          { id: "b3", text: '    fmt.Println("Вход только со взрослыми")', indent: 1 },
          { id: "b4", text: '    fmt.Println("Добро пожаловать")', indent: 1 },
          { id: "b5", text: '} else {', indent: 1 },
          { id: "b6", text: '    fmt.Println("Вход запрещен")', indent: 1 },
          { id: "b7", text: '}', indent: 1 },
        ],
        solution: ["b2", "b4", "b1", "b3", "b5", "b6", "b7"],
        output: "Добро пожаловать",
        explanation: "Ветвление проверяется сверху вниз: сначала условие совершеннолетия, затем альтернативное условие else if, и в конце безусловный else.",
      },
      bugHunt: {
        title: "Охота на ошибки: = вместо ==",
        goal: "Найдите ошибку в синтаксисе условия.",
        lines: [
          'package main',
          'import "fmt"',
          'func main() {',
          '    role := "admin"',
          '    if role = "admin" {',
          '        fmt.Println("Полный доступ!")',
          '    }',
          '}'
        ],
        bugLine: 4,
        options: [
          { text: 'Заменить role = "admin" на role == "admin" (двойное равно)', correct: true, why: 'Одиночное = — это присваивание значения, а == — логическое сравнение на равенство. В if проверяется булево выражение.' },
          { text: 'Убрать кавычки вокруг "admin"', correct: false, why: 'Без кавычек компилятор решит, что admin — это переменная.' },
          { text: 'Поставить скобки вокруг условия: if (role = "admin")', correct: false, why: 'В Go круглые скобки вокруг условий if не требуются и не спасут от ошибки присваивания.' }
        ]
      }
    },

    // ----------------------------------------------------
    // ТЕМА 8: Циклы for
    // ----------------------------------------------------
    8: {
      parsons: {
        title: "Конструктор: Сумма чисел от 1 до 5",
        goal: "Соберите алгоритм накопления суммы в цикле for.",
        blocks: [
          { id: "b1", text: "sum := 0", indent: 1 },
          { id: "b2", text: "for i := 1; i <= 5; i++ {", indent: 1 },
          { id: "b3", text: "    sum += i", indent: 1 },
          { id: "b4", text: "}", indent: 1 },
          { id: "b5", text: 'fmt.Println("Сумма:", sum)', indent: 1 },
        ],
        solution: ["b1", "b2", "b3", "b4", "b5"],
        output: "Сумма: 15",
        explanation: "Сначала инициализируем переменную-накопитель (sum := 0). Затем запускаем цикл, на каждом шаге прибавляем i к sum, и только после завершения цикла выводим итоговую сумму.",
      },
      bugHunt: {
        title: "Охота на ошибки: Бесконечный цикл",
        goal: "Этот цикл должен был досчитать до 5, но программа намертво зависла. Почему?",
        lines: [
          'package main',
          'import "fmt"',
          'func main() {',
          '    i := 0',
          '    for i < 5 {',
          '        fmt.Println("Шаг:", i)',
          '    }',
          '}'
        ],
        bugLine: 5,
        options: [
          { text: 'Внутри цикла не увеличивается счетчик: нужно добавить i++', correct: true, why: 'Переменная i всегда равна 0, поэтому условие i < 5 всегда истинно. Без шага i++ цикл работает вечно!' },
          { text: 'Условие должно быть i <= 5', correct: false, why: 'Это не исправит бесконечный цикл, если значение i не меняется.' },
          { text: 'Цикл for в Go обязательно должен быть в три части for ; ;', correct: false, why: 'В Go for condition — это стандартный аналог цикла while, синтаксис верен, забыт только инкремент.' }
        ]
      }
    },

    // ----------------------------------------------------
    // ТЕМА 10: Срезы (Slices)
    // ----------------------------------------------------
    10: {
      parsons: {
        title: "Конструктор: Сборка и наполнение среза",
        goal: "Соберите код, который создаёт пустой срез и добавляет в него элементы через append.",
        blocks: [
          { id: "b1", text: "var numbers []int", indent: 1 },
          { id: "b2", text: "numbers = append(numbers, 10)", indent: 1 },
          { id: "b3", text: "numbers = append(numbers, 20)", indent: 1 },
          { id: "b4", text: 'fmt.Println(numbers)', indent: 1 },
        ],
        solution: ["b1", "b2", "b3", "b4"],
        output: "[10 20]",
        explanation: "Функция append возвращает новый или расширенный срез, поэтому результат всегда присваивается обратно в переменную: numbers = append(numbers, val).",
      },
      bugHunt: {
        title: "Охота на ошибки: Паника Index Out of Range",
        goal: "Программа падает с ошибкой: panic: runtime error: index out of range [0] with length 0. Где ошибка?",
        lines: [
          'package main',
          'import "fmt"',
          'func main() {',
          '    var list []int',
          '    list[0] = 42',
          '    fmt.Println(list)',
          '}'
        ],
        bugLine: 4,
        options: [
          { text: 'Нельзя обращаться по индексу к пустому срезу: нужно использовать append(list, 42)', correct: true, why: 'У только что объявленного среза длина len равна 0. Индекса [0] физически не существует. Для добавления новых элементов обязателен append!' },
          { text: 'Нужно заменить 42 на "42"', correct: false, why: 'Срез имеет тип []int, строки туда класть нельзя.' },
          { text: 'Нужно сделать срез константой: const list = []int', correct: false, why: 'В Go срезы не могут быть константами.' }
        ]
      }
    },

    // ----------------------------------------------------
    // ТЕМА 11: Мапы (Map)
    // ----------------------------------------------------
    11: {
      parsons: {
        title: "Конструктор: Безопасный поиск по словарю",
        goal: "Соберите проверку существования ключа в мапе через идиому «value, ok».",
        blocks: [
          { id: "b1", text: 'phonebook := map[string]string{"Ali": "+7701", "Sara": "+7702"}', indent: 1 },
          { id: "b2", text: 'val, ok := phonebook["Sara"]', indent: 1 },
          { id: "b3", text: 'if ok {', indent: 1 },
          { id: "b4", text: '    fmt.Println("Номер найден:", val)', indent: 1 },
          { id: "b5", text: '}', indent: 1 },
        ],
        solution: ["b1", "b2", "b3", "b4", "b5"],
        output: "Номер найден: +7702",
        explanation: "В Go второй возвращаемый параметр при чтении из мапы (обычно называемый ok) равен true, если ключ действительно найден, и false, если ключа в мапе нет.",
      },
      bugHunt: {
        title: "Охота на ошибки: Запись в nil-мапу",
        goal: "Программа упала с паникой assignment to entry in nil map. Какая строка привела к краху?",
        lines: [
          'package main',
          'import "fmt"',
          'func main() {',
          '    var scores map[string]int',
          '    scores["math"] = 95',
          '    fmt.Println(scores)',
          '}'
        ],
        bugLine: 4,
        options: [
          { text: 'Мапа не была проинициализирована: перед записью нужно вызвать make(map[string]int)', correct: true, why: 'Объявление var scores map[...] создаёт nil-мапу. Читать из неё можно, но любая запись в неинициализированную мапу вызывает немедленную панику программы.' },
          { text: 'Ключ "math" нужно писать с заглавной буквы "Math"', correct: false, why: 'Ключом может быть любая строка.' },
          { text: 'Вместо scores["math"] = 95 нужно писать append(scores, 95)', correct: false, why: 'append работает только со срезами (slices), а не с мапами.' }
        ]
      }
    },

    // ----------------------------------------------------
    // ТЕМА 14: Сетка и координаты: Quad (01 Edu)
    // ----------------------------------------------------
    14: {
      parsons: {
        title: "Конструктор: Алгоритм QuadA (Сетка X × Y)",
        goal: "Соберите правильный каркас вложенных циклов для печати прямоугольника с углами 'o', верх/низ '-', бока '|'.",
        blocks: [
          { id: "b1", text: "for row := 0; row < y; row++ {", indent: 1 },
          { id: "b2", text: "    for col := 0; col < x; col++ {", indent: 1 },
          { id: "b3", text: '        if (col == 0 || col == x-1) && (row == 0 || row == y-1) { fmt.Print("o") }', indent: 1 },
          { id: "b4", text: '        else if row == 0 || row == y-1 { fmt.Print("-") }', indent: 1 },
          { id: "b5", text: '        else if col == 0 || col == x-1 { fmt.Print("|") }', indent: 1 },
          { id: "b6", text: '        else { fmt.Print(" ") }', indent: 1 },
          { id: "b7", text: "    }", indent: 1 },
          { id: "b8", text: "    fmt.Println()", indent: 1 },
          { id: "b9", text: "}", indent: 1 },
        ],
        solution: ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9"],
        output: "o---o\n|   |\no---o",
        explanation: "Строка состоит из столбцов (col перебирается во внутреннем цикле). В конце каждой строки (после завершения внутреннего цикла col, но до конца внешнего цикла row) обязательно нужен перенос строки fmt.Println()!",
      },
      bugHunt: {
        title: "Охота на ошибки: Склеивание сетки в вертикальный столбик",
        goal: "Студент на экзамене 01 Edu написал Quad, но на экране вместо прямоугольника вытянулась вертикальная полоска символов. В чём ошибка?",
        lines: [
          'func QuadA(x, y int) {',
          '    for row := 0; row < y; row++ {',
          '        for col := 0; col < x; col++ {',
          '            if col == 0 || col == x-1 {',
          '                fmt.Println("|")',
          '            }',
          '        }',
          '    }',
          '}'
        ],
        bugLine: 4,
        options: [
          { text: 'Внутри строки нужно использовать fmt.Print("|") вместо fmt.Println, иначе каждый символ переносит строку', correct: true, why: 'fmt.Println автоматически добавляет перевод строки \\n после каждого символа, разрушая горизонтальные ряды сетки.' },
          { text: 'Цикл по col должен начинаться с 1, а не с 0', correct: false, why: 'Индексы столбцов начинаются с 0 до x-1.' },
          { text: 'Нужно заменить x и y местами в объявлении функции', correct: false, why: 'x — это ширина, y — высота.' }
        ]
      }
    },

    // ----------------------------------------------------
    // ТЕМА 15: Указатели и память: Pointers (01 Edu)
    // ----------------------------------------------------
    15: {
      parsons: {
        title: "Конструктор: Алгоритм Swap(a, b *int)",
        goal: "Соберите функцию обмена значениями двух переменных через указатели с помощью временной переменной temp.",
        blocks: [
          { id: "b1", text: "func Swap(a *int, b *int) {", indent: 0 },
          { id: "b2", text: "    temp := *a", indent: 1 },
          { id: "b3", text: "    *a = *b", indent: 1 },
          { id: "b4", text: "    *b = temp", indent: 1 },
          { id: "b5", text: "}", indent: 0 },
        ],
        solution: ["b1", "b2", "b3", "b4", "b5"],
        output: "Было: a=5, b=10 → Стало: a=10, b=5",
        explanation: "Сначала считываем значение по адресу a (*a) во временную переменную temp, затем по адресу a записываем значение из b, и наконец в ячейку по адресу b кладём сохранённое temp.",
      },
      bugHunt: {
        title: "Охота на ошибки: Подмена адресов вместо значений",
        goal: "Функция должна менять местами переменные в памяти, но в main значения остаются прежними. Почему?",
        lines: [
          'func Swap(a *int, b *int) {',
          '    temp := a',
          '    a = b',
          '    b = temp',
          '}'
        ],
        bugLine: 2,
        options: [
          { text: 'Меняются локальные копии адресов a и b, а не значения в памяти: нужно разыменовывать звёздочкой *a = *b', correct: true, why: 'В Go параметры передаются по значению. Переменные a и b — это локальные копии указателей. Чтобы изменить оригинальные данные в ячейках памяти, обязательно использовать звёздочку разыменования: *a, *b.' },
          { text: 'У функции должен быть return a, b', correct: false, why: 'В задаче 01 Edu функция Swap ничего не возвращает, а мутирует память по месту.' },
          { text: 'temp должен иметь тип string', correct: false, why: 'Значения в ячейках целочисленные (int).' }
        ]
      }
    },

    // ----------------------------------------------------
    // ТЕМА 16: Строки и Руны (01 Edu Piscine)
    // ----------------------------------------------------
    16: {
      parsons: {
        title: "Конструктор: StrRev (Разворот строки через руны)",
        goal: "Соберите эффективный алгоритм разворота строки двумя указателями (i слева, j справа).",
        blocks: [
          { id: "b1", text: "func StrRev(s string) string {", indent: 0 },
          { id: "b2", text: "    r := []rune(s)", indent: 1 },
          { id: "b3", text: "    for i, j := 0, len(r)-1; i < j; i++, j-- {", indent: 1 },
          { id: "b4", text: "        r[i], r[j] = r[j], r[i]", indent: 1 },
          { id: "b5", text: "    }", indent: 1 },
          { id: "b6", text: "    return string(r)", indent: 1 },
          { id: "b7", text: "}", indent: 0 },
        ],
        solution: ["b1", "b2", "b3", "b4", "b5", "b6", "b7"],
        output: 'Вход: "hello" → Выход: "olleh"',
        explanation: "Преобразование в []rune защищает от повреждения символов Unicode (кириллицы, эмодзи). Два указателя идут навстречу друг другу за O(N/2) шагов.",
      },
      bugHunt: {
        title: "Охота на ошибки: Побайтовый разворот UTF-8",
        goal: "При развороте строки «Привет» вместо букв получились битые кракозябры «???». Какая строка кода это сломала?",
        lines: [
          'func StrRevBroken(s string) string {',
          '    bytes := []byte(s)',
          '    for i, j := 0, len(bytes)-1; i < j; i++, j-- {',
          '        bytes[i], bytes[j] = bytes[j], bytes[i]',
          '    }',
          '    return string(bytes)',
          '}'
        ],
        bugLine: 1,
        options: [
          { text: 'Использован []byte вместо []rune: кириллица занимает по 2 байта, перевернув отдельные байты, мы сломали кодировку UTF-8', correct: true, why: 'В Go строка — это срез байт. Русские буквы кодируются 2 байтами. Превращение в []rune декодирует текст в полноценные символы Unicode.' },
          { text: 'Условие цикла должно быть i <= j', correct: false, why: 'При равенстве i == j центральный символ менять с самим собой бессмысленно.' },
          { text: 'В Go строки нельзя преобразовывать в срез байт', correct: false, why: 'Преобразование []byte(s) валидно синтаксически, но для текста с не-ASCII символами логически некорректно.' }
        ]
      }
    },

    // ----------------------------------------------------
    // ТЕМА 17: Рекурсия и Степень (01 Edu Piscine)
    // ----------------------------------------------------
    17: {
      parsons: {
        title: "Конструктор: Рекурсивный факториал",
        goal: "Соберите рекурсивную функцию: базовый случай выхода + шаг рекурсивного спуска.",
        blocks: [
          { id: "b1", text: "func RecursiveFactorial(nb int) int {", indent: 0 },
          { id: "b2", text: "    if nb < 0 || nb > 20 { return 0 }", indent: 1 },
          { id: "b3", text: "    if nb == 0 { return 1 }", indent: 1 },
          { id: "b4", text: "    return nb * RecursiveFactorial(nb - 1)", indent: 1 },
          { id: "b5", text: "}", indent: 0 },
        ],
        solution: ["b1", "b2", "b3", "b4", "b5"],
        output: "5! = 120",
        explanation: "В любой рекурсии первым делом пишется условие остановки (базовый случай: 0! = 1), иначе функция будет вызывать сама себя до переполнения стека памяти.",
      },
      bugHunt: {
        title: "Охота на ошибки: Переполнение стека (Stack Overflow)",
        goal: "Эта функция факториала падает с фатальной ошибкой runtime: goroutine stack exceeds limit. Найдите строку с дефектом.",
        lines: [
          'func Factorial(n int) int {',
          '    if n <= 1 {',
          '        return 1',
          '    }',
          '    return n * Factorial(n)',
          '}'
        ],
        bugLine: 4,
        options: [
          { text: 'Аргумент не уменьшается: нужно вызывать Factorial(n - 1)', correct: true, why: 'Вызывая Factorial(n) с тем же аргументом, мы никогда не приближаемся к условию выхода n <= 1. Стек бесконечно наполняется одинаковыми вызовами.' },
          { text: 'Базовый случай должен быть n == 0', correct: false, why: 'n <= 1 вполне корректный базовый случай для 1! и 0!.' },
          { text: 'Рекурсия в Go запрещена компилятором', correct: false, why: 'Go отлично поддерживает рекурсивные вызовы.' }
        ]
      }
    },

    // ----------------------------------------------------
    // ТЕМА 18: Алгоритмы: Простое число (IsPrime)
    // ----------------------------------------------------
    18: {
      parsons: {
        title: "Конструктор: Эффективный IsPrime (O(√N))",
        goal: "Соберите алгоритм проверки простоты числа, проверяющий делители только до корня из числа.",
        blocks: [
          { id: "b1", text: "func IsPrime(nb int) bool {", indent: 0 },
          { id: "b2", text: "    if nb <= 1 { return false }", indent: 1 },
          { id: "b3", text: "    for i := 2; i*i <= nb; i++ {", indent: 1 },
          { id: "b4", text: "        if nb%i == 0 { return false }", indent: 1 },
          { id: "b5", text: "    }", indent: 1 },
          { id: "b6", text: "    return true", indent: 1 },
          { id: "b7", text: "}", indent: 0 },
        ],
        solution: ["b1", "b2", "b3", "b4", "b5", "b6", "b7"],
        output: "IsPrime(13) = true, IsPrime(14) = false",
        explanation: "Числа <= 1 не являются простыми. Если у числа есть делитель больше корня, то парный ему делитель обязательно меньше корня, поэтому перебирать делители i*i <= nb абсолютно достаточно.",
      },
      bugHunt: {
        title: "Охота на ошибки: Проверка делимости на 1",
        goal: "Функция проверки простого числа на тесте 13 возвращает false! Где баг?",
        lines: [
          'func IsPrime(n int) bool {',
          '    if n <= 1 { return false }',
          '    for i := 1; i*i <= n; i++ {',
          '        if n%i == 0 { return false }',
          '    }',
          '    return true',
          '}'
        ],
        bugLine: 2,
        options: [
          { text: 'Цикл начинается с i := 1: любое число делится на 1 без остатка (n % 1 == 0), поэтому функция всегда возвращает false. Нужно начинать с i := 2', correct: true, why: 'Делимость на 1 и на само себя — свойство всех чисел. Простые числа проверяются на делители, начиная строго с 2!' },
          { text: 'Нужно заменить n%i == 0 на n%i != 0', correct: false, why: 'Если остаток не равен 0, это как раз означает, что число НЕ делится нацело.' },
          { text: 'Условие n <= 1 должно быть n < 0', correct: false, why: 'Числа 0 и 1 по математическому определению не являются простыми.' }
        ]
      }
    },

    // ----------------------------------------------------
    // ТЕМА 20: JSON
    // ----------------------------------------------------
    20: {
      parsons: {
        title: "Конструктор: Структура и экспорт в JSON",
        goal: "Соберите модель пользователя с JSON-тегами и сериализацию структуры в байты.",
        blocks: [
          { id: "b1", text: 'type User struct { Name string `json:"name"`; Age int `json:"age"` }', indent: 1 },
          { id: "b2", text: 'u := User{Name: "Alikhan", Age: 21}', indent: 1 },
          { id: "b3", text: 'data, _ := json.Marshal(u)', indent: 1 },
          { id: "b4", text: 'fmt.Println(string(data))', indent: 1 },
        ],
        solution: ["b1", "b2", "b3", "b4"],
        output: '{"name":"Alikhan","age":21}',
        explanation: "В Go структура сначала описывается с типами и тегами, затем создаётся экземпляр u, после чего json.Marshal превращает её в срез байт JSON.",
      },
      bugHunt: {
        title: "Охота на ошибки: Приватные поля структуры",
        goal: "При сериализации json.Marshal выдаёт пустой объект {} вместо данных пользователя! Какая строка виновата?",
        lines: [
          'type Profile struct {',
          '    name string `json:"name"`',
          '    role string `json:"role"`',
          '}',
          'func main() {',
          '    p := Profile{name: "Admin", role: "Super"}',
          '    b, _ := json.Marshal(p)',
          '    fmt.Println(string(b))',
          '}'
        ],
        bugLine: 1,
        options: [
          { text: 'Поля name и role написаны с маленькой буквы: пакет json не имеет доступа к неэкспортируемым (приватным) полям структуры', correct: true, why: 'В Go видимость определяется регистром первой буквы. Чтобы внешний пакет encoding/json мог прочитать поля, они обязаны начинаться с Заглавной буквы: Name, Role!' },
          { text: 'JSON-теги должны быть в одинарных кавычках, а не в косых апострофах', correct: false, why: 'Теги структур в Go оформляются строго в обратных апострофах ` `.' },
          { text: 'json.Marshal принимает только указатели &p', correct: false, why: 'json.Marshal успешно работает как со значениями, так и с указателями.' }
        ]
      }
    },

    // ----------------------------------------------------
    // ТЕМА 22: REST API
    // ----------------------------------------------------
    22: {
      parsons: {
        title: "Конструктор: REST Handler с валидацией метода",
        goal: "Соберите HTTP-обработчик с проверкой метода POST и возвратом 405 Method Not Allowed.",
        blocks: [
          { id: "b1", text: "func apiHandler(w http.ResponseWriter, r *http.Request) {", indent: 0 },
          { id: "b2", text: '    if r.Method != http.MethodPost {', indent: 1 },
          { id: "b3", text: '        http.Error(w, "Только POST запросы", http.StatusMethodNotAllowed)', indent: 1 },
          { id: "b4", text: '        return', indent: 1 },
          { id: "b5", text: '    }', indent: 1 },
          { id: "b6", text: '    fmt.Fprintln(w, "Данные успешно приняты")', indent: 1 },
          { id: "b7", text: "}", indent: 0 },
        ],
        solution: ["b1", "b2", "b3", "b4", "b5", "b6", "b7"],
        output: "HTTP 405 Method Not Allowed (при GET) / 200 OK (при POST)",
        explanation: "Обязательно писать return сразу после http.Error, иначе функция продолжит выполняться и попытается отправить ответ повторно.",
      },
      bugHunt: {
        title: "Охота на ошибки: Забытый return после http.Error",
        goal: "В логах сервера появляется предупреждение http: superfluous response.WriteHeader call. Где пропущен оператор?",
        lines: [
          'func HandleUser(w http.ResponseWriter, r *http.Request) {',
          '    if r.Header.Get("Authorization") == "" {',
          '        http.Error(w, "Unauthorized", http.StatusUnauthorized)',
          '    }',
          '    w.WriteHeader(http.StatusOK)',
          '    w.Write([]byte("Секретные данные"))',
          '}'
        ],
        bugLine: 2,
        options: [
          { text: 'После вызова http.Error() не написан return — функция не прерывается и пытается отправить 200 OK следом', correct: true, why: 'http.Error не прерывает выполнение функции автоматически! Если не сделать явный return, сервер отправит два разных HTTP статуса подряд.' },
          { text: 'Заголовок Authorization пишется с маленькой буквы', correct: false, why: 'r.Header.Get в Go нечувствителен к регистру заголовков.' },
          { text: 'Нужно использовать http.Redirect вместо http.Error', correct: false, why: 'Для API без авторизации возвращается именно статус 401 Unauthorized.' }
        ]
      }
    },

    // ----------------------------------------------------
    // ТЕМА 23: Базы данных и SQL
    // ----------------------------------------------------
    23: {
      parsons: {
        title: "Конструктор: Безопасный SQL-запрос с параметрами",
        goal: "Соберите выборку одной строки из БД через QueryRow без уязвимости к SQL-инъекциям.",
        blocks: [
          { id: "b1", text: 'var email, name string', indent: 1 },
          { id: "b2", text: 'query := "SELECT name, email FROM users WHERE id = $1"', indent: 1 },
          { id: "b3", text: 'err := db.QueryRow(query, userID).Scan(&name, &email)', indent: 1 },
          { id: "b4", text: 'if err != nil { log.Println("Пользователь не найден") }', indent: 1 },
        ],
        solution: ["b1", "b2", "b3", "b4"],
        output: "Найдено: Alikhan (al@example.com)",
        explanation: "Параметры запроса передаются через $1 (или ? в MySQL/SQLite), а не склеиваются строками. Это предотвращает взлом базы данных (SQL Injection).",
      },
      bugHunt: {
        title: "Охота на ошибки: Уязвимость SQL Injection",
        goal: "Этот код подвержен критической уязвимости в безопасности. Какая строка содержит дыру?",
        lines: [
          'func GetUser(db *sql.DB, inputID string) {',
          '    // Формируем запрос',
          '    q := fmt.Sprintf("SELECT * FROM users WHERE id = %s", inputID)',
          '    rows, err := db.Query(q)',
          '    _ = rows; _ = err',
          '}'
        ],
        bugLine: 2,
        options: [
          { text: 'Склейка строки запроса через fmt.Sprintf: злоумышленник может передать 1 OR 1=1 и получить всю базу данных (SQL Injection)', correct: true, why: 'Никогда нельзя подставлять пользовательский ввод напрямую в SQL-запрос строками. Нужно использовать плейсхолдеры: db.Query("SELECT ... WHERE id = $1", inputID).' },
          { text: 'Переменная inputID должна быть типа int, а не string', correct: false, why: 'Даже если преобразовать в int, паттерн склейки строк остаётся плохой практикой.' },
          { text: 'db.Query возвращает только одну строку, нужно использовать db.Exec', correct: false, why: 'Exec используется для INSERT/UPDATE/DELETE, а для выборки SELECT нужен Query или QueryRow.' }
        ]
      }
    }
  };

  window.PEDAGOGY_DATA = DATA;

  window.hasPedagogy = function (tid) {
    return !!DATA[tid];
  };

  // ========================================================
  // RENDER ACTIVE LEARNING LAB (TABS: SIMULATOR / PARSONS / BUG HUNT)
  // ========================================================
  window.mountActiveLearningLab = function (container, tid, u, simCallback) {
    if (!container) return;
    const pData = DATA[tid];
    const hasParsons = !!pData?.parsons;
    const hasBug = !!pData?.bugHunt;
    const hasSim = typeof simCallback === "function";

    if (!hasParsons && !hasBug && !hasSim) {
      container.innerHTML = "";
      return;
    }

    const d = (window.store && window.store.get("done:" + u)) || {};
    const parsonsDone = !!d["parsons_" + tid];
    const bugDone = !!d["bughunt_" + tid];

    // Determine initial active tab
    let defaultTab = "sim";
    if (!hasSim) {
      defaultTab = hasParsons ? "parsons" : "bughunt";
    }

    container.innerHTML = `
      <div class="learning-lab">
        <div class="lab-nav">
          ${hasSim ? `<button class="lab-tab on" data-lab="sim">📊 Интерактив / Симулятор</button>` : ""}
          ${hasParsons ? `<button class="lab-tab ${!hasSim ? "on" : ""}" data-lab="parsons">🧩 Конструктор алгоритма ${parsonsDone ? '<span class="lab-badge ok">✓ +15 XP</span>' : '<span class="lab-badge">+15 XP</span>'}</button>` : ""}
          ${hasBug ? `<button class="lab-tab ${!hasSim && !hasParsons ? "on" : ""}" data-lab="bughunt">🐞 Охота на ошибки ${bugDone ? '<span class="lab-badge ok">✓ +15 XP</span>' : '<span class="lab-badge">+15 XP</span>'}</button>` : ""}
        </div>
        <div class="lab-content" id="labBody"></div>
      </div>
    `;

    const body = container.querySelector("#labBody");
    const tabs = container.querySelectorAll(".lab-tab");

    function showTab(tabKey) {
      tabs.forEach(t => t.classList.toggle("on", t.dataset.lab === tabKey));
      body.innerHTML = "";

      if (tabKey === "sim" && hasSim) {
        simCallback(body);
      } else if (tabKey === "parsons" && hasParsons) {
        renderParsons(body, pData.parsons, tid, u);
      } else if (tabKey === "bughunt" && hasBug) {
        renderBugHunt(body, pData.bugHunt, tid, u);
      }
    }

    tabs.forEach(t => {
      t.onclick = () => showTab(t.dataset.lab);
    });

    showTab(defaultTab);
  };

  // ========================================================
  // 1. PARSONS PROBLEMS ENGINE
  // ========================================================
  function renderParsons(container, cfg, tid, u) {
    const d = (window.store && window.store.get("done:" + u)) || {};
    let isSolved = !!d["parsons_" + tid];

    // Randomize order initially if not solved
    let currentBlocks = isSolved
      ? cfg.solution.map(id => cfg.blocks.find(b => b.id === id))
      : shuffleArray([...cfg.blocks]);

    container.innerHTML = `
      <div class="parsons-box">
        <div class="parsons-header">
          <div>
            <div class="parsons-badge">🧩 Parsons Puzzle · Когнитивный тренажёр логики</div>
            <h3 class="parsons-title">${esc(cfg.title)}</h3>
          </div>
          <div class="parsons-status" id="parsonsStatus">${isSolved ? '<span class="ok-pill">✓ Пройдено (+15 XP)</span>' : '<span class="todo-pill">Награда: +15 XP</span>'}</div>
        </div>
        <p class="parsons-goal">${esc(cfg.goal)}</p>
        <div class="parsons-hint-bar">
          <span>💡 <b>Совет:</b> Перемещайте блоки стрелками <b>▲ Вверх</b> и <b>▼ Вниз</b>, чтобы восстановить верную последовательность выполнения кода.</span>
        </div>

        <div class="parsons-list" id="parsonsList"></div>

        <div class="parsons-actions">
          <button class="btn primary" id="parsonsCheckBtn">Проверить сборку ▶</button>
          <button class="btn ghost small" id="parsonsResetBtn">Перемешать заново ↺</button>
        </div>

        <div id="parsonsFeedback" class="parsons-feedback" style="display:none"></div>
      </div>
    `;

    const listEl = container.querySelector("#parsonsList");
    const checkBtn = container.querySelector("#parsonsCheckBtn");
    const resetBtn = container.querySelector("#parsonsResetBtn");
    const fbEl = container.querySelector("#parsonsFeedback");
    const statusEl = container.querySelector("#parsonsStatus");

    function renderList() {
      listEl.innerHTML = currentBlocks.map((b, idx) => `
        <div class="parsons-card" data-id="${b.id}" data-idx="${idx}">
          <div class="pc-controls">
            <button class="pc-btn" data-act="up" ${idx === 0 ? "disabled" : ""} title="Поднять выше">▲</button>
            <button class="pc-btn" data-act="down" ${idx === currentBlocks.length - 1 ? "disabled" : ""} title="Опустить ниже">▼</button>
          </div>
          <div class="pc-line-num">${idx + 1}</div>
          <div class="pc-code" style="padding-left: ${b.indent ? b.indent * 20 : 0}px">
            <code>${esc(b.text)}</code>
          </div>
        </div>
      `).join("");

      listEl.querySelectorAll(".pc-btn").forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const card = btn.closest(".parsons-card");
          const idx = parseInt(card.dataset.idx, 10);
          const act = btn.dataset.act;
          if (act === "up" && idx > 0) {
            const tmp = currentBlocks[idx];
            currentBlocks[idx] = currentBlocks[idx - 1];
            currentBlocks[idx - 1] = tmp;
            renderList();
          } else if (act === "down" && idx < currentBlocks.length - 1) {
            const tmp = currentBlocks[idx];
            currentBlocks[idx] = currentBlocks[idx + 1];
            currentBlocks[idx + 1] = tmp;
            renderList();
          }
        };
      });
    }

    renderList();

    resetBtn.onclick = () => {
      currentBlocks = shuffleArray([...cfg.blocks]);
      renderList();
      fbEl.style.display = "none";
    };

    checkBtn.onclick = () => {
      const currentIds = currentBlocks.map(b => b.id);
      const isCorrect = currentIds.every((id, i) => id === cfg.solution[i]);

      fbEl.style.display = "block";
      if (isCorrect) {
        fbEl.className = "parsons-feedback right";
        fbEl.innerHTML = `
          <div class="fb-title">🎉 Идеально! Алгоритм собран абсолютно верно!</div>
          <div class="fb-exp">${esc(cfg.explanation)}</div>
          ${cfg.output ? `<div class="fb-out"><b>Вывод программы:</b><pre>${esc(cfg.output)}</pre></div>` : ""}
        `;
        if (!isSolved) {
          isSolved = true;
          const currDone = (window.store && window.store.get("done:" + u)) || {};
          currDone["parsons_" + tid] = true;
          if (window.store) window.store.set("done:" + u, currDone);
          statusEl.innerHTML = '<span class="ok-pill">✓ Пройдено (+15 XP)</span>';
          if (window.sbSyncTask) window.sbSyncTask("parsons_" + tid, XP_PARSONS, false);
          if (window.refreshBadges) window.refreshBadges();
          if (window.chrome) window.chrome();
        }
      } else {
        // Diagnostic hint: find first misplaced block
        let firstWrongIdx = currentIds.findIndex((id, i) => id !== cfg.solution[i]);
        fbEl.className = "parsons-feedback wrong";
        fbEl.innerHTML = `
          <div class="fb-title">Не совсем так. В последовательности есть логическая ошибка.</div>
          <p>Первые строки до позиции <b>${firstWrongIdx + 1}</b> стоят правильно, но на шаге <b>${firstWrongIdx + 1}</b> ожидается другой блок кода. Подумайте, какое действие должно произойти раньше.</p>
        `;
      }
    };
  }

  // ========================================================
  // 2. BUG HUNT (CODE REVIEW) ENGINE
  // ========================================================
  function renderBugHunt(container, cfg, tid, u) {
    const d = (window.store && window.store.get("done:" + u)) || {};
    let isSolved = !!d["bughunt_" + tid];
    let selectedLineIdx = null;

    container.innerHTML = `
      <div class="bughunt-box">
        <div class="bughunt-header">
          <div>
            <div class="bughunt-badge">🐞 Bug Hunter · Анализ чужого кода и отладка</div>
            <h3 class="bughunt-title">${esc(cfg.title)}</h3>
          </div>
          <div class="bughunt-status" id="bugStatus">${isSolved ? '<span class="ok-pill">✓ Ошибка найдена (+15 XP)</span>' : '<span class="todo-pill">Награда: +15 XP</span>'}</div>
        </div>
        <p class="bughunt-goal">${esc(cfg.goal)}</p>
        <div class="parsons-hint-bar">
          <span>🔍 <b>Инструкция:</b> Внимательно просмотрите код ниже. <b>Кликните по строке</b>, в которой прячется ошибка, чтобы начать разбор.</span>
        </div>

        <div class="code-inspector" id="codeInspector">
          ${cfg.lines.map((l, i) => `
            <div class="ci-line" data-line="${i}">
              <span class="ci-num">${i + 1}</span>
              <span class="ci-text"><code>${esc(l || " ")}</code></span>
              <span class="ci-icon">🔍</span>
            </div>
          `).join("")}
        </div>

        <div id="bugDiagnosisArea" class="bug-diagnosis" style="display:none"></div>
      </div>
    `;

    const linesEls = container.querySelectorAll(".ci-line");
    const diagArea = container.querySelector("#bugDiagnosisArea");
    const statusEl = container.querySelector("#bugStatus");

    linesEls.forEach(el => {
      el.onclick = () => {
        linesEls.forEach(l => l.classList.remove("selected", "wrong-pick", "correct-pick"));
        const lineIdx = parseInt(el.dataset.line, 10);
        selectedLineIdx = lineIdx;
        el.classList.add("selected");

        diagArea.style.display = "block";

        if (lineIdx === cfg.bugLine) {
          el.classList.add("correct-pick");
          diagArea.innerHTML = `
            <div class="diag-card right-pick-card">
              <div class="diag-header">🎯 В точку! Строка ${lineIdx + 1} действительно ошибочна.</div>
              <p class="diag-sub">Теперь выберите правильное объяснение и способ исправления бага:</p>
              <div class="diag-options">
                ${cfg.options.map((opt, oi) => `
                  <button class="diag-opt-btn" data-oi="${oi}">${esc(opt.text)}</button>
                `).join("")}
              </div>
              <div id="diagResult" class="diag-result" style="display:none"></div>
            </div>
          `;

          const optBtns = diagArea.querySelectorAll(".diag-opt-btn");
          const resEl = diagArea.querySelector("#diagResult");

          optBtns.forEach(btn => {
            btn.onclick = () => {
              const oi = parseInt(btn.dataset.oi, 10);
              const opt = cfg.options[oi];
              resEl.style.display = "block";
              if (opt.correct) {
                btn.classList.add("right");
                optBtns.forEach(b => b.disabled = true);
                resEl.className = "diag-result ok";
                resEl.innerHTML = `
                  <b>✓ Абсолютно верно!</b>
                  <p>${esc(opt.why)}</p>
                `;
                if (!isSolved) {
                  isSolved = true;
                  const currDone = (window.store && window.store.get("done:" + u)) || {};
                  currDone["bughunt_" + tid] = true;
                  if (window.store) window.store.set("done:" + u, currDone);
                  statusEl.innerHTML = '<span class="ok-pill">✓ Ошибка найдена (+15 XP)</span>';
                  if (window.sbSyncTask) window.sbSyncTask("bughunt_" + tid, XP_BUGHUNT, false);
                  if (window.refreshBadges) window.refreshBadges();
                  if (window.chrome) window.chrome();
                }
              } else {
                btn.classList.add("wrong");
                btn.disabled = true;
                resEl.className = "diag-result bad";
                resEl.innerHTML = `<b>Не совсем:</b> ${esc(opt.why)}`;
              }
            };
          });
        } else {
          el.classList.add("wrong-pick");
          diagArea.innerHTML = `
            <div class="diag-card wrong-pick-card">
              <div class="diag-header">Строка ${lineIdx + 1} написана без ошибок.</div>
              <p>В строке <code>${esc(cfg.lines[lineIdx] || "")}</code> синтаксис и логика верны. Ищите дефект в другом месте программы.</p>
            </div>
          `;
        }
      };
    });
  }

  function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    // ensure not naturally sorted
    if (a.every((item, i) => item.id === arr[i].id) && a.length > 1) {
      [a[0], a[1]] = [a[1], a[0]];
    }
    return a;
  }

  function esc(s) {
    return String(s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  }
})();

