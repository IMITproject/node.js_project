// tickets.js
const express = require('express');
const router = express.Router();
const db = require('./database.js');
const { isAuthenticated } = require('./isAuth.js');

// Корзина
router.get('/cart', (req, res) => {
  const cart = req.session.cart || [];
  console.log('Cart contents:', cart); // Логируем содержимое корзины
  res.render('cart', { title: 'Корзина', cart });
});

// Добавление в корзину
router.post('/cart/add', (req, res) => {
  const { movieId, movieName, moviePrice } = req.body;

  console.log('Request body:', req.body); // Логируем весь запрос
  console.log(`Adding to cart: ID: ${movieId}, Name: ${movieName}, Price: ${moviePrice}`);

  if (!movieId || !movieName || !moviePrice) {
    return res.status(400).send('Недостаточно данных для добавления в корзину');
  }

  const cart = req.session.cart || [];
  const existingItem = cart.find(item => item.movieId === parseInt(movieId, 10));

  if (existingItem) {
    existingItem.quantity += 1;
    existingItem.totalPrice += parseFloat(moviePrice);
  } else {
    cart.push({
      movieId: parseInt(movieId, 10), // Убедитесь, что movieId есть
      movieName,                      // Убедитесь, что movieName есть
      moviePrice: parseFloat(moviePrice),
      quantity: 1,
      totalPrice: parseFloat(moviePrice)
    });
  }

  req.session.cart = cart;
  console.log('Updated cart:', cart); // Логируем обновленную корзину
  res.redirect('back');
});

// Оформление заказа (покупка билета)
router.post('/checkout', isAuthenticated, (req, res) => {
  const cart = req.session.cart || [];
  
  if (cart.length === 0) {
    return res.redirect('/cart'); // Если корзина пуста, перенаправляем на корзину
  }

  const totalPrice = cart.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0);
  const { address, phone, showtime } = req.body; // Получаем данные из формы

  // Получаем first movieId из первого элемента корзины
  const movieId = cart[0].movieId;  // Предполагается, что все билеты на один фильм
  const cinemaId = req.body.cinemaId; // cinemaId передается через форму

  db.run('INSERT INTO tickets (movie_id, cinema_id, total_price, address, phone, showtime, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)', 
    [movieId, cinemaId, totalPrice, address, phone, showtime, req.user.id], 
    function(err) {
      if (err) {
        console.error('Error inserting ticket:', err); // Логируем ошибку
        throw err;
      }
      req.session.cart = []; // Очищаем корзину после оформления
      res.redirect('/tickets');
    });
});

// История билетов
router.get('/', isAuthenticated, (req, res) => {
  db.all(`
    SELECT t.id, t.total_price, t.address, t.phone, t.showtime, m.title AS movie_title, c.name AS cinema_name 
    FROM tickets t
    JOIN movies m ON t.movie_id = m.id
    JOIN cinemas c ON t.cinema_id = c.id
    WHERE t.user_id = ?
  `, [req.user.id], (err, rows) => {
    if (err) {
      console.error('Error fetching tickets:', err); // Логируем ошибку
      throw err;
    }
    res.render('tickets', { title: 'Билеты', tickets: rows });
  });
});

module.exports = router;