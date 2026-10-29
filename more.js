// Темы 11-18: мапы, структуры, ошибки, JSON, HTTP, REST, базы данных, мини-проект.
// Подключается после extra.js. В каждой теме: 2 простые задачи + 1 задача посложнее (hard: true).

const BT = "`"; // обратная кавычка (в шаблонных строках её нельзя писать напрямую)

// ---------- помощники ----------
const IMP_NOTE = {
  '"fmt"': "Подключаем fmt - он умеет печатать текст.",
  '"errors"': "Подключаем errors - он умеет создавать ошибки.",
  '"net/http"': "Подключаем net/http - готовые инструменты для работы с HTTP.",
  '"encoding/json"': "Подключаем encoding/json - он переводит данные в JSON и обратно.",
  '"database/sql"': "Подключаем database/sql - общий инструмент для работы с базами данных.",
  '_ "github.com/mattn/go-sqlite3"': "Драйвер SQLite. Знак _ значит: подключаем ради работы «за кулисами», напрямую мы его не вызываем.",
};
function head(...imps) {
  const out = [["package main", "Каркас программы. Эта строка есть в каждой программе."], ["", ""]];
  if (imps.length === 1) out.push(["import " + imps[0], IMP_NOTE[imps[0]]]);
  else {
    out.push(["import (", "Подключаем сразу несколько пакетов, каждый на своей строке."]);
    imps.forEach(i => out.push(["    " + i, IMP_NOTE[i]]));
    out.push([")", "Список пакетов закончился."]);
  }
  out.push(["", ""]);
  return out;
}
const codeOf = ls => ls.map(l => l[0]).join("\n");

// o: id, title, desc, imps, body, output, hint, checks, hard, plan, above (типы/функции выше main), starter
function T(o) {
  const lines = [...head(...o.imps), ...o.body];
  const note = o.above ? "Пишите решение здесь (свои типы и функции добавьте выше func main)" : "Пишите решение здесь";
  return {
    id: o.id, title: o.title, desc: o.desc, hard: !!o.hard, plan: o.plan || null,
    lines, output: o.output, hint: o.hint, checks: o.checks,
    starter: o.starter || codeOf(head(...o.imps)) + "\nfunc main() {\n    // " + note + "\n}\n",
    solution: codeOf(lines) + "\n",
  };
}

// описание дела и список - общая часть проекта (темы 17-18)
const todoLines = (pre) => [
  ["type Todo struct {", "Описание дела: структура Todo.", pre],
  ["    ID    int    " + BT + 'json:"id"' + BT, "Номер дела. Тег json:\"id\" задаёт имя поля в JSON.", pre],
  ["    Title string " + BT + 'json:"title"' + BT, "Название дела.", pre],
  ["    Done  bool   " + BT + 'json:"done"' + BT, "Сделано или нет: bool - это true или false.", pre],
  ["}", "Конец описания.", pre],
  ["", ""],
  ["var todos = []Todo{", "Список дел живёт в переменной вне функций, поэтому её видят все обработчики.", pre],
  ['    {ID: 1, Title: "Learn Go", Done: true},', "Первое дело - уже сделано.", pre],
  ['    {ID: 2, Title: "Build API", Done: false},', "Второе дело - ещё нет.", pre],
  ["}", "Конец списка.", pre],
];
const HND = "w http.ResponseWriter, r *http.Request";

TOPICS.push(
  // ======================================================= 11
  {
    id: 11, title: "Мапы (словари)",
    about: "словари: как хранить данные по ключу, например имя → возраст",
    theory: R`
Срез хранит значения по номеру: «первый», «второй», «третий». А если нужно искать по названию? Например, по имени узнать возраст. Для этого в Go есть мап (map) - словарь, в котором хранятся пары «ключ → значение».

Представьте телефонную книгу: имя (ключ) и номер (значение). Вы не листаете все записи подряд, а сразу открываете нужную по имени.

Запись типа: {{map[string]int}}. В квадратных скобках - тип ключа (string), после них - тип значения (int). Создаётся так: {{ages := map[string]int{"Ali": 20, "Dana": 22}}}. Каждая пара - это ключ, двоеточие и значение, а пары разделены запятыми.

Прочитать значение: {{ages["Ali"]}} - получим 20. Записать или изменить: {{ages["Omar"] = 19}}. Если такого ключа ещё нет, он создастся.

Если спросить ключ, которого нет, мап не выдаст ошибку, а вернёт нулевое значение: для int это 0, для string - пустая строка. Чтобы отличить «там лежит 0» от «ключа нет», пишут {{age, ok := ages["Zed"]}}: переменная ok равна true, если ключ найден, и false, если нет.

Удалить пару: {{delete(ages, "Ali")}}. Количество пар: {{len(ages)}}. Обойти все пары: {{for name, age := range ages}}. Порядок обхода каждый раз может отличаться - это нормально.

Пустой мап создают через {{make}}: {{counts := make(map[string]int)}}. Запись {{counts["go"]++}} увеличивает число на 1 (если ключа не было, начнёт с нуля). Важно: мап, объявленный без {{make}} или фигурных скобок, заполнять нельзя.
`,
    examples: R`
${F}
ages := map[string]int{"Ali": 20, "Dana": 22}
ages["Omar"] = 19
fmt.Println(ages["Ali"])
fmt.Println(len(ages))
${F}

Результат:

${F}
20
3
${F}

Ключа нет - получаем нулевое значение и false:

${F}
age, ok := ages["Zed"]
fmt.Println(age, ok)
${F}

Результат:

${F}
0 false
${F}

Удаляем пару и печатаем весь мап целиком (Go сам выводит его по порядку ключей):

${F}
delete(ages, "Ali")
fmt.Println(ages)
${F}

Результат:

${F}
map[Dana:22 Omar:19]
${F}
`,
    tasks: [
      T({
        id: "t21", title: "Создать мап", imps: ['"fmt"'],
        desc: R`Создайте мап с возрастами двух человек и напечатайте возраст Даны. Допечатайте строки внутри {{func main}}.`,
        body: [
          ["func main() {", "Начало программы."],
          ['    ages := map[string]int{"Ali": 20, "Dana": 22}', "Создаём мап: ключи - имена (string), значения - возраст (int). Пары через запятую."],
          ['    fmt.Println(ages["Dana"])', "Берём значение по ключу \"Dana\" и печатаем его."],
          ["}", "Конец программы."],
        ],
        output: "22", hint: "Пара записывается как ключ, двоеточие, значение: \"Ali\": 20.",
        checks: [
          { re: /ages\s*:=\s*map\[string\]int\{/, msg: "ages := map[string]int{...}" },
          { re: /"Ali"\s*:\s*20/, msg: 'Пара "Ali": 20' },
          { re: /"Dana"\s*:\s*22/, msg: 'Пара "Dana": 22' },
          { re: /fmt\.Println\(\s*ages\["Dana"\]\s*\)/, msg: 'fmt.Println(ages["Dana"])' },
        ],
      }),
      T({
        id: "t22", title: "Добавить и удалить", imps: ['"fmt"'],
        desc: R`Создайте мап цен, добавьте в него пирожное, удалите чай и узнайте, сколько пар осталось.`,
        body: [
          ["func main() {", "Начало программы."],
          ['    prices := map[string]int{"tea": 100}', "Мап цен с одной парой: чай стоит 100."],
          ['    prices["cake"] = 250', "Добавляем новую пару: пирожное стоит 250."],
          ['    delete(prices, "tea")', "Удаляем пару с ключом \"tea\"."],
          ["    fmt.Println(len(prices))", "len считает пары. Осталась одна, поэтому увидим 1."],
          ["}", "Конец программы."],
        ],
        output: "1", hint: "delete принимает два параметра: сам мап и ключ, который нужно убрать.",
        checks: [
          { re: /prices\s*:=\s*map\[string\]int\{\s*"tea"\s*:\s*100\s*,?\s*\}/, msg: 'prices := map[string]int{"tea": 100}' },
          { re: /prices\["cake"\]\s*=\s*250/, msg: 'prices["cake"] = 250' },
          { re: /delete\(\s*prices\s*,\s*"tea"\s*\)/, msg: 'delete(prices, "tea")' },
          { re: /fmt\.Println\(\s*len\(\s*prices\s*\)\s*\)/, msg: "fmt.Println(len(prices))" },
        ],
      }),
      T({
        id: "t23", title: "Подсчёт слов", hard: true, imps: ['"fmt"'],
        desc: R`Дан список слов: {{go}}, {{is}}, {{fun}}, {{go}}. Посчитайте, сколько раз встречается каждое слово, и напечатайте, сколько раз встретилось слово {{go}}.`,
        plan: [
          "Создайте срез words из четырёх слов: go, is, fun, go.",
          "Создайте пустой мап count: ключи - строки, значения - числа (через make).",
          "Циклом for ... range пройдите по словам и для каждого слова увеличьте его счётчик на 1.",
          "Напечатайте значение count для ключа \"go\". Должно получиться 2.",
        ],
        body: [
          ["func main() {", "Начало программы."],
          ['    words := []string{"go", "is", "fun", "go"}', "Срез слов."],
          ["    count := make(map[string]int)", "Пустой мап-счётчик: слово → сколько раз встретилось."],
          ["    for _, w := range words {", "Идём по словам. Номер не нужен, поэтому _."],
          ["        count[w]++", "Для текущего слова увеличиваем счётчик на 1."],
          ["    }", "Конец цикла."],
          ['    fmt.Println(count["go"])', "Печатаем, сколько раз встретилось go."],
          ["}", "Конец программы."],
        ],
        output: "2", hint: "Внутри цикла достаточно одной строки: count[w]++. Если слова ещё нет в мапе, счёт начнётся с нуля.",
        checks: [
          { re: /\[\]string\{\s*"go"\s*,\s*"is"\s*,\s*"fun"\s*,\s*"go"\s*\}/, msg: 'Срез слов: []string{"go", "is", "fun", "go"}' },
          { re: /make\(\s*map\[string\]int\s*\)|map\[string\]int\{\s*\}/, msg: "Создайте пустой мап: make(map[string]int)" },
          { re: /for\s+\w+\s*,\s*\w+\s*:=\s*range\s+words/, msg: "Цикл по словам: for _, w := range words" },
          { re: /(\w+)\[\w+\]\s*(\+\+|\+=\s*1|=\s*\1\[\w+\]\s*\+\s*1)/, msg: "Увеличьте счётчик слова: count[w]++" },
          { re: /fmt\.Println\(\s*\w+\["go"\]\s*\)/, msg: 'Напечатайте count["go"]' },
        ],
      }),
    ],
  },

  // ======================================================= 12
  {
    id: 12, title: "Структуры и методы",
    about: "как собрать данные в «карточку» (struct) и научить её что-то делать",
    theory: R`
До сих пор мы хранили отдельные значения: имя в одной переменной, возраст в другой. Но у человека имя и возраст относятся друг к другу, и удобно собрать их в одну «карточку». В Go такая карточка называется структурой (struct).

Сначала описываем, из чего состоит карточка. Это новый тип данных:

${F}
type User struct {
    Name string
    Age  int
}
${F}

Слово {{type}} значит «объявляем новый тип», {{User}} - его название, {{struct}} - «это карточка». Внутри скобок перечислены поля: имя поля и его тип. Названия типа и полей, которыми хотим пользоваться, пишем с большой буквы.

Теперь создаём карточку: {{u := User{Name: "Ali", Age: 20}}}. Поля читаются через точку: {{u.Name}}, {{u.Age}}. Менять так же: {{u.Age = 21}}.

Структуре можно дать «умения». Для этого пишут метод - функцию, привязанную к типу:

${F}
func (u User) Hello() string {
    return "Hi, " + u.Name
}
${F}

Часть {{(u User)}} между {{func}} и названием называется получателем. Она говорит: функция принадлежит типу User, а внутри карточка доступна под именем u. Вызывается метод через точку: {{u.Hello()}}. Знак {{+}} между строками склеивает их в одну.

Описание типа и методов пишут выше {{func main}}, на верхнем уровне файла.
`,
    examples: R`
${F}
package main

import "fmt"

type User struct {
    Name string
    Age  int
}

func (u User) Hello() string {
    return "Hi, " + u.Name
}

func main() {
    u := User{Name: "Ali", Age: 20}
    fmt.Println(u.Name)
    u.Age = 21
    fmt.Println(u.Age)
    fmt.Println(u.Hello())
}
${F}

Результат:

${F}
Ali
21
Hi, Ali
${F}

Как читать: сначала описали карточку User и метод Hello, потом в main создали карточку, прочитали и изменили поле, вызвали метод.
`,
    tasks: [
      T({
        id: "t24", title: "Карточка пользователя", imps: ['"fmt"'], above: true,
        desc: R`Опишите структуру {{User}} с двумя полями, создайте карточку и напечатайте её поля. Совет: кликайте по строкам в таблице ниже, и они сами встанут на нужное место в редакторе.`,
        body: [
          ["type User struct {", "Описываем карточку: новый тип User - это структура."],
          ["    Name string", "Поле Name - текст."],
          ["    Age  int", "Поле Age - число."],
          ["}", "Описание закончилось."],
          ["", ""],
          ["func main() {", "Начало программы."],
          ['    u := User{Name: "Ali", Age: 20}', "Создаём карточку u и заполняем поля через двоеточие."],
          ["    fmt.Println(u.Name, u.Age)", "Читаем поля через точку и печатаем."],
          ["}", "Конец программы."],
        ],
        output: "Ali 20", hint: "Описание типа пишется выше func main, а создание карточки - внутри main.",
        checks: [
          { re: /type\s+User\s+struct\s*\{/, msg: "type User struct {" },
          { re: /Name\s+string/, msg: "Поле Name string" },
          { re: /Age\s+int/, msg: "Поле Age int" },
          { re: /User\{\s*Name:\s*"Ali"\s*,\s*Age:\s*20\s*\}/, msg: 'u := User{Name: "Ali", Age: 20}' },
          { re: /fmt\.Println\(\s*u\.Name\s*,\s*u\.Age\s*\)/, msg: "fmt.Println(u.Name, u.Age)" },
        ],
      }),
      T({
        id: "t25", title: "Метод Hello", imps: ['"fmt"'], above: true,
        desc: R`Добавьте структуре {{User}} метод {{Hello}}, который возвращает приветствие, и вызовите его.`,
        body: [
          ["type User struct {", "Карточка пользователя."],
          ["    Name string", "Одно поле - имя."],
          ["}", "Конец описания."],
          ["", ""],
          ["func (u User) Hello() string {", "Метод Hello принадлежит типу User (в скобках - получатель u). Вернёт текст string."],
          ['    return "Hi, " + u.Name', "Склеиваем приветствие с именем из карточки и возвращаем."],
          ["}", "Конец метода."],
          ["", ""],
          ["func main() {", "Начало программы."],
          ['    u := User{Name: "Dana"}', "Создаём карточку с именем Dana."],
          ["    fmt.Println(u.Hello())", "Вызываем метод через точку и печатаем результат."],
          ["}", "Конец программы."],
        ],
        output: "Hi, Dana", hint: "Метод - это обычная функция, у которой между func и названием есть скобки с получателем.",
        checks: [
          { re: /type\s+User\s+struct\s*\{[^}]*Name\s+string/, msg: "type User struct с полем Name string" },
          { re: /func\s*\(\s*u\s+User\s*\)\s*Hello\(\s*\)\s*string\s*\{/, msg: "func (u User) Hello() string {" },
          { re: /return\s+"Hi, "\s*\+\s*u\.Name/, msg: 'return "Hi, " + u.Name' },
          { re: /User\{\s*Name:\s*"Dana"\s*\}/, msg: 'u := User{Name: "Dana"}' },
          { re: /fmt\.Println\(\s*u\.Hello\(\s*\)\s*\)/, msg: "fmt.Println(u.Hello())" },
        ],
      }),
      T({
        id: "t26", title: "Площадь прямоугольника", hard: true, imps: ['"fmt"'], above: true,
        desc: R`Опишите структуру {{Rect}} (прямоугольник) с полями {{W}} (ширина) и {{H}} (высота) - оба целые числа. Напишите метод {{Area}}, который возвращает площадь, создайте прямоугольник 3 на 4 и напечатайте его площадь.`,
        plan: [
          "Выше func main опишите type Rect struct с полями W и H типа int.",
          "Напишите метод Area с получателем Rect, который возвращает int: ширину, умноженную на высоту.",
          "В main создайте прямоугольник: ширина 3, высота 4.",
          "Вызовите метод Area и напечатайте результат. Должно получиться 12.",
        ],
        body: [
          ["type Rect struct {", "Описываем прямоугольник."],
          ["    W int", "Ширина."],
          ["    H int", "Высота."],
          ["}", "Конец описания."],
          ["", ""],
          ["func (r Rect) Area() int {", "Метод Area принадлежит Rect и возвращает целое число."],
          ["    return r.W * r.H", "Площадь - ширина, умноженная на высоту."],
          ["}", "Конец метода."],
          ["", ""],
          ["func main() {", "Начало программы."],
          ["    r := Rect{W: 3, H: 4}", "Создаём прямоугольник 3 на 4."],
          ["    fmt.Println(r.Area())", "Вызываем метод и печатаем: 12."],
          ["}", "Конец программы."],
        ],
        output: "12", hint: "Метод пишется так же, как в прошлой задаче: func (r Rect) Area() int. Внутри нужен return r.W * r.H.",
        checks: [
          { re: /type\s+Rect\s+struct\s*\{[^}]*(\bW\s+int[\s\S]*\bH\s+int|\bW\s*,\s*H\s+int)/, msg: "type Rect struct с полями W int и H int" },
          { re: /func\s*\(\s*\w+\s+Rect\s*\)\s*Area\(\s*\)\s*int\s*\{/, msg: "Метод: func (r Rect) Area() int {" },
          { re: /return\s+\w+\.(W\s*\*\s*\w+\.H|H\s*\*\s*\w+\.W)/, msg: "Верните площадь: return r.W * r.H" },
          { re: /Rect\{\s*(W:\s*3\s*,\s*H:\s*4|H:\s*4\s*,\s*W:\s*3)\s*\}/, msg: "Создайте прямоугольник: Rect{W: 3, H: 4}" },
          { re: /fmt\.Println\(\s*\w+\.Area\(\s*\)\s*\)/, msg: "Напечатайте r.Area()" },
        ],
      }),
    ],
  },

  // ======================================================= 13
  {
    id: 13, title: "Ошибки (error)",
    about: "как функции сообщают, что что-то пошло не так, и как это проверять",
    theory: R`
Программы иногда ломаются: файла нет, число не то, делить на ноль нельзя. Во многих языках для этого придумали «исключения», а в Go всё проще: функция честно возвращает ещё одно значение - ошибку.

Функция в Go может вернуть сразу два значения. Типы результатов пишут в скобках: {{func divide(a, b int) (int, error)}} вернёт число и ошибку. Тип {{error}} встроен в язык.

Ошибка есть, когда значение error не пустое. Пустое (ошибки нет) записывается словом {{nil}} - «ничего». Создать ошибку помогает пакет {{errors}}: {{errors.New("division by zero")}}.

${F}
func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}
${F}

Читаем: если b равно нулю, возвращаем 0 и ошибку. Иначе - результат деления и {{nil}} («ошибки нет»).

Тот, кто вызывает функцию, проверяет ошибку сразу после вызова:

${F}
result, err := divide(10, 0)
if err != nil {
    fmt.Println("Ошибка:", err)
    return
}
fmt.Println(result)
${F}

{{err != nil}} читается «ошибка не пустая», то есть случилась. {{return}} в main завершает программу. Конструкция {{if err != nil}} встречается в Go-коде постоянно, привыкайте к ней.
`,
    examples: R`
${F}
package main

import (
    "errors"
    "fmt"
)

func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

func main() {
    result, err := divide(10, 0)
    if err != nil {
        fmt.Println("Ошибка:", err)
        return
    }
    fmt.Println(result)
}
${F}

Результат:

${F}
Ошибка: division by zero
${F}

Если заменить 0 на 2, ошибки не будет, и программа напечатает {{5}}.
`,
    tasks: [
      T({
        id: "t27", title: "Функция с ошибкой", imps: ['"errors"', '"fmt"'], above: true,
        desc: R`Напишите функцию {{check}}: если возраст меньше 18, она возвращает ошибку, иначе - {{nil}}. Вызовите её для возраста 15 и напечатайте результат.`,
        body: [
          ["func check(age int) error {", "Функция принимает возраст и возвращает ошибку (error)."],
          ["    if age < 18 {", "Если возраст меньше 18..."],
          ['        return errors.New("too young")', "...возвращаем новую ошибку с текстом."],
          ["    }", "Конец условия."],
          ["    return nil", "Иначе ошибки нет: возвращаем nil."],
          ["}", "Конец функции."],
          ["", ""],
          ["func main() {", "Начало программы."],
          ["    err := check(15)", "Вызываем функцию и кладём результат в err."],
          ["    fmt.Println(err)", "Печатаем ошибку: увидим её текст."],
          ["}", "Конец программы."],
        ],
        output: "too young", hint: "Ошибку создаёт errors.New(\"текст\"), а «ошибки нет» записывается как nil.",
        checks: [
          { re: /func\s+check\(\s*age\s+int\s*\)\s*error\s*\{/, msg: "func check(age int) error {" },
          { re: /if\s+age\s*<\s*18\s*\{/, msg: "if age < 18 {" },
          { re: /return\s+errors\.New\(\s*"too young"\s*\)/, msg: 'return errors.New("too young")' },
          { re: /return\s+nil/, msg: "В конце функции: return nil" },
          { re: /err\s*:=\s*check\(\s*15\s*\)/, msg: "err := check(15)" },
          { re: /fmt\.Println\(\s*err\s*\)/, msg: "fmt.Println(err)" },
        ],
      }),
      T({
        id: "t28", title: "Проверка err", imps: ['"errors"', '"fmt"'], above: true,
        desc: R`Напишите функцию {{divide}}, которая делит числа и возвращает ошибку при делении на ноль. Вызовите её с числами 10 и 2 и проверьте ошибку.`,
        body: [
          ["func divide(a, b int) (int, error) {", "Принимает два числа, возвращает число и ошибку."],
          ["    if b == 0 {", "Если делитель равен нулю..."],
          ['        return 0, errors.New("division by zero")', "...возвращаем 0 и ошибку."],
          ["    }", "Конец условия."],
          ["    return a / b, nil", "Иначе возвращаем результат деления и nil («ошибки нет»)."],
          ["}", "Конец функции."],
          ["", ""],
          ["func main() {", "Начало программы."],
          ["    result, err := divide(10, 2)", "Получаем сразу два значения: результат и ошибку."],
          ["    if err != nil {", "Если ошибка не пустая..."],
          ['        fmt.Println("error:", err)', "...печатаем её..."],
          ["        return", "...и выходим из main."],
          ["    }", "Конец условия."],
          ["    fmt.Println(result)", "Ошибки не было - печатаем результат: 5."],
          ["}", "Конец программы."],
        ],
        output: "5", hint: "Функция возвращает два значения, поэтому слева от := тоже две переменные через запятую.",
        checks: [
          { re: /func\s+divide\(\s*a\s*(int)?\s*,\s*b\s+int\s*\)\s*\(\s*int\s*,\s*error\s*\)/, msg: "func divide(a, b int) (int, error) {" },
          { re: /if\s+b\s*==\s*0/, msg: "if b == 0 {" },
          { re: /return\s+0\s*,\s*errors\.New\(\s*"division by zero"\s*\)/, msg: 'return 0, errors.New("division by zero")' },
          { re: /return\s+a\s*\/\s*b\s*,\s*nil/, msg: "return a / b, nil" },
          { re: /result\s*,\s*err\s*:=\s*divide\(\s*10\s*,\s*2\s*\)/, msg: "result, err := divide(10, 2)" },
          { re: /if\s+err\s*!=\s*nil/, msg: "if err != nil {" },
          { re: /fmt\.Println\(\s*result\s*\)/, msg: "fmt.Println(result)" },
        ],
      }),
      T({
        id: "t29", title: "Проверка пароля", hard: true, imps: ['"errors"', '"fmt"'], above: true,
        desc: R`Напишите функцию {{validate}}, которая проверяет пароль: короче 6 символов - ошибка {{password too short}}, иначе {{nil}}. Проверьте два пароля, {{abc}} и {{secret123}}: для плохого напечатайте ошибку, для хорошего - слово {{ok}}.`,
        plan: [
          "Выше func main напишите функцию validate: принимает строку, возвращает error.",
          "Внутри: если len(пароля) меньше 6, верните errors.New(\"password too short\"). Иначе верните nil.",
          "В main вызовите validate(\"abc\") и, если ошибка не nil, напечатайте \"Ошибка:\" и саму ошибку.",
          "Затем вызовите validate(\"secret123\") и, если ошибки нет (err == nil), напечатайте ok.",
        ],
        body: [
          ["func validate(pass string) error {", "Принимает пароль, возвращает ошибку."],
          ["    if len(pass) < 6 {", "len считает символы. Если их меньше шести..."],
          ['        return errors.New("password too short")', "...возвращаем ошибку."],
          ["    }", "Конец условия."],
          ["    return nil", "Иначе всё хорошо."],
          ["}", "Конец функции."],
          ["", ""],
          ["func main() {", "Начало программы."],
          ['    err := validate("abc")', "Проверяем короткий пароль."],
          ["    if err != nil {", "Ошибка не пустая?"],
          ['        fmt.Println("Ошибка:", err)', "Печатаем текст ошибки."],
          ["    }", "Конец условия."],
          ['    err = validate("secret123")', "Проверяем хороший пароль. Переменная err уже есть, поэтому просто = без двоеточия."],
          ["    if err == nil {", "Ошибки нет?"],
          ['        fmt.Println("ok")', "Печатаем ok."],
          ["    }", "Конец условия."],
          ["}", "Конец программы."],
        ],
        output: "Ошибка: password too short\nok", hint: "Для второй проверки используйте err = validate(...) без двоеточия: переменная уже создана.",
        checks: [
          { re: /func\s+validate\(\s*\w+\s+string\s*\)\s*error\s*\{/, msg: "func validate(pass string) error {" },
          { re: /len\(\s*\w+\s*\)\s*(<\s*6|<=\s*5)/, msg: "Проверьте длину: len(pass) < 6" },
          { re: /errors\.New\(\s*"password too short"\s*\)/, msg: 'errors.New("password too short")' },
          { re: /return\s+nil/, msg: "Верните nil, если пароль хороший" },
          { re: /validate\(\s*"abc"\s*\)/, msg: 'Вызовите validate("abc")' },
          { re: /validate\(\s*"secret123"\s*\)/, msg: 'Вызовите validate("secret123")' },
          { re: /if\s+\w+\s*!=\s*nil/, msg: "Проверьте ошибку: if err != nil" },
          { re: /fmt\.Println\(\s*"Ошибка:"\s*,\s*\w+\s*\)/, msg: 'fmt.Println("Ошибка:", err)' },
          { re: /fmt\.Println\(\s*"ok"\s*\)/, msg: 'fmt.Println("ok")' },
        ],
      }),
    ],
  },

  // ======================================================= 14
  {
    id: 14, title: "JSON",
    about: "общий язык программ: как превращать структуры в JSON и обратно",
    theory: R`
Программы часто обмениваются данными: сайт просит у сервера список дел, сервер отвечает. Нужен общий «язык», понятный всем. Самый популярный - JSON. Это обычный текст в фигурных скобках:

${F}
{"name":"Ali","age":20}
${F}

Читается просто: ключ в кавычках, двоеточие, значение. Это почти как мап или структура, только записанная текстом.

В Go за JSON отвечает пакет {{encoding/json}}. Превратить структуру в JSON-текст помогает {{json.Marshal}}:

${F}
data, _ := json.Marshal(u)
fmt.Println(string(data))
${F}

Marshal возвращает два значения: данные и ошибку. Знак {{_}} значит «этот результат мне не нужен» (в настоящих проектах ошибку проверяют, как в прошлой теме). Данные приходят как набор байтов, поэтому {{string(data)}} превращает их в текст.

Чтобы поля попали в JSON, они должны начинаться с большой буквы. А чтобы в тексте имя было с маленькой, добавляют тег - подпись в обратных кавычках: ${F}
type User struct {
    Name string ${BT}json:"name"${BT}
    Age  int    ${BT}json:"age"${BT}
}
${F}

Теперь поле Name превратится в ключ {{name}}, а Age - в {{age}}.

Обратное действие делает {{json.Unmarshal}}: читает JSON-текст и заполняет структуру:

${F}
var u User
json.Unmarshal([]byte(${BT}{"name":"Dana"}${BT}), &u)
${F}

Знак {{&}} перед u значит «передаём саму переменную, а не её копию», иначе функция не сможет её заполнить. Пока достаточно запомнить: при Unmarshal перед структурой ставим {{&}}.
`,
    examples: R`
${F}
package main

import (
    "encoding/json"
    "fmt"
)

type User struct {
    Name string ${BT}json:"name"${BT}
    Age  int    ${BT}json:"age"${BT}
}

func main() {
    u := User{Name: "Ali", Age: 20}
    data, _ := json.Marshal(u)
    fmt.Println(string(data))
}
${F}

Результат:

${F}
{"name":"Ali","age":20}
${F}

А вот чтение из JSON обратно в структуру:

${F}
var u User
json.Unmarshal([]byte(${BT}{"name":"Dana","age":22}${BT}), &u)
fmt.Println(u.Name, u.Age)
${F}

Результат:

${F}
Dana 22
${F}
`,
    tasks: [
      T({
        id: "t30", title: "Структура в JSON", imps: ['"encoding/json"', '"fmt"'], above: true,
        desc: R`Опишите структуру {{User}} с тегами, создайте пользователя и напечатайте его в виде JSON.`,
        body: [
          ["type User struct {", "Карточка пользователя."],
          ["    Name string " + BT + 'json:"name"' + BT, "Поле Name. Тег говорит: в JSON это поле называется name."],
          ["    Age  int    " + BT + 'json:"age"' + BT, "Поле Age. В JSON - age."],
          ["}", "Конец описания."],
          ["", ""],
          ["func main() {", "Начало программы."],
          ['    u := User{Name: "Ali", Age: 20}', "Создаём пользователя."],
          ["    data, _ := json.Marshal(u)", "Marshal превращает структуру в JSON. Ошибку пока пропускаем знаком _."],
          ["    fmt.Println(string(data))", "data - это байты, string() делает из них текст. Печатаем."],
          ["}", "Конец программы."],
        ],
        output: '{"name":"Ali","age":20}', hint: "Тег пишется в обратных кавычках сразу после типа поля.",
        checks: [
          { re: /type\s+User\s+struct\s*\{/, msg: "type User struct {" },
          { re: /Name\s+string\s+`json:"name"`/, msg: 'Name string с тегом `json:"name"`' },
          { re: /Age\s+int\s+`json:"age"`/, msg: 'Age int с тегом `json:"age"`' },
          { re: /User\{\s*Name:\s*"Ali"\s*,\s*Age:\s*20\s*\}/, msg: 'u := User{Name: "Ali", Age: 20}' },
          { re: /data\s*,\s*_\s*:=\s*json\.Marshal\(\s*u\s*\)/, msg: "data, _ := json.Marshal(u)" },
          { re: /fmt\.Println\(\s*string\(\s*data\s*\)\s*\)/, msg: "fmt.Println(string(data))" },
        ],
      }),
      T({
        id: "t31", title: "JSON в структуру", imps: ['"encoding/json"', '"fmt"'], above: true,
        desc: R`Прочитайте JSON-текст в структуру и напечатайте имя.`,
        body: [
          ["type User struct {", "Карточка пользователя."],
          ["    Name string " + BT + 'json:"name"' + BT, "Поле Name связано с ключом name."],
          ["}", "Конец описания."],
          ["", ""],
          ["func main() {", "Начало программы."],
          ["    var u User", "Создаём пустую карточку."],
          ["    json.Unmarshal([]byte(" + BT + '{"name":"Dana"}' + BT + "), &u)", "Читаем JSON-текст и заполняем карточку. Перед u стоит &."],
          ["    fmt.Println(u.Name)", "Печатаем имя: Dana."],
          ["}", "Конец программы."],
        ],
        output: "Dana", hint: "Перед u в Unmarshal обязательно ставьте знак &.",
        checks: [
          { re: /type\s+User\s+struct\s*\{[^}]*Name\s+string\s+`json:"name"`/, msg: 'type User struct с полем Name string `json:"name"`' },
          { re: /var\s+u\s+User/, msg: "var u User" },
          { re: /json\.Unmarshal\(\s*\[\]byte\(\s*`\{\s*"name"\s*:\s*"Dana"\s*\}`\s*\)\s*,\s*&u\s*\)/, msg: 'json.Unmarshal([]byte(`{"name":"Dana"}`), &u)' },
          { re: /fmt\.Println\(\s*u\.Name\s*\)/, msg: "fmt.Println(u.Name)" },
        ],
      }),
      T({
        id: "t32", title: "Книга в JSON", hard: true, imps: ['"encoding/json"', '"fmt"'], above: true,
        desc: R`Опишите структуру {{Book}} с полями {{Title}} (название) и {{Pages}} (число страниц) и подходящими тегами. Создайте книгу {{Go}} на 100 страниц, превратите в JSON и напечатайте. Ошибку на этот раз проверьте.`,
        plan: [
          "Выше func main опишите type Book struct с полями Title (string) и Pages (int). Теги: json:\"title\" и json:\"pages\".",
          "В main создайте книгу: название Go, страниц 100.",
          "Вызовите json.Marshal и получите два значения: данные и ошибку.",
          "Если ошибка не nil, напечатайте error и выйдите через return. Иначе напечатайте данные как текст.",
        ],
        body: [
          ["type Book struct {", "Описываем книгу."],
          ["    Title string " + BT + 'json:"title"' + BT, "Название. В JSON - title."],
          ["    Pages int    " + BT + 'json:"pages"' + BT, "Страницы. В JSON - pages."],
          ["}", "Конец описания."],
          ["", ""],
          ["func main() {", "Начало программы."],
          ['    b := Book{Title: "Go", Pages: 100}', "Создаём книгу."],
          ["    data, err := json.Marshal(b)", "Превращаем в JSON и на этот раз сохраняем ошибку в err."],
          ["    if err != nil {", "Если ошибка не пустая..."],
          ['        fmt.Println("error")', "...сообщаем об этом..."],
          ["        return", "...и выходим."],
          ["    }", "Конец условия."],
          ["    fmt.Println(string(data))", "Всё хорошо - печатаем JSON."],
          ["}", "Конец программы."],
        ],
        output: '{"title":"Go","pages":100}', hint: "Marshal возвращает два значения, а проверка ошибки выглядит так же, как в теме 13: if err != nil.",
        checks: [
          { re: /type\s+Book\s+struct\s*\{[^}]*Title\s+string\s+`json:"title"`[^}]*Pages\s+int\s+`json:"pages"`/, msg: 'Структура Book: Title string `json:"title"` и Pages int `json:"pages"`' },
          { re: /Book\{\s*(Title:\s*"Go"\s*,\s*Pages:\s*100|Pages:\s*100\s*,\s*Title:\s*"Go")\s*\}/, msg: 'Книга: Book{Title: "Go", Pages: 100}' },
          { re: /\w+\s*,\s*\w+\s*:=\s*json\.Marshal\(\s*\w+\s*\)/, msg: "data, err := json.Marshal(b)" },
          { re: /if\s+\w+\s*!=\s*nil/, msg: "Проверьте ошибку: if err != nil" },
          { re: /fmt\.Println\(\s*string\(\s*\w+\s*\)\s*\)/, msg: "Напечатайте JSON: fmt.Println(string(data))" },
        ],
      }),
    ],
  },

  // ======================================================= 15
  {
    id: 15, title: "HTTP-сервер",
    about: "как написать свой первый веб-сервер, который отвечает на запросы",
    theory: R`
Каждый раз, когда вы открываете сайт, происходит одно и то же: браузер (клиент) отправляет запрос по протоколу HTTP, а сервер - программа на чьём-то компьютере - присылает ответ. В этой теме мы напишем такой сервер сами.

Адрес выглядит так: {{localhost:8080/hello}}. Слово localhost значит «этот самый компьютер», 8080 - порт, то есть «номер двери», через которую программа принимает гостей, а /hello - путь: какая именно страница нужна.

Сервер состоит из трёх частей. Первая - обработчик (handler): функция, которая отвечает на запрос.

${F}
func hello(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintln(w, "Hello, Go!")
}
${F}

У обработчика всегда два параметра: {{w}} - «лист бумаги для ответа» (всё, что в него напишем, увидит посетитель) и {{r}} - «письмо с вопросом» (что именно просит клиент). Функция {{fmt.Fprintln(w, ...)}} работает как Println, только печатает не на экран, а в ответ.

Вторая часть - маршрут: связываем путь и обработчик. {{http.HandleFunc("/hello", hello)}} значит «если пришли на /hello, вызови функцию hello».

Третья - запуск: {{http.ListenAndServe(":8080", nil)}} открывает порт 8080 и ждёт гостей. Эта строка работает, пока вы сами не остановите программу, поэтому её пишут последней.

Из запроса можно узнать подробности: {{r.Method}} - способ запроса (например, GET), {{r.URL.Path}} - путь, {{r.URL.Query().Get("name")}} - значение параметра из адреса вида {{/greet?name=Ali}}.

На этой платформе код не запускается по-настоящему, мы проверяем его по образцу. На своём компьютере сервер запускают командой {{go run main.go}}, а затем открывают адрес в браузере.
`,
    examples: R`
${F}
package main

import (
    "fmt"
    "net/http"
)

func hello(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintln(w, "Hello, Go!")
}

func main() {
    http.HandleFunc("/hello", hello)
    http.ListenAndServe(":8080", nil)
}
${F}

Запустили сервер, открыли в браузере {{localhost:8080/hello}} и увидели:

${F}
Hello, Go!
${F}

Если к ответу добавить информацию о запросе, например {{fmt.Fprintln(w, "Path:", r.URL.Path)}}, то по адресу /hello браузер покажет:

${F}
Path: /hello
${F}
`,
    tasks: [
      T({
        id: "t33", title: "Hello-сервер", imps: ['"fmt"', '"net/http"'], above: true,
        desc: R`Напишите сервер, который по адресу {{/hello}} отвечает фразой {{Hello, Go!}}. Три части: обработчик, маршрут, запуск.`,
        body: [
          ["func hello(w http.ResponseWriter, r *http.Request) {", "Обработчик hello. w - куда писать ответ, r - что спросил клиент."],
          ['    fmt.Fprintln(w, "Hello, Go!")', "Пишем фразу в ответ."],
          ["}", "Конец обработчика."],
          ["", ""],
          ["func main() {", "Начало программы."],
          ['    http.HandleFunc("/hello", hello)', "Маршрут: путь /hello обслуживает функция hello."],
          ['    http.ListenAndServe(":8080", nil)', "Запускаем сервер на порту 8080. Всегда последняя строка."],
          ["}", "Конец программы."],
        ],
        output: "Hello, Go!", hint: "Параметры обработчика всегда одни и те же: w http.ResponseWriter, r *http.Request.",
        checks: [
          { re: /func\s+hello\(\s*w\s+http\.ResponseWriter\s*,\s*r\s+\*http\.Request\s*\)\s*\{/, msg: "func hello(w http.ResponseWriter, r *http.Request) {" },
          { re: /fmt\.Fprintln\(\s*w\s*,\s*"Hello, Go!"\s*\)/, msg: 'fmt.Fprintln(w, "Hello, Go!")' },
          { re: /http\.HandleFunc\(\s*"\/hello"\s*,\s*hello\s*\)/, msg: 'http.HandleFunc("/hello", hello)' },
          { re: /http\.ListenAndServe\(\s*":8080"\s*,\s*nil\s*\)/, msg: 'http.ListenAndServe(":8080", nil)' },
        ],
      }),
      T({
        id: "t34", title: "Способ запроса", imps: ['"fmt"', '"net/http"'], above: true,
        desc: R`Напишите сервер, который по адресу {{/info}} сообщает, каким способом к нему обратились.`,
        body: [
          ["func info(w http.ResponseWriter, r *http.Request) {", "Обработчик info."],
          ['    fmt.Fprintln(w, "Method:", r.Method)', "r.Method - способ запроса. Из браузера обычно приходит GET."],
          ["}", "Конец обработчика."],
          ["", ""],
          ["func main() {", "Начало программы."],
          ['    http.HandleFunc("/info", info)', "Маршрут: /info обслуживает info."],
          ['    http.ListenAndServe(":8080", nil)', "Запуск сервера."],
          ["}", "Конец программы."],
        ],
        output: "Method: GET", hint: "Способ запроса лежит в r.Method. Пишите его без кавычек - это не текст, а значение.",
        checks: [
          { re: /func\s+info\(\s*w\s+http\.ResponseWriter\s*,\s*r\s+\*http\.Request\s*\)\s*\{/, msg: "func info(w http.ResponseWriter, r *http.Request) {" },
          { re: /fmt\.Fprintln\(\s*w\s*,\s*"Method:"\s*,\s*r\.Method\s*\)/, msg: 'fmt.Fprintln(w, "Method:", r.Method)' },
          { re: /http\.HandleFunc\(\s*"\/info"\s*,\s*info\s*\)/, msg: 'http.HandleFunc("/info", info)' },
          { re: /http\.ListenAndServe\(\s*":8080"\s*,\s*nil\s*\)/, msg: 'http.ListenAndServe(":8080", nil)' },
        ],
      }),
      T({
        id: "t35", title: "Приветствие по имени", hard: true, imps: ['"fmt"', '"net/http"'], above: true,
        desc: R`Напишите сервер, который по адресу {{/greet?name=Ali}} отвечает {{Hello, Ali}}: имя берётся из параметра {{name}} в адресе. Для другого имени ответ должен меняться.`,
        plan: [
          "Напишите обработчик greet с теми же двумя параметрами (w и r).",
          "Достаньте имя из адреса: name := r.URL.Query().Get(\"name\").",
          "Напишите в ответ: Hello, и имя (через fmt.Fprintln).",
          "В main свяжите путь /greet с обработчиком и запустите сервер на порту 8080.",
        ],
        body: [
          ["func greet(w http.ResponseWriter, r *http.Request) {", "Обработчик greet."],
          ['    name := r.URL.Query().Get("name")', "Достаём из адреса параметр name."],
          ['    fmt.Fprintln(w, "Hello,", name)', "Пишем приветствие с этим именем."],
          ["}", "Конец обработчика."],
          ["", ""],
          ["func main() {", "Начало программы."],
          ['    http.HandleFunc("/greet", greet)', "Маршрут /greet."],
          ['    http.ListenAndServe(":8080", nil)', "Запуск сервера."],
          ["}", "Конец программы."],
        ],
        output: "Hello, Ali", hint: "Параметр из адреса достаётся так: r.URL.Query().Get(\"name\"). Результат положите в переменную.",
        checks: [
          { re: /func\s+greet\(\s*\w+\s+http\.ResponseWriter\s*,\s*\w+\s+\*http\.Request\s*\)\s*\{/, msg: "func greet(w http.ResponseWriter, r *http.Request) {" },
          { re: /\w+\s*:=\s*\w+\.URL\.Query\(\)\.Get\(\s*"name"\s*\)/, msg: 'name := r.URL.Query().Get("name")' },
          { re: /fmt\.Fprintln\(\s*\w+\s*,\s*"Hello,"\s*,\s*\w+\s*\)/, msg: 'fmt.Fprintln(w, "Hello,", name)' },
          { re: /http\.HandleFunc\(\s*"\/greet"\s*,\s*greet\s*\)/, msg: 'http.HandleFunc("/greet", greet)' },
          { re: /http\.ListenAndServe\(\s*":8080"\s*,\s*nil\s*\)/, msg: 'http.ListenAndServe(":8080", nil)' },
        ],
      }),
    ],
  },

  // ======================================================= 16
  {
    id: 16, title: "REST API",
    about: "как устроить API по правилам: адреса, методы GET и POST, статус-коды",
    theory: R`
REST - не программа и не библиотека, а договорённость о том, как удобно устроить общение с сервером. Идея простая: адрес - это «предмет», а способ запроса - «действие».

Например, адрес {{/todos}} - это список дел. Что с ним сделать, говорит метод HTTP:

${F}
GET     /todos     получить список дел
POST    /todos     создать новое дело
PUT     /todos/1   изменить дело номер 1
DELETE  /todos/1   удалить дело номер 1
${F}

Сервер отвечает данными в формате JSON и статус-кодом - числом, которое коротко говорит, как всё прошло:

${F}
200 OK                   всё хорошо
201 Created              создано
400 Bad Request          клиент прислал что-то неправильное
404 Not Found            такого нет
405 Method Not Allowed   такой способ здесь не разрешён
${F}

Как это выглядит в Go. Отдать список в формате JSON:

${F}
func todos(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(list)
}
${F}

Первая строка внутри - заголовок, пометка для клиента «дальше идёт JSON». А {{json.NewEncoder(w).Encode(list)}} превращает данные в JSON и сразу пишет в ответ.

Статус задаётся через {{w.WriteHeader(http.StatusCreated)}} (это 201). Его вызывают до того, как что-то написано в ответ.

Способ запроса проверяют через {{r.Method}}:

${F}
if r.Method != http.MethodPost {
    w.WriteHeader(http.StatusMethodNotAllowed)
    return
}
${F}

Читается так: если способ запроса не POST, ответь «405, не разрешено» и закончи работу обработчика.
`,
    examples: R`
${F}
package main

import (
    "encoding/json"
    "net/http"
)

type Todo struct {
    ID    int    ${BT}json:"id"${BT}
    Title string ${BT}json:"title"${BT}
}

func todos(w http.ResponseWriter, r *http.Request) {
    list := []Todo{{ID: 1, Title: "Learn Go"}}
    json.NewEncoder(w).Encode(list)
}

func main() {
    http.HandleFunc("/todos", todos)
    http.ListenAndServe(":8080", nil)
}
${F}

Запрос {{GET /todos}} вернёт:

${F}
[{"id":1,"title":"Learn Go"}]
${F}

Квадратные скобки - потому что это список (срез), а внутри него одно дело.
`,
    tasks: [
      T({
        id: "t36", title: "Список дел в JSON", imps: ['"encoding/json"', '"net/http"'], above: true,
        desc: R`Напишите сервер, который по адресу {{/todos}} отдаёт список дел в формате JSON. Совет: кликайте по строкам в таблице ниже.`,
        body: [
          ["type Todo struct {", "Описание дела."],
          ["    ID    int    " + BT + 'json:"id"' + BT, "Номер дела."],
          ["    Title string " + BT + 'json:"title"' + BT, "Название дела."],
          ["}", "Конец описания."],
          ["", ""],
          ["func todos(w http.ResponseWriter, r *http.Request) {", "Обработчик для /todos."],
          ['    list := []Todo{{ID: 1, Title: "Learn Go"}}', "Список из одного дела."],
          ["    json.NewEncoder(w).Encode(list)", "Превращаем список в JSON и пишем в ответ."],
          ["}", "Конец обработчика."],
          ["", ""],
          ["func main() {", "Начало программы."],
          ['    http.HandleFunc("/todos", todos)', "Маршрут /todos."],
          ['    http.ListenAndServe(":8080", nil)', "Запуск сервера."],
          ["}", "Конец программы."],
        ],
        output: '[{"id":1,"title":"Learn Go"}]', hint: "Encode принимает данные, которые нужно превратить в JSON, а w - куда писать.",
        checks: [
          { re: /type\s+Todo\s+struct\s*\{[^}]*ID\s+int[^}]*Title\s+string/, msg: "type Todo struct с полями ID int и Title string" },
          { re: /func\s+todos\(\s*\w+\s+http\.ResponseWriter\s*,\s*\w+\s+\*http\.Request\s*\)/, msg: "func todos(w http.ResponseWriter, r *http.Request) {" },
          { re: /\[\]Todo\{\s*\{\s*ID:\s*1\s*,\s*Title:\s*"Learn Go"\s*\}\s*\}/, msg: 'list := []Todo{{ID: 1, Title: "Learn Go"}}' },
          { re: /json\.NewEncoder\(\s*w\s*\)\.Encode\(\s*list\s*\)/, msg: "json.NewEncoder(w).Encode(list)" },
          { re: /http\.HandleFunc\(\s*"\/todos"\s*,\s*todos\s*\)/, msg: 'http.HandleFunc("/todos", todos)' },
          { re: /http\.ListenAndServe\(\s*":8080"\s*,\s*nil\s*\)/, msg: 'http.ListenAndServe(":8080", nil)' },
        ],
      }),
      T({
        id: "t37", title: "Заголовок Content-Type", imps: ['"fmt"', '"net/http"'], above: true,
        desc: R`Напишите сервер, который по адресу {{/status}} отвечает JSON-текстом {{{"ok":true}}} и сообщает клиенту, что это именно JSON.`,
        body: [
          ["func status(w http.ResponseWriter, r *http.Request) {", "Обработчик status."],
          ['    w.Header().Set("Content-Type", "application/json")', "Заголовок: «дальше идёт JSON». Ставится до тела ответа."],
          ["    fmt.Fprintln(w, " + BT + '{"ok":true}' + BT + ")", "Пишем JSON-текст. Обратные кавычки позволяют не прятать внутренние кавычки."],
          ["}", "Конец обработчика."],
          ["", ""],
          ["func main() {", "Начало программы."],
          ['    http.HandleFunc("/status", status)', "Маршрут /status."],
          ['    http.ListenAndServe(":8080", nil)', "Запуск сервера."],
          ["}", "Конец программы."],
        ],
        output: '{"ok":true}', hint: "Заголовок ставится через w.Header().Set(имя, значение), и делать это нужно раньше, чем писать ответ.",
        checks: [
          { re: /func\s+status\(\s*\w+\s+http\.ResponseWriter\s*,\s*\w+\s+\*http\.Request\s*\)\s*\{/, msg: "func status(w http.ResponseWriter, r *http.Request) {" },
          { re: /w\.Header\(\)\.Set\(\s*"Content-Type"\s*,\s*"application\/json"\s*\)/, msg: 'w.Header().Set("Content-Type", "application/json")' },
          { re: /fmt\.Fprintln\(\s*w\s*,\s*`\{\s*"ok"\s*:\s*true\s*\}`\s*\)/, msg: 'fmt.Fprintln(w, `{"ok":true}`)' },
          { re: /http\.HandleFunc\(\s*"\/status"\s*,\s*status\s*\)/, msg: 'http.HandleFunc("/status", status)' },
          { re: /http\.ListenAndServe\(\s*":8080"\s*,\s*nil\s*\)/, msg: 'http.ListenAndServe(":8080", nil)' },
        ],
      }),
      T({
        id: "t38", title: "Только POST", hard: true, imps: ['"fmt"', '"net/http"'], above: true,
        desc: R`Напишите обработчик {{create}} для адреса {{/todos}}, который принимает только запросы POST. На POST он отвечает статусом 201 и словом {{created}}. На любой другой способ (например, GET) отвечает статусом 405 и ничего не пишет.`,
        plan: [
          "Напишите обработчик create с параметрами w и r.",
          "Проверьте: если r.Method не равен http.MethodPost, поставьте статус http.StatusMethodNotAllowed и выйдите через return.",
          "Если проверка прошла, поставьте статус http.StatusCreated и напишите в ответ слово created.",
          "В main свяжите /todos с обработчиком и запустите сервер на порту 8080.",
        ],
        body: [
          ["func create(w http.ResponseWriter, r *http.Request) {", "Обработчик create."],
          ["    if r.Method != http.MethodPost {", "Если способ запроса - не POST..."],
          ["        w.WriteHeader(http.StatusMethodNotAllowed)", "...ставим статус 405 (такой способ не разрешён)..."],
          ["        return", "...и сразу выходим из обработчика."],
          ["    }", "Конец условия."],
          ["    w.WriteHeader(http.StatusCreated)", "Это POST: ставим статус 201 (создано)."],
          ['    fmt.Fprintln(w, "created")', "Пишем слово created."],
          ["}", "Конец обработчика."],
          ["", ""],
          ["func main() {", "Начало программы."],
          ['    http.HandleFunc("/todos", create)', "Маршрут /todos."],
          ['    http.ListenAndServe(":8080", nil)', "Запуск сервера."],
          ["}", "Конец программы."],
        ],
        output: "POST /todos - 201 created\nGET /todos - 405", hint: "Условие читается так: if r.Method != http.MethodPost. Внутри него - статус 405 и return.",
        checks: [
          { re: /func\s+create\(\s*\w+\s+http\.ResponseWriter\s*,\s*\w+\s+\*http\.Request\s*\)\s*\{/, msg: "func create(w http.ResponseWriter, r *http.Request) {" },
          { re: /if\s+\w+\.Method\s*!=\s*http\.MethodPost/, msg: "Проверка способа: if r.Method != http.MethodPost {" },
          { re: /\w+\.WriteHeader\(\s*http\.StatusMethodNotAllowed\s*\)/, msg: "Для не-POST: w.WriteHeader(http.StatusMethodNotAllowed)" },
          { re: /return/, msg: "После статуса 405 нужен return" },
          { re: /\w+\.WriteHeader\(\s*http\.StatusCreated\s*\)/, msg: "Для POST: w.WriteHeader(http.StatusCreated)" },
          { re: /fmt\.Fprintln\(\s*\w+\s*,\s*"created"\s*\)/, msg: 'fmt.Fprintln(w, "created")' },
          { re: /http\.HandleFunc\(\s*"\/todos"\s*,\s*create\s*\)/, msg: 'http.HandleFunc("/todos", create)' },
          { re: /http\.ListenAndServe\(\s*":8080"\s*,\s*nil\s*\)/, msg: 'http.ListenAndServe(":8080", nil)' },
        ],
      }),
    ],
  },

  // ======================================================= 17
  {
    id: 17, title: "Базы данных и SQL",
    about: "как сохранять данные надолго: таблицы, SQL и пакет database/sql",
    theory: R`
Пока программа работает, данные живут в памяти. Выключили - всё пропало. Чтобы данные сохранялись, их кладут в базу данных - специальную программу, которая хранит информацию на диске и умеет быстро её искать.

Проще всего представить базу как таблицу из Excel. У таблицы есть столбцы (что хранится: номер, имя) и строки (сами записи):

${F}
users
id | name
1  | Ali
2  | Dana
${F}

Общаться с базой помогает язык SQL. Его команды похожи на английские фразы:

${F}
CREATE TABLE users (id INTEGER, name TEXT)    создать таблицу
INSERT INTO users (id, name) VALUES (?, ?)    добавить строку
SELECT name FROM users WHERE id = ?           выбрать имя по номеру
SELECT COUNT(*) FROM users                    посчитать строки
${F}

Знак {{?}} - место для значения. Значения передаются отдельно, так безопаснее: хакер не сможет подсунуть вместо имени свою команду.

В Go с базой работает пакет {{database/sql}}. Ему нужен драйвер - переводчик для конкретной базы. Мы берём SQLite: она хранится в одном файле. Драйвер подключают строкой со знаком {{_}}: напрямую мы его не вызываем, он работает за кулисами. На своём компьютере его ставят командой {{go get github.com/mattn/go-sqlite3}}.

${F}
db, _ := sql.Open("sqlite3", "app.db")
defer db.Close()
${F}

{{sql.Open}} открывает (или создаёт) файл базы {{app.db}}. Строка {{defer db.Close()}} значит «закрой базу в самом конце функции, что бы ни случилось», так принято не забывать.

Выполнить команду, на которую не нужен ответ (создать таблицу, добавить строку): {{db.Exec(...)}}. Прочитать одно значение: {{db.QueryRow(...).Scan(&name)}}. Метод Scan кладёт найденное в переменную, поэтому перед ней снова стоит {{&}}.
`,
    examples: R`
${F}
package main

import (
    "database/sql"
    _ "github.com/mattn/go-sqlite3"
    "fmt"
)

func main() {
    db, _ := sql.Open("sqlite3", "app.db")
    defer db.Close()
    db.Exec("INSERT INTO users (id, name) VALUES (?, ?)", 1, "Ali")
    var name string
    db.QueryRow("SELECT name FROM users WHERE id = ?", 1).Scan(&name)
    fmt.Println(name)
}
${F}

Результат:

${F}
Ali
${F}

Как читать: открыли базу, добавили строку (вместо двух знаков вопроса подставились 1 и "Ali"), затем выбрали имя по номеру 1 и положили его в переменную name.
`,
    tasks: [
      T({
        id: "t39", title: "Открыть базу и создать таблицу", imps: ['"database/sql"', '_ "github.com/mattn/go-sqlite3"', '"fmt"'],
        desc: R`Откройте базу, не забудьте закрыть её и создайте таблицу {{users}}.`,
        body: [
          ["func main() {", "Начало программы."],
          ['    db, err := sql.Open("sqlite3", "app.db")', "Открываем файл базы app.db. Получаем саму базу и ошибку."],
          ["    if err != nil {", "Если открыть не получилось..."],
          ['        fmt.Println("error:", err)', "...печатаем ошибку..."],
          ["        return", "...и выходим."],
          ["    }", "Конец условия."],
          ["    defer db.Close()", "Закрыть базу в самом конце main."],
          ['    db.Exec("CREATE TABLE IF NOT EXISTS users (id INTEGER, name TEXT)")', "SQL-команда: создать таблицу users, если её ещё нет."],
          ['    fmt.Println("table ready")', "Сообщаем, что таблица готова."],
          ["}", "Конец программы."],
        ],
        output: "table ready", hint: "sql.Open принимает два текста: название драйвера (\"sqlite3\") и имя файла (\"app.db\").",
        checks: [
          { re: /db\s*,\s*err\s*:=\s*sql\.Open\(\s*"sqlite3"\s*,\s*"app\.db"\s*\)/, msg: 'db, err := sql.Open("sqlite3", "app.db")' },
          { re: /if\s+err\s*!=\s*nil/, msg: "Проверьте ошибку: if err != nil {" },
          { re: /defer\s+db\.Close\(\s*\)/, msg: "defer db.Close()" },
          { re: /db\.Exec\(\s*"CREATE TABLE IF NOT EXISTS users \(id INTEGER, name TEXT\)"\s*\)/, msg: 'db.Exec("CREATE TABLE IF NOT EXISTS users (id INTEGER, name TEXT)")' },
          { re: /fmt\.Println\(\s*"table ready"\s*\)/, msg: 'fmt.Println("table ready")' },
        ],
      }),
      T({
        id: "t40", title: "Добавить и прочитать", imps: ['"database/sql"', '_ "github.com/mattn/go-sqlite3"', '"fmt"'],
        desc: R`Добавьте в таблицу строку с именем Ali и прочитайте это имя обратно.`,
        body: [
          ["func main() {", "Начало программы."],
          ['    db, _ := sql.Open("sqlite3", "app.db")', "Открываем базу. Ошибку пока пропускаем знаком _."],
          ["    defer db.Close()", "Закроем базу в конце."],
          ['    db.Exec("INSERT INTO users (id, name) VALUES (?, ?)", 1, "Ali")', "Добавляем строку. Вместо двух ? подставятся 1 и \"Ali\"."],
          ["    var name string", "Переменная, куда положим найденное имя."],
          ['    db.QueryRow("SELECT name FROM users WHERE id = ?", 1).Scan(&name)', "Выбираем имя строки с номером 1 и кладём в name. Перед name стоит &."],
          ["    fmt.Println(name)", "Печатаем: Ali."],
          ["}", "Конец программы."],
        ],
        output: "Ali", hint: "Значения для знаков ? передаются после текста запроса, через запятую, в том же порядке.",
        checks: [
          { re: /db\s*,\s*_\s*:=\s*sql\.Open\(\s*"sqlite3"\s*,\s*"app\.db"\s*\)/, msg: 'db, _ := sql.Open("sqlite3", "app.db")' },
          { re: /defer\s+db\.Close\(\s*\)/, msg: "defer db.Close()" },
          { re: /db\.Exec\(\s*"INSERT INTO users \(id, name\) VALUES \(\?, \?\)"\s*,\s*1\s*,\s*"Ali"\s*\)/, msg: 'db.Exec("INSERT INTO users (id, name) VALUES (?, ?)", 1, "Ali")' },
          { re: /var\s+name\s+string/, msg: "var name string" },
          { re: /db\.QueryRow\(\s*"SELECT name FROM users WHERE id = \?"\s*,\s*1\s*\)\.Scan\(\s*&name\s*\)/, msg: 'db.QueryRow("SELECT name FROM users WHERE id = ?", 1).Scan(&name)' },
          { re: /fmt\.Println\(\s*name\s*\)/, msg: "fmt.Println(name)" },
        ],
      }),
      T({
        id: "t41", title: "Сколько пользователей", hard: true, imps: ['"database/sql"', '_ "github.com/mattn/go-sqlite3"', '"fmt"'],
        desc: R`Узнайте, сколько строк в таблице {{users}}, и напечатайте их количество в виде {{users: 3}}.`,
        plan: [
          "Откройте базу sql.Open (драйвер sqlite3, файл app.db), ошибку можно пропустить через _.",
          "Не забудьте закрыть базу: defer db.Close().",
          "Создайте числовую переменную, например var n int.",
          "Выберите количество строк запросом SELECT COUNT(*) FROM users через QueryRow и положите в переменную методом Scan (с знаком &).",
          "Напечатайте users: и число.",
        ],
        body: [
          ["func main() {", "Начало программы."],
          ['    db, _ := sql.Open("sqlite3", "app.db")', "Открываем базу."],
          ["    defer db.Close()", "Закрываем в конце."],
          ["    var n int", "Переменная для количества."],
          ['    db.QueryRow("SELECT COUNT(*) FROM users").Scan(&n)', "COUNT(*) считает строки. Результат кладём в n."],
          ['    fmt.Println("users:", n)', "Печатаем подпись и число."],
          ["}", "Конец программы."],
        ],
        output: "users: 3", hint: "SQL-команда для подсчёта: SELECT COUNT(*) FROM users. Результат один, поэтому подходит QueryRow(...).Scan(&n).",
        checks: [
          { re: /\w+\s*,\s*\w+\s*:=\s*sql\.Open\(\s*"sqlite3"\s*,\s*"[\w.]+"\s*\)/, msg: 'Откройте базу: db, _ := sql.Open("sqlite3", "app.db")' },
          { re: /defer\s+\w+\.Close\(\s*\)/, msg: "Закройте базу: defer db.Close()" },
          { re: /var\s+\w+\s+int/, msg: "Заведите числовую переменную: var n int" },
          { re: /\w+\.QueryRow\(\s*"SELECT\s+COUNT\(\*\)\s+FROM\s+users"\s*\)/i, msg: 'QueryRow("SELECT COUNT(*) FROM users")' },
          { re: /\.Scan\(\s*&\w+\s*\)/, msg: "Положите результат в переменную: .Scan(&n)" },
          { re: /fmt\.Println\(\s*"users:"\s*,\s*\w+\s*\)/, msg: 'fmt.Println("users:", n)' },
        ],
      }),
    ],
  },

  // ======================================================= 18
  {
    id: 18, title: "Мини-проект: список дел",
    about: "как собрать всё изученное в один маленький сервис «список дел»",
    theory: R`
Финал курса - небольшой проект: сервис «список дел» (todo). Мы соберём его из того, что уже умеем: структура описывает дело, срез хранит список, JSON - формат ответа, а обработчики отвечают на запросы. Базу данных в проект не подключаем, чтобы он остался коротким: список живёт в памяти.

План проекта:

${F}
1. Описать дело: структура Todo (номер, название, сделано ли)
2. Завести список дел: срез todos
3. Обработчик GET: отдаёт список в JSON
4. Обработчик POST: принимает новое дело и добавляет в список
${F}

Список дел вынесем в переменную уровня пакета - {{var todos = ...}} вне функций. Тогда её видят все обработчики.

Новое для нас - чтение JSON из запроса. Тело запроса (то, что прислал клиент) лежит в {{r.Body}}. Декодер читает его и заполняет структуру:

${F}
var t Todo
json.NewDecoder(r.Body).Decode(&t)
todos = append(todos, t)
${F}

Это тот же Unmarshal, только читает не из готового текста, а из запроса. Знак {{&}}, как и раньше, нужен, чтобы заполнить саму переменную t. После этого дело добавляем в список через {{append}} и не забываем ответить статусом 201.

В последних двух задачах в редакторе уже будет часть проекта. Вам останется дописать недостающее.
`,
    examples: R`
Так выглядит готовый сервис целиком:

${F}
package main

import (
    "encoding/json"
    "net/http"
)

type Todo struct {
    ID    int    ${BT}json:"id"${BT}
    Title string ${BT}json:"title"${BT}
    Done  bool   ${BT}json:"done"${BT}
}

var todos = []Todo{
    {ID: 1, Title: "Learn Go", Done: true},
}

func list(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(todos)
}

func add(w http.ResponseWriter, r *http.Request) {
    var t Todo
    json.NewDecoder(r.Body).Decode(&t)
    todos = append(todos, t)
    w.WriteHeader(http.StatusCreated)
}

func main() {
    http.HandleFunc("/todos", list)
    http.HandleFunc("/add", add)
    http.ListenAndServe(":8080", nil)
}
${F}

Как с ним общаться:

${F}
GET  /todos  -> [{"id":1,"title":"Learn Go","done":true}]
POST /add    -> 201 Created
${F}

После POST новое дело появится в списке, и следующий запрос GET /todos вернёт уже два дела.
`,
    tasks: [
      T({
        id: "t42", title: "Модель и данные", imps: ['"fmt"'], above: true,
        desc: R`Шаг 1 проекта. Опишите структуру {{Todo}}, заведите список из двух дел и напечатайте, сколько в нём дел. Совет: кликайте по строкам в таблице ниже.`,
        body: [
          ...todoLines(0),
          ["", ""],
          ["func main() {", "Начало программы."],
          ["    fmt.Println(len(todos))", "Печатаем количество дел: 2."],
          ["}", "Конец программы."],
        ],
        output: "2", hint: "Каждое дело в списке - в фигурных скобках, после него запятая (даже после последнего, если он на своей строке).",
        checks: [
          { re: /type\s+Todo\s+struct\s*\{[^}]*ID\s+int[^}]*Title\s+string[^}]*Done\s+bool/, msg: "type Todo struct с полями ID int, Title string, Done bool" },
          { re: /var\s+todos\s*=\s*\[\]Todo\{/, msg: "var todos = []Todo{" },
          { re: /ID:\s*1\s*,\s*Title:\s*"Learn Go"\s*,\s*Done:\s*true/, msg: 'Первое дело: {ID: 1, Title: "Learn Go", Done: true}' },
          { re: /ID:\s*2\s*,\s*Title:\s*"Build API"\s*,\s*Done:\s*false/, msg: 'Второе дело: {ID: 2, Title: "Build API", Done: false}' },
          { re: /fmt\.Println\(\s*len\(\s*todos\s*\)\s*\)/, msg: "fmt.Println(len(todos))" },
        ],
      }),
      (() => {
        const imps = ['"encoding/json"', '"net/http"'];
        const pre = [...head(...imps), ...todoLines(1), ["", ""]];
        return T({
          id: "t43", title: "Отдать список", imps, above: true,
          desc: R`Шаг 2 проекта. Описание дела и список уже введены в редактор. Допишите обработчик {{list}}, который отдаёт список в JSON, и запустите сервер.`,
          starter: codeOf(pre) + "\nfunc main() {\n    // Пишите решение здесь (свои типы и функции добавьте выше func main)\n}\n",
          body: [
            ...todoLines(1).map(l => l),
            ["", ""],
            ["func list(w http.ResponseWriter, r *http.Request) {", "Обработчик list."],
            ['    w.Header().Set("Content-Type", "application/json")', "Помечаем: в ответе будет JSON."],
            ["    json.NewEncoder(w).Encode(todos)", "Превращаем весь список в JSON и пишем в ответ."],
            ["}", "Конец обработчика."],
            ["", ""],
            ["func main() {", "Начало программы."],
            ['    http.HandleFunc("/todos", list)', "Маршрут /todos."],
            ['    http.ListenAndServe(":8080", nil)', "Запуск сервера."],
            ["}", "Конец программы."],
          ],
          output: '[{"id":1,"title":"Learn Go","done":true},{"id":2,"title":"Build API","done":false}]',
          hint: "Обработчик похож на тот, что был в теме 16: заголовок Content-Type и json.NewEncoder(w).Encode(...).",
          checks: [
            { re: /func\s+list\(\s*\w+\s+http\.ResponseWriter\s*,\s*\w+\s+\*http\.Request\s*\)\s*\{/, msg: "func list(w http.ResponseWriter, r *http.Request) {" },
            { re: /\w+\.Header\(\)\.Set\(\s*"Content-Type"\s*,\s*"application\/json"\s*\)/, msg: 'w.Header().Set("Content-Type", "application/json")' },
            { re: /json\.NewEncoder\(\s*\w+\s*\)\.Encode\(\s*todos\s*\)/, msg: "json.NewEncoder(w).Encode(todos)" },
            { re: /http\.HandleFunc\(\s*"\/todos"\s*,\s*list\s*\)/, msg: 'http.HandleFunc("/todos", list)' },
            { re: /http\.ListenAndServe\(\s*":8080"\s*,\s*nil\s*\)/, msg: 'http.ListenAndServe(":8080", nil)' },
          ],
        });
      })(),
      (() => {
        const imps = ['"encoding/json"', '"net/http"'];
        const listFn = [
          ["func list(w http.ResponseWriter, r *http.Request) {", "Обработчик list (уже готов).", 1],
          ['    w.Header().Set("Content-Type", "application/json")', "Заголовок JSON.", 1],
          ["    json.NewEncoder(w).Encode(todos)", "Отдаём список.", 1],
          ["}", "Конец.", 1],
        ];
        const pre = [...head(...imps), ...todoLines(1), ["", ""], ...listFn, ["", ""]];
        return T({
          id: "t44", title: "Добавить дело (POST)", hard: true, imps, above: true,
          desc: R`Финальный шаг проекта. В редакторе уже есть описание дела, список и обработчик {{list}}. Напишите обработчик {{add}}: он читает новое дело из тела запроса, добавляет его в список и отвечает статусом 201. Затем зарегистрируйте маршрут {{/add}} в {{main}}.`,
          starter: codeOf(pre) + "\nfunc main() {\n    http.HandleFunc(\"/todos\", list)\n    // Пишите решение здесь (свои типы и функции добавьте выше func main)\n    http.ListenAndServe(\":8080\", nil)\n}\n",
          plan: [
            "Выше func main напишите обработчик add с теми же двумя параметрами: w http.ResponseWriter, r *http.Request.",
            "Внутри создайте пустое дело: var t Todo.",
            "Прочитайте тело запроса в это дело: json.NewDecoder(r.Body).Decode(&t).",
            "Добавьте дело в список: todos = append(todos, t).",
            "Ответьте статусом создано: w.WriteHeader(http.StatusCreated).",
            "В main добавьте строку http.HandleFunc(\"/add\", add) до ListenAndServe.",
          ],
          body: [
            ...todoLines(1),
            ["", ""],
            ...listFn,
            ["", ""],
            ["func add(w http.ResponseWriter, r *http.Request) {", "Обработчик add - принимает новое дело."],
            ["    var t Todo", "Пустая карточка дела."],
            ["    json.NewDecoder(r.Body).Decode(&t)", "Читаем JSON из тела запроса и заполняем карточку. Перед t стоит &."],
            ["    todos = append(todos, t)", "Добавляем дело в список и кладём результат обратно в todos."],
            ["    w.WriteHeader(http.StatusCreated)", "Отвечаем статусом 201 - создано."],
            ["}", "Конец обработчика."],
            ["", ""],
            ["func main() {", "Начало программы.", 1],
            ['    http.HandleFunc("/todos", list)', "Маршрут для списка (уже есть).", 1],
            ['    http.HandleFunc("/add", add)', "Новый маршрут: /add обслуживает add."],
            ['    http.ListenAndServe(":8080", nil)', "Запуск сервера (уже есть).", 1],
            ["}", "Конец программы."],
          ],
          output: 'POST /add с телом {"id":3,"title":"Test","done":false}\n-> 201 Created, а GET /todos теперь вернёт три дела',
          hint: "Обработчик add устроен как Unmarshal из темы 14, только читает из r.Body через json.NewDecoder.",
          checks: [
            { re: /func\s+add\(\s*\w+\s+http\.ResponseWriter\s*,\s*\w+\s+\*http\.Request\s*\)\s*\{/, msg: "func add(w http.ResponseWriter, r *http.Request) {" },
            { re: /var\s+\w+\s+Todo/, msg: "var t Todo" },
            { re: /json\.NewDecoder\(\s*\w+\.Body\s*\)\.Decode\(\s*&\w+\s*\)/, msg: "json.NewDecoder(r.Body).Decode(&t)" },
            { re: /todos\s*=\s*append\(\s*todos\s*,\s*\w+\s*\)/, msg: "todos = append(todos, t)" },
            { re: /\w+\.WriteHeader\(\s*http\.StatusCreated\s*\)/, msg: "w.WriteHeader(http.StatusCreated)" },
            { re: /http\.HandleFunc\(\s*"\/add"\s*,\s*add\s*\)/, msg: 'В main: http.HandleFunc("/add", add)' },
          ],
        });
      })(),
    ],
  },
);

// ---------- мини-тесты ----------
Object.assign(QUIZ, {
  11: [
    { q: "Как прочитать значение по ключу {{\"Ali\"}} из мапа {{ages}}?", o: ["{{ages[\"Ali\"]}}", "{{ages.Ali}}", "{{ages(\"Ali\")}}"], why: "Ключ пишется в квадратных скобках, как номер у среза: {{ages[\"Ali\"]}}." },
    { q: "Что вернёт мап, если спросить ключ, которого в нём нет?", o: ["Нулевое значение типа (для int - 0)", "Ошибку, и программа остановится", "Последнее добавленное значение"], why: "Мап не ругается: отдаёт 0, пустую строку и т. п. Чтобы отличить это от настоящего значения, используют {{value, ok := m[key]}}." },
  ],
  12: [
    { q: "Что описывает слово {{struct}}?", o: ["«Карточку» с несколькими полями", "Повторяющийся цикл", "Подключение пакета"], why: "Структура собирает связанные данные (имя, возраст...) в один тип." },
    { q: "Как прочитать поле {{Name}} у переменной {{u}}?", o: ["{{u.Name}}", "{{u[Name]}}", "{{u->Name}}"], why: "Поля читаются через точку: {{u.Name}}." },
  ],
  13: [
    { q: "Что значит {{err != nil}}?", o: ["Ошибка произошла", "Ошибки нет", "Ошибку нужно удалить"], why: "{{nil}} - «пусто». Если ошибка не пустая, значит, что-то пошло не так." },
    { q: "Что функция возвращает вместо ошибки, если всё прошло хорошо?", o: ["{{nil}}", "{{0}}", "{{false}}"], why: "Ошибки нет - значит, значение типа error пустое, то есть {{nil}}." },
  ],
  14: [
    { q: "Что такое JSON?", o: ["Текстовый формат для обмена данными", "Язык программирования", "Тип переменной в Go"], why: "JSON - просто текст определённого вида. Его понимают все языки программирования." },
    { q: "Что делает {{json.Marshal}}?", o: ["Превращает структуру в JSON-текст", "Читает JSON и заполняет структуру", "Печатает текст на экране"], why: "Marshal - «упаковать». Обратное действие называется {{Unmarshal}}." },
  ],
  15: [
    { q: "Что делает {{http.HandleFunc(\"/hello\", hello)}}?", o: ["Связывает путь /hello с функцией hello", "Запускает сервер", "Печатает hello на экране"], why: "Это маршрут: «если пришли на /hello, вызови hello». Запускает сервер другая строка - {{ListenAndServe}}." },
    { q: "Для чего нужен параметр {{w}} в обработчике?", o: ["Туда пишется ответ клиенту", "Там лежит запрос клиента", "Это номер порта"], why: "{{w}} - «лист бумаги для ответа». А запрос лежит в {{r}}." },
  ],
  16: [
    { q: "Какой метод HTTP используют, чтобы получить данные?", o: ["GET", "POST", "DELETE"], why: "GET - «покажи». POST создаёт, DELETE удаляет." },
    { q: "Что значит статус-код 404?", o: ["Такого адреса или записи нет", "Всё прошло успешно", "Ошибка внутри сервера"], why: "404 Not Found - «не найдено». Успех - это 200 или 201." },
  ],
  17: [
    { q: "Для чего нужен SQL?", o: ["Чтобы давать команды базе данных", "Чтобы рисовать интерфейс", "Чтобы запускать сервер"], why: "SQL - язык запросов к базе: создать таблицу, добавить строку, найти запись." },
    { q: "Зачем в SQL-запросе знак {{?}}?", o: ["Это место, куда безопасно подставляется значение", "Это вопрос к пользователю", "Это знак ошибки"], why: "Значения передаются отдельно от команды. Так никто не сможет подсунуть в запрос чужую команду." },
  ],
  18: [
    { q: "Где лежит то, что клиент прислал в POST-запросе?", o: ["В {{r.Body}}", "В {{w}}", "В {{fmt}}"], why: "{{r}} - запрос, а {{r.Body}} - его тело. Из него декодер и читает JSON." },
    { q: "Зачем переменную {{todos}} объявляют вне функций?", o: ["Чтобы её видели все обработчики", "Чтобы она занимала меньше памяти", "Так требует компилятор Go"], why: "Переменная, объявленная внутри функции, видна только в ней. Вынесли наружу - доступна всем." },
  ],
});
TOPICS.forEach(t => { if (t.id > 10) t.quiz = QUIZ[t.id]; });

// ---------- глоссарий ----------
GLOSSARY.push(
  ["мап", "Словарь: хранит пары «ключ → значение». По ключу значение находится мгновенно."],
  ["структур", "«Карточка» из нескольких полей разных типов, например имя и возраст человека."],
  ["json", "Текстовый формат обмена данными: {\"name\":\"Ali\"}. Его понимают все языки программирования."],
  ["обработчик", "Функция, которая отвечает на запрос клиента."],
  ["сервер", "Программа, которая ждёт запросы от других программ (например, браузера) и отвечает на них."],
  ["http", "Правила, по которым браузер и сервер обмениваются запросами и ответами."],
  ["rest", "Договорённость о том, как строить API: адрес - это «предмет», метод запроса - «действие»."],
  ["api", "Набор адресов, по которым одна программа может обращаться к другой."],
  ["статус-код", "Число в ответе сервера: 200 - всё хорошо, 404 - не найдено, 500 - ошибка сервера."],
  ["баз\\p{L}* данных", "Программа, которая надёжно хранит данные на диске и умеет быстро их искать."],
  ["sql", "Язык команд для базы данных: создать таблицу, добавить строку, найти запись."],
);
