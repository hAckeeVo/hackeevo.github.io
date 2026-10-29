# Go Piscine - учебная платформа (демо)

Статический сайт в стиле 01 Edu: слева теория и задача, справа редактор и проверка. Без сервера и сборки.

- Запуск локально: `python -m http.server 8080`, затем http://localhost:8080
- Логин: любое имя, пароль не нужен. Прогресс хранится в localStorage.
- Контент (10 тем, 20 задач) лежит в `lessons.js`. Проверка - regex-правила по тексту кода, Go в браузере не запускается.

## Деплой
- GitHub Pages: залить в репозиторий, Settings → Pages → Deploy from branch → `main` / root.
- Vercel: `npx vercel --prod` в этой папке (framework: Other, build не нужен).
