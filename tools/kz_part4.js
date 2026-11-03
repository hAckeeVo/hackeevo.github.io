// tools/kz_part4.js: Темы 20-24 (Backend, Web, DB) на казахском языке
const R = String.raw;

module.exports = {
  20: {
    title: "JSON деректер форматы",
    about: "құрылымдарды JSON-ға айналдыру және желілік деректермен алмасу",
    theory: R`
JSON (JavaScript Object Notation) — бұл бүкіл әлемдегі веб-сервистер арасында дерек алмасуға арналған ең танымал мәтіндік формат.

Go тіліндегі стандартты {{encoding/json}} пакеті:
- {{json.Marshal(v)}}: Go құрылымын JSON мәтініне (байттарына) айналдырады (Serialization / Сериализация).
- {{json.Unmarshal(data, &v)}}: JSON мәтінін кері Go құрылымына көшіреді (Deserialization).

Маңызды ереже:
JSON-ға шығуы тиіс құрылым өрістері міндетті түрде **бас әріппен** басталуы керек (экспортталатын болуы тиіс). Өрістердің JSON ішінде қалай аталатынын тегтер арқылы көрсетеміз:
\`\`\`
type User struct {
    Name string \`json:"name"\`
    Age  int    \`json:"age"\`
}
\`\`\`
`,
    examples: R`
\`\`\`
package main

import (
    "encoding/json"
    "fmt"
)

type User struct {
    Name string \`json:"name"\`
}

func main() {
    u := User{Name: "Aru"}
    b, _ := json.Marshal(u)
    fmt.Println(string(b)) // {"name":"Aru"}
}
\`\`\`
`,
    quiz: [
      {
        q: "Go құрылымын JSON-ға айналдыру үшін қай функция қолданылады?",
        o: ["json.Marshal", "json.Unmarshal", "json.Encode"],
        why: "{{json.Marshal}} құрылымды JSON байттарына айналдырады."
      },
      {
        q: "Құрылым өрістері JSON-ға дұрыс шығуы үшін олар қалай жазылуы керек?",
        o: ["Бас әріппен басталуы тиіс (мысалы: Name)", "Тек кіші әріппен", "Кез келген әріппен бола береді"],
        why: "Go-да тек бас әріптен басталған өрістер ғана басқа пакеттерге (json-ға) көрінеді."
      }
    ],
    tasks: {
      "t30": {
        title: "Құрылымды JSON-ға айналдыру",
        desc: R`User нысанын {{json.Marshal}} арқылы JSON-ға айналдырып, мәтін ретінде басып шығарыңыз.`,
        lines: [
          ["package main", "Қаңқа."],
          ["", ""],
          ['import (', "Импорт."],
          ['    "encoding/json"', "JSON пакеті."],
          ['    "fmt"', "fmt пакеті."],
          [")", "Соңы."],
          ["", ""],
          ["type User struct {", "User құрылымы."],
          ['    Name string `json:"name"`', "Name өрісі."],
          ["}", "Соңы."],
          ["", ""],
          ["func main() {", "main басталуы."],
          ['    u := User{Name: "Aru"}', "Пайдаланушы нысаны."],
          ["    data, _ := json.Marshal(u)", "JSON-ға айналдырамыз."],
          ["    fmt.Println(string(data))", "Мәтін ретінде шығарамыз."],
          ["}", "main соңы."]
        ],
        hint: "string(data) арқылы байттарды адам оқи алатын мәтінге айналдырамыз.",
        checks: [
          '"encoding/json"',
          "type User struct {",
          "json.Marshal(u)",
          "string(data)",
          '{"name":"Aru"}'
        ]
      },
      "t31": {
        title: "JSON-ды құрылымға оқу",
        desc: R`JSON мәтінін {{json.Unmarshal}} арқылы Go құрылымына оқып, өрісті басып шығарыңыз.`,
        lines: [
          ["package main", "Қаңқа."],
          ["", ""],
          ['import (', "Импорт."],
          ['    "encoding/json"', "JSON пакеті."],
          ['    "fmt"', "fmt пакеті."],
          [")", "Соңы."],
          ["", ""],
          ["type User struct {", "Құрылым."],
          ['    Name string `json:"name"`', "Өріс."],
          ["}", "Соңы."],
          ["", ""],
          ["func main() {", "main басталуы."],
          ['    jsonStr := `{"name":"Aru"}`', "JSON мәтіні."],
          ["    var u User", "Бос құрылым."],
          ["    json.Unmarshal([]byte(jsonStr), &u)", "Мәліметтерді &u ішіне оқимыз."],
          ["    fmt.Println(u.Name)", "Aru шығарамыз."],
          ["}", "main соңы."]
        ],
        hint: "json.Unmarshal функциясына құрылымның нұсқағышы &u берілуі керек.",
        checks: [
          '"encoding/json"',
          "type User struct {",
          "json.Unmarshal([]byte(jsonStr), &u)",
          "fmt.Println(u.Name)"
        ]
      },
      "t32": {
        title: "Кітапты JSON-ға кодтау",
        desc: R`Title және Year өрістері бар Book құрылымын жасап, оны JSON түрінде басып шығарыңыз.`,
        plan: [
          "Book құрылымын Title string және Year int өрістерімен сипаттаңыз",
          "JSON тегтерін қойыңыз: `json:\"title\"` және `json:\"year\"`",
          "main ішінде Book нысанын жасаңыз",
          "json.Marshal арқылы кодтап, string(data) шығарыңыз"
        ],
        lines: [
          ["package main", "Қаңқа."],
          ["", ""],
          ['import (', "Импорт."],
          ['    "encoding/json"', "JSON пакеті."],
          ['    "fmt"', "fmt пакеті."],
          [")", "Соңы."],
          ["", ""],
          ["type Book struct {", "Book құрылымы."],
          ['    Title string `json:"title"`', "Атауы."],
          ['    Year  int    `json:"year"`', "Жылы."],
          ["}", "Соңы."],
          ["", ""],
          ["func main() {", "main басталуы."],
          ['    b := Book{Title: "Go Guide", Year: 2026}', "Кітап нысаны."],
          ["    data, _ := json.Marshal(b)", "Кодтаймыз."],
          ["    fmt.Println(string(data))", "Шығарамыз."],
          ["}", "main соңы."]
        ],
        hint: "Өрістердің бас әріппен жазылғанын және JSON тегтерін тексеріңіз.",
        checks: [
          "type Book struct {",
          "Title string",
          "Year  int",
          "json.Marshal(b)",
          "fmt.Println(string(data))"
        ]
      }
    }
  },

  21: {
    title: "HTTP-сервер",
    about: "Go-да веб-сервер көтеру және сұраныстарды қабылдау",
    theory: R`
Go тілінде сырттан ешқандай қосымша фреймворк орнатпай-ақ, стандартты {{net/http}} пакеті арқылы қуатты веб-сервер жасауға болады!

Веб-сервер қалай жұмыс істейді:
1. Белгілі бір URL жолына (маршрутқа) жауап беретін өңдеуші (handler) тіркейміз:
{{http.HandleFunc("/hello", handler)}}
2. Серверді белгілі бір портта тыңдауға қосамыз:
{{http.ListenAndServe(":8080", nil)}}

Өңдеуші функция екі маңызды параметр алады:
- {{w http.ResponseWriter}}: клиентке (браузерге) жауап қайтаруға арналған құрал.
- {{r *http.Request}}: келген сұраныс туралы барлық ақпарат (URL, әдіс GET/POST, тақырыптар).
`,
    examples: R`
\`\`\`
package main

import (
    "fmt"
    "net/http"
)

func hello(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintln(w, "Salem, Alem!")
}

func main() {
    http.HandleFunc("/hello", hello)
    // http.ListenAndServe(":8080", nil)
}
\`\`\`
`,
    quiz: [
      {
        q: "Клиентке (браузерге) жауап жіберу үшін қандай параметр қолданылады?",
        o: ["http.ResponseWriter", "http.Request", "http.Server"],
        why: "{{ResponseWriter}} жауап жазу үшін жауап береді."
      },
      {
        q: "Сұраныстың HTTP-әдісін (GET немесе POST) қай өрістен көруге болады?",
        o: ["r.Method өрісінен", "r.Header өрісінен", "w.Method өрісінен"],
        why: "{{r.Method}} сұраныстың әдісін жол түрінде сақтайды (мысалы, \"GET\")."
      }
    ],
    tasks: {
      "t33": {
        title: "Hello-сервер",
        desc: R`"Hello, Web!" жауабын қайтаратын өңдеушіні {{http.HandleFunc}} арқылы тіркеңіз.`,
        lines: [
          ["package main", "Қаңқа."],
          ["", ""],
          ['import (', "Импорт."],
          ['    "fmt"', "fmt."],
          ['    "net/http"', "net/http пакеті."],
          [")", "Соңы."],
          ["", ""],
          ["func handler(w http.ResponseWriter, r *http.Request) {", "HTTP өңдеуші."],
          ['    fmt.Fprintln(w, "Hello, Web!")', "Браузерге мәтін жазамыз."],
          ["}", "Өңдеуші соңы."],
          ["", ""],
          ["func main() {", "main басталуы."],
          ['    http.HandleFunc("/", handler)', "Түбірлік маршрутқа тіркейміз."],
          ["}", "main соңы."]
        ],
        hint: "fmt.Fprintln(w, ...) жауапты тікелей ResponseWriter-ге жібереді.",
        checks: [
          '"net/http"',
          "func handler(w http.ResponseWriter, r *http.Request)",
          'fmt.Fprintln(w, "Hello, Web!")',
          'http.HandleFunc("/", handler)'
        ]
      },
      "t34": {
        title: "Сұраныс әдісі",
        desc: R`Келген сұраныстың әдісін (r.Method) тексеріп, жауапқа шығарыңыз.`,
        lines: [
          ["package main", "Қаңқа."],
          ["", ""],
          ['import (', "Импорт."],
          ['    "fmt"', "fmt."],
          ['    "net/http"', "net/http."],
          [")", "Соңы."],
          ["", ""],
          ["func handler(w http.ResponseWriter, r *http.Request) {", "Өңдеуші."],
          ['    fmt.Fprintf(w, "Method: %s", r.Method)', "Сұраныс әдісін шығарамыз."],
          ["}", "Соңы."],
          ["", ""],
          ["func main() {", "main басталуы."],
          ['    http.HandleFunc("/method", handler)', "Маршрут."],
          ["}", "main соңы."]
        ],
        hint: "r.Method сұраныстың әдісін (GET, POST) береді.",
        checks: [
          "func handler(w http.ResponseWriter, r *http.Request)",
          "r.Method",
          'http.HandleFunc("/method", handler)'
        ]
      },
      "t35": {
        title: "Аты бойынша сәлемдесу",
        desc: R`URL параметрлерінен (Query) атын оқып, сәлемдесетін өңдеуші жасаңыз.`,
        plan: [
          "handler(w http.ResponseWriter, r *http.Request) функциясын сипаттаңыз",
          "name := r.URL.Query().Get(\"name\") арқылы атын алыңыз",
          "fmt.Fprintf(w, \"Hello, %s!\", name) арқылы жауап қайтарыңыз",
          "http.HandleFunc(\"/greet\", handler) тіркеңіз"
        ],
        lines: [
          ["package main", "Қаңқа."],
          ["", ""],
          ['import (', "Импорт."],
          ['    "fmt"', "fmt."],
          ['    "net/http"', "net/http."],
          [")", "Соңы."],
          ["", ""],
          ["func handler(w http.ResponseWriter, r *http.Request) {", "Өңдеуші."],
          ['    name := r.URL.Query().Get("name")', "name параметрін оқимыз."],
          ['    fmt.Fprintf(w, "Hello, %s!", name)', "Сәлемдесеміз."],
          ["}", "Соңы."],
          ["", ""],
          ["func main() {", "main басталуы."],
          ['    http.HandleFunc("/greet", handler)', "/greet бағытына қосамыз."],
          ["}", "main соңы."]
        ],
        hint: 'r.URL.Query().Get("name") URL ішіндегі ?name=... мәнін алады.',
        checks: [
          "func handler(w http.ResponseWriter, r *http.Request)",
          'r.URL.Query().Get("name")',
          'http.HandleFunc("/greet", handler)'
        ]
      }
    }
  },

  22: {
    title: "REST API жасау",
    about: "GET/POST сұраныстары, JSON жауаптары және маршрутизация",
    theory: R`
REST API — бұл қосымшалардың өзара деректермен алмасуына арналған заманауи стандарт.

REST API ережелері:
1. **HTTP әдістерінің мағынасы**:
   - {{GET}}: деректерді тек оқып алу;
   - {{POST}}: жаңа дерек құру немесе жіберу;
   - {{DELETE}}: деректі өшіру.
2. **Тақырыптар (Headers)**: клиентке JSON жіберіп жатқанымызды хабарлау үшін арнайы тақырып қоямыз:
{{w.Header().Set("Content-Type", "application/json")}}
3. **Статус кодтары**:
   - {{200 OK}} — сәтті орындалды;
   - {{201 Created}} — жаңа жазба сәтті құрылды;
   - {{400 Bad Request}} — қате сұраныс;
   - {{405 Method Not Allowed}} — сұраныс әдісіне рұқсат жоқ.
`,
    examples: R`
\`\`\`
package main

import (
    "encoding/json"
    "net/http"
)

func apiHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func main() {
    http.HandleFunc("/api/status", apiHandler)
}
\`\`\`
`,
    quiz: [
      {
        q: "Клиентке жауаптың JSON форматында екенін хабарлау үшін қандай Content-Type қойылады?",
        o: ["application/json", "text/html", "application/xml"],
        why: "JSON API-дің стандарты — {{Content-Type: application/json}}."
      },
      {
        q: "Жаңа жазба сәтті жасалғанда қай HTTP мәртебе коды қайтарылады?",
        o: ["201 Created", "200 OK", "404 Not Found"],
        why: "Жаңа ресурс сәтті жасалғанда әдетте {{201 Created}} коды қолданылады."
      }
    ],
    tasks: {
      "t36": {
        title: "Тапсырмалар тізімі JSON түрінде",
        desc: R`Todo құрылымдарының тілімін JSON түрінде браузерге қайтаратын API өңдеушісін жазыңыз.`,
        lines: [
          ["package main", "Қаңқа."],
          ["", ""],
          ['import (', "Импорт."],
          ['    "encoding/json"', "JSON."],
          ['    "net/http"', "HTTP."],
          [")", "Соңы."],
          ["", ""],
          ["type Todo struct {", "Todo құрылымы."],
          ['    ID    int    `json:"id"`', "ID."],
          ['    Title string `json:"title"`', "Атауы."],
          ["}", "Соңы."],
          ["", ""],
          ["func todosHandler(w http.ResponseWriter, r *http.Request) {", "Өңдеуші."],
          ['    list := []Todo{{ID: 1, Title: "Learn Go"}}', "Тізім."],
          ["    json.NewEncoder(w).Encode(list)", "Тікелей w ішіне JSON кодтаймыз."],
          ["}", "Соңы."],
          ["", ""],
          ["func main() {", "main басталуы."],
          ['    http.HandleFunc("/api/todos", todosHandler)', "Маршрут."],
          ["}", "main соңы."]
        ],
        hint: "json.NewEncoder(w).Encode(...) жауапты жылдам кодтайды.",
        checks: [
          "type Todo struct {",
          "func todosHandler(w http.ResponseWriter, r *http.Request)",
          "json.NewEncoder(w).Encode(",
          'http.HandleFunc("/api/todos", todosHandler)'
        ]
      },
      "t37": {
        title: "Content-Type тақырыбы",
        desc: R`Жауап берер алдында {{w.Header().Set("Content-Type", "application/json")}} тақырыбын орнатыңыз.`,
        lines: [
          ["package main", "Қаңқа."],
          ["", ""],
          ['import (', "Импорт."],
          ['    "encoding/json"', "JSON."],
          ['    "net/http"', "HTTP."],
          [")", "Соңы."],
          ["", ""],
          ["func handler(w http.ResponseWriter, r *http.Request) {", "Өңдеуші."],
          ['    w.Header().Set("Content-Type", "application/json")', "JSON тақырыбын қоямыз."],
          ['    json.NewEncoder(w).Encode(map[string]bool{"ok": true})', "Жауапты жібереміз."],
          ["}", "Соңы."],
          ["", ""],
          ["func main() {", "main басталуы."],
          ['    http.HandleFunc("/ping", handler)', "Маршрут."],
          ["}", "main соңы."]
        ],
        hint: "Header мәні Encode шақырылғанға дейін қойылуы керек.",
        checks: [
          'w.Header().Set("Content-Type", "application/json")',
          'json.NewEncoder(w).Encode',
          'http.HandleFunc("/ping", handler)'
        ]
      },
      "t38": {
        title: "Тек POST сұранысы",
        desc: R`Егер сұраныс әдісі POST болмаса, 405 мәртебесін қайтаратын тексеру қосыңыз.`,
        plan: [
          "if r.Method != http.MethodPost шартын тексеріңіз",
          "Сәйкес келмесе: http.Error(w, \"Method not allowed\", http.StatusMethodNotAllowed) және return",
          "Әйтпесе 200 OK қайтарыңыз"
        ],
        lines: [
          ["package main", "Қаңқа."],
          ["", ""],
          ['import "net/http"', "HTTP импорты."],
          ["", ""],
          ["func createHandler(w http.ResponseWriter, r *http.Request) {", "Өңдеуші."],
          ["    if r.Method != http.MethodPost {", "POST емес пе тексеру."],
          ['        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)', "405 қатесі."],
          ["        return", "Тоқтатамыз."],
          ["    }", "Тексеру соңы."],
          ['    w.Write([]byte("Created"))', "Сәтті жауап."],
          ["}", "Соңы."],
          ["", ""],
          ["func main() {", "main басталуы."],
          ['    http.HandleFunc("/create", createHandler)', "Маршрут."],
          ["}", "main соңы."]
        ],
        hint: "http.MethodPost және http.StatusMethodNotAllowed константаларын қолданыңыз.",
        checks: [
          "if r.Method != http.MethodPost",
          "http.StatusMethodNotAllowed",
          'http.HandleFunc("/create", createHandler)'
        ]
      }
    }
  },

  23: {
    title: "Деректер қоры және SQL",
    about: "SQLite, SELECT, INSERT және қауіпсіз параметрленген сұраныстар",
    theory: R`
Сервер сөнгенде деректер жоғалып кетпес үшін оларды **деректер қорында (Database)** сақтаймыз.

Go тіліндегі стандартты жұмыс:
- {{database/sql}} пакеті деректер қорымен әмбебап байланыс орнатады.
- SQL (Structured Query Language) — деректерді басқару тілі.

Негізгі SQL командалары:
- {{CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)}}: жаңа кесте құру.
- {{INSERT INTO users (name) VALUES (?)}}: жаңа жазба қосу.
- {{SELECT id, name FROM users}}: мәліметтерді оқу.

Қауіпсіздіктің алтын ережесі:
Ешқашан SQL сұраныстарына мәтінді тікелей қоспаңыз (SQL Injection қаупі)! Әрқашан **сұрақ белгісін (?)** және параметрлерді қолданыңыз:
{{db.Exec("INSERT INTO users (name) VALUES (?)", userName)}}
`,
    examples: R`
\`\`\`
package main

import (
    "database/sql"
    "fmt"
)

func main() {
    // db, _ := sql.Open("sqlite3", "app.db")
    // db.Exec("CREATE TABLE IF NOT EXISTS users (id INT, name TEXT)")
    fmt.Println("DB connection configured")
}
\`\`\`
`,
    quiz: [
      {
        q: "SQL сұраныстарына деректерді қауіпсіз беру үшін не қолданылады?",
        o: ["Параметрленген сұраныстар (?) белгісі арқылы", "Жай ғана жолдарды + белгісімен қосу", "Деректерді үтірмен тізу"],
        why: "Параметрленген сұраныстар (Placeholders) қауіпті SQL инъекцияларынан қорғайды."
      },
      {
        q: "Кестеге жаңа жазба қосу үшін қандай SQL пәрмені қолданылады?",
        o: ["INSERT INTO", "SELECT", "UPDATE"],
        why: "{{INSERT INTO}} кестеге жаңа қатарларды жазу үшін қолданылады."
      }
    ],
    tasks: {
      "t39": {
        title: "Деректер қорын ашу және кесте жасау",
        desc: R`sql.Open арқылы қосылым ашып, {{CREATE TABLE IF NOT EXISTS users}} сұранысын орындаңыз.`,
        lines: [
          ["package main", "Қаңқа."],
          ["", ""],
          ['import (', "Импорт."],
          ['    "database/sql"', "SQL құралы."],
          ['    "fmt"', "fmt."],
          [")", "Соңы."],
          ["", ""],
          ["func main() {", "main басталуы."],
          ['    db, err := sql.Open("sqlite3", ":memory:")', "Жадтағы базаны ашамыз."],
          ["    if err != nil { return }", "Қатені тексереміз."],
          ["    defer db.Close()", "Бағдарлама соңында жабу."],
          ['    query := "CREATE TABLE IF NOT EXISTS users (id INTEGER, name TEXT);"', "Кесте құру сұранысы."],
          ["    db.Exec(query)", "Сұранысты орындаймыз."],
          ['    fmt.Println("Table ready")', "Дайын екенін шығарамыз."],
          ["}", "main соңы."]
        ],
        hint: "db.Exec сұранысты деректер қорына орындауға жібереді.",
        checks: [
          '"database/sql"',
          'sql.Open("sqlite3"',
          "CREATE TABLE IF NOT EXISTS users",
          "db.Exec(query)"
        ]
      },
      "t40": {
        title: "Қосу және оқу",
        desc: R`db.Exec арқылы пайдаланушы қосып, оны db.QueryRow арқылы қайта оқыңыз.`,
        lines: [
          ["package main", "Қаңқа."],
          ["", ""],
          ['import (', "Импорт."],
          ['    "database/sql"', "SQL."],
          ['    "fmt"', "fmt."],
          [")", "Соңы."],
          ["", ""],
          ["func main() {", "main басталуы."],
          ['    db, _ := sql.Open("sqlite3", ":memory:")', "Қосылу."],
          ["    defer db.Close()", "Жабу."],
          ['    db.Exec("CREATE TABLE users (name TEXT)")', "Кесте жасау."],
          ['    db.Exec("INSERT INTO users VALUES (?)", "Aru")', "Aru-ды қосамыз."],
          ["    var name string", "Айнымалы."],
          ['    db.QueryRow("SELECT name FROM users").Scan(&name)', "Оқимыз."],
          ["    fmt.Println(name)", "Aru шығарамыз."],
          ["}", "main соңы."]
        ],
        hint: "Scan(&name) оқылған мәнді айнымалыға жазады.",
        checks: [
          "INSERT INTO users VALUES (?)",
          "SELECT name FROM users",
          "Scan(&name)",
          "fmt.Println(name)"
        ]
      },
      "t41": {
        title: "Қанша қолданушы бар",
        desc: R`SELECT COUNT(*) сұранысы арқылы пайдаланушылар санын санап шығарыңыз.`,
        plan: [
          "var count int айнымалысын жариялаңыз",
          "db.QueryRow(\"SELECT COUNT(*) FROM users\").Scan(&count) орындаңыз",
          "fmt.Println(count) арқылы санын басып шығарыңыз"
        ],
        lines: [
          ["package main", "Қаңқа."],
          ["", ""],
          ['import (', "Импорт."],
          ['    "database/sql"', "SQL."],
          ['    "fmt"', "fmt."],
          [")", "Соңы."],
          ["", ""],
          ["func main() {", "main басталуы."],
          ['    db, _ := sql.Open("sqlite3", ":memory:")', "Базаны ашамыз."],
          ["    defer db.Close()", "Жабу."],
          ["    var count int", "Санауыш."],
          ['    db.QueryRow("SELECT COUNT(*) FROM users").Scan(&count)', "Санаймыз."],
          ["    fmt.Println(count)", "Санын шығарамыз."],
          ["}", "main соңы."]
        ],
        hint: "SELECT COUNT(*) кестедегі жазбалардың жалпы санын береді.",
        checks: [
          "var count int",
          "SELECT COUNT(*) FROM users",
          "Scan(&count)",
          "fmt.Println(count)"
        ]
      }
    }
  },

  24: {
    title: "Мини-жоба: Тапсырмалар тізімі (Todo API)",
    about: "барлық білімді біріктіріп, нақты жұмыс істейтін толық веб-сервис жасау",
    theory: R`
Курстың қорытынды мини-жобасында біз осы уақытқа дейін үйренген барлық тақырыптарды біріктіреміз:
- Құрылымдар (struct);
- Тілімдер (slices);
- HTTP-маршруттар;
- JSON кодтау және декодтау;
- GET және POST сұраныстарын өңдеу.

Біз нақты жұмыс істейтін **Todo API** құрастырамыз:
- {{GET /todos}} — барлық тапсырмалар тізімін JSON түрінде қайтарады.
- {{POST /add}} — жаңа тапсырманы қабылдап, тізімге қосады.

Бұл — кез келген кәсіби Backend-әзірлеушінің нақты жұмыста күнделікті жасайтын базалық архитектурасы.
`,
    examples: R`
\`\`\`
package main

import (
    "encoding/json"
    "fmt"
    "net/http"
)

type Todo struct {
    ID    int    \`json:"id"\`
    Title string \`json:"title"\`
    Done  bool   \`json:"done"\`
}

var todos = []Todo{
    {ID: 1, Title: "Learn Go", Done: true},
}

func main() {
    http.HandleFunc("/todos", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(todos)
    })
    fmt.Println("Todo API ready on :8080")
}
\`\`\`
`,
    quiz: [
      {
        q: "Todo API сияқты микросервистің басты міндеті қандай?",
        o: ["Клиенттен сұраныстарды қабылдап, JSON арқылы деректерді өңдеу және беру", "Компьютерге операциялық жүйе орнату", "Дизайн элементтерін суреттеу"],
        why: "Backend API деректерді сақтау, өңдеу және клиентке ыңғайлы JSON түрінде беру үшін қызмет етеді."
      },
      {
        q: "Жаңа тапсырманы қосу үшін қандай HTTP әдісі сәйкес келеді?",
        o: ["POST", "GET", "OPTIONS"],
        why: "Жаңа жазба құру мен деректерді серверге жолдау үшін әрқашан {{POST}} қолданылады."
      }
    ],
    tasks: {
      "t42": {
        title: "Модель және деректер",
        desc: R`ID, Title және Done өрістері бар Todo моделін жасап, бастапқы тапсырмалар тілімін толтырыңыз.`,
        lines: [
          ["package main", "Қаңқа."],
          ["", ""],
          ['import "fmt"', "fmt импорты."],
          ["", ""],
          ["type Todo struct {", "Todo құрылымы."],
          ['    ID    int    `json:"id"`', "ID өрісі."],
          ['    Title string `json:"title"`', "Атауы."],
          ['    Done  bool   `json:"done"`', "Орындалды ма."],
          ["}", "Құрылым соңы."],
          ["", ""],
          ["func main() {", "main басталуы."],
          ["    todos := []Todo{", "Тілім жасаймыз."],
          ['        {ID: 1, Title: "Learn Go", Done: true},', "Бірінші тапсырма."],
          ['        {ID: 2, Title: "Build API", Done: false},', "Екінші тапсырма."],
          ["    }", "Тілім соңы."],
          ["    fmt.Println(len(todos))", "Ұзындығын шығарамыз (2)."],
          ["}", "main соңы."]
        ],
        hint: "Әр тапсырмада ID, Title және Done өрістері болуы керек.",
        checks: [
          "type Todo struct {",
          "ID    int",
          "Title string",
          "Done  bool",
          'Title: "Learn Go"'
        ]
      },
      "t43": {
        title: "Тізімді беру (GET /todos)",
        desc: R`GET сұранысына тапсырмалар тізімін JSON форматында қайтаратын өңдеушіні жазыңыз.`,
        lines: [
          ["package main", "Қаңқа."],
          ["", ""],
          ['import (', "Импорт."],
          ['    "encoding/json"', "JSON."],
          ['    "net/http"', "HTTP."],
          [")", "Соңы."],
          ["", ""],
          ["type Todo struct {", "Модель."],
          ['    ID    int    `json:"id"`', "ID."],
          ['    Title string `json:"title"`', "Атауы."],
          ["}", "Соңы."],
          ["", ""],
          ['var list = []Todo{{ID: 1, Title: "Learn Go"}}', "Деректер."],
          ["", ""],
          ["func getTodos(w http.ResponseWriter, r *http.Request) {", "GET өңдеушісі."],
          ['    w.Header().Set("Content-Type", "application/json")', "JSON тақырыбы."],
          ["    json.NewEncoder(w).Encode(list)", "Кодтап жібереміз."],
          ["}", "Соңы."],
          ["", ""],
          ["func main() {", "main басталуы."],
          ['    http.HandleFunc("/todos", getTodos)', "Маршрутқа бекітеміз."],
          ["}", "main соңы."]
        ],
        hint: "json.NewEncoder(w).Encode(list) тізімді тікелей жауапқа жібереді.",
        checks: [
          "type Todo struct {",
          "func getTodos(w http.ResponseWriter, r *http.Request)",
          'w.Header().Set("Content-Type", "application/json")',
          "json.NewEncoder(w).Encode(list)",
          'http.HandleFunc("/todos", getTodos)'
        ]
      },
      "t44": {
        title: "Тапсырма қосу (POST /add)",
        desc: R`POST сұранысымен келген жаңа Todo нысанын қабылдап, тізімге қосатын және 201 Created қайтаратын өңдеушіні жазыңыз.`,
        plan: [
          "r.Method == http.MethodPost екенін тексеріңіз",
          "var item Todo жариялап, json.NewDecoder(r.Body).Decode(&item) арқылы оқыңыз",
          "list = append(list, item) арқылы тізімге қосыңыз",
          "w.WriteHeader(http.StatusCreated) жіберіңіз"
        ],
        lines: [],
        hint: "json.NewDecoder(r.Body).Decode(&item) сұраныс денесінен JSON-ды оқиды.",
        checks: [
          "func addTodo(w http.ResponseWriter, r *http.Request)",
          "http.MethodPost",
          "json.NewDecoder(r.Body).Decode(&item)",
          "list = append(list, item)",
          "http.StatusCreated",
          'http.HandleFunc("/add", addTodo)'
        ]
      }
    }
  }
};

