//app.js
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session');
const passport = require('passport');
const expressSession = require('express-session');
const flash = require('connect-flash');
const pp = require('./passport');
const userMiddleware = require('./middleware'); 

const app = express();

// Настройка body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Настройка статических файлов
app.use(express.static('public'));

// Настройка multer для загрузки файлов
app.use(multer({ dest: 'public/uploads/' }).single('filedata'));

// Настройка Pug
app.set('view engine', 'pug');
app.set('views', './views');

app.use((req, res, next) => {
  res.locals.username = req.user ? req.user.username : "";
  next();
});

// Настройка сессии
app.use(expressSession({
  secret: "key", // строка, которой подписывается сохраняемый в cookie идентификатор сессии
  resave: true, // обеспечивает повторное сохранение сеанса в хранилище сервера при каждом запросе
  saveUninitialized: false // сохраняет неинициализированный сеанс в хранилище
}));

// Инициализация passport
app.use(passport.initialize());
app.use(passport.session());

// Флеш-сообщения
app.use(flash());

app.use((req, res, next) => {
  res.locals.message = req.flash('message');
  res.locals.error = req.flash('error');
  next();
});

// Подключение пользовательской middleware
app.use(userMiddleware); // Подключение пользовательской middleware

// Подключение маршрутов
const menuRouter = require('./routes/menu');
const ordersRouter = require('./routes/orders');
const restaurantsRouter = require('./routes/restaurants');
const authentication = require('./routes/authentication');
const cinemasRouter = require('./routes/cinemas'); 
const moviesRouter = require('./routes/movies'); 
const showtimesRouter = require('./routes/showtimes'); 
const ticketsRouter = require('./routes/tickets'); 

app.use('/menu', menuRouter);
app.use('/orders', ordersRouter);
app.use('/restaurants', restaurantsRouter);
app.use('/cinemas', cinemasRouter); // Подключаем маршруты для кинотеатров
app.use('/movies', moviesRouter); // Подключаем маршруты для фильмов
app.use('/showtimes', showtimesRouter); // Подключаем маршруты для расписания сеансов
app.use('/tickets', ticketsRouter); // Подключаем маршруты для билетов
app.use('/', authentication);

// Главная страница
app.get('/', (req, res) => {
  res.render('index', { title: 'Главная страница' });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
