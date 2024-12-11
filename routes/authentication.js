//authentication.js
var express = require("express");
var router = express.Router();
var passport = require('passport');

// переход к странице для ввода логина и пароля
// Переход к странице для ввода логина и пароля
router.get('/login', (req, res) => {
    res.render('authentication/login', {
        message: req.flash('error') // Измените на 'error', чтобы отображать сообщения об ошибках
    });
});

// Осуществление входа пользователя в систему
router.post('/login', passport.authenticate('login', {
    successRedirect: '/orders/cart',
    failureRedirect: '/login',
    failureFlash: true // Убедитесь, что это установлено
}));


// переход к странице регистрации
router.get('/register', (req, res) => {
    res.render('authentication/register',{
        message: req.flash('message')});
});

// осуществление регистрации пользователя в системе: выполняется переход к стратегии регистрации, которая определена в файле passport.js
router.post('/register', passport.authenticate('register', {
        successRedirect: '/login',
        failureRedirect: '/register',
        failureFlash : true
    }
));

// обработчик для выхода пользователя из системы (делает недействительной сессию пользователя)
router.get('/logout', (req, res) => {
    req.logout((err) => {
      if (err) throw err;
      res.clearCookie('connect.sid'); // Очистить cookie сессии
      res.redirect('/login');
    });
  });

module.exports = router;