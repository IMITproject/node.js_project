<<<<<<< HEAD
Это окончательная версия проекта со всеми исправленными недочетами, и с тестами.
Проект состоит из нескольких частей:

1) Файлы backend - app.js, passport.js, middleware.js, файлы js из папки routes Эта папка содержит файлы маршрутов (например, cinemas.js, menu.js). Каждый из этих файлов определяет, как обрабатывать определенные HTTP-запросы (GET, POST и т.д.). Это чисто серверная логика.
app.js: Это основной файл вашего приложения, который настраивает сервер, определяет маршруты и использует middleware. Он отвечает за обработку запросов и маршрутизацию.
passport.js: Этот файл, скорее всего, отвечает за аутентификацию пользователей, используя библиотеку Passport.js. Это часть серверной логики.
middleware.js: Этот файл содержит функции промежуточного ПО, которые обрабатывают запросы перед тем, как они достигнут маршрутов. Это также относится к бэкенду.
routes/: Эта папка содержит файлы маршрутов (например, auth.js, users.js). Каждый из этих файлов определяет, как обрабатывать определенные HTTP-запросы (GET, POST и т.д.). Это чисто серверная логика.

2) Файлы  frontend:
views/: Папка с Pug файлами, которые отвечают за генерацию HTML. Эти файлы определяют, как будет выглядеть пользовательский интерфейс. Например, login.pug и index.pug — это шаблоны, которые будут рендериться на стороне сервера и отправляться клиенту.  
public/: Папка с статическими файлами, такими как изображения и CSS/JS библиотеки (например, Bootstrap). Эти файлы доступны клиенту напрямую и используются для оформления интерфейса.


Чтобы запустить проект нужно зайти в терминал и в корневом каталоге запустить команду "node app.js".
Дальее в браузере зайти на указанный сервер http://localhost:3000 и можно увидеть наш веб-проект.
=======
Теперь полный проект с работой киноафиши и кафетерии. Но с некоторыми ошибками и без тестов
>>>>>>> 9f633228e996f4268f2de2a2e61e2cc64ce07e48
