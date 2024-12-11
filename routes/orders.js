// orders.js
const express = require('express');
const router = express.Router();
const db = require('./database.js');
//const { isAuthenticated } = require('../authMiddleware'); // Импортируйте middleware
var isAuth = require('./isAuth');

// Корзина
router.get('/cart', (req, res) => {
  const cart = req.session.cart || [];
  res.render('cart', { title: 'Корзина', cart });
});

// Добавление в корзину
router.post('/cart/add', (req, res) => {
  const { itemId, itemName, itemPrice } = req.body;
  const cart = req.session.cart || [];

  const existingItem = cart.find(item => item.itemId === parseInt(itemId, 10));

  if (existingItem) {
    existingItem.quantity += 1;
    existingItem.totalPrice = parseFloat(existingItem.itemPrice) * existingItem.quantity;
  } else {
    cart.push({
      itemId: parseInt(itemId, 10),
      itemName,
      itemPrice: parseFloat(itemPrice),
      quantity: 1,
      totalPrice: parseFloat(itemPrice)
    });
  }

  req.session.cart = cart;
  res.redirect('back');
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Оформление заказа
router.post('/checkout', isAuthenticated, (req, res) => {
  if (!req.user) {
    // Если пользователь не авторизован, установите флеш-сообщение req.flash('error', 'Для оформления заказа нужна авторизация');
    req.session.cart = req.session.cart || [];
    req.session.checkoutData = {
      address: req.body.address,
      phone: req.body.phone,
      deliveryTime: req.body.deliveryTime };
    res.redirect('/login');
  } else {
    // Если пользователь авторизован, продолжите оформление заказа
    const cart = req.session.cart || [];
    const totalPrice = cart.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0);

    const items = cart.map(item => [item.itemName, item.quantity, item.itemPrice]);

    const { address, phone, deliveryTime } = req.body;

    db.run('INSERT INTO orders (items, total_price, address, phone, delivery_time, user_id) VALUES (?, ?, ?, ?, ?, ?)', [JSON.stringify(items), totalPrice, address, phone, deliveryTime, req.user.id], function(err) {
      if (err) {
        throw err;
      }
      req.session.cart = [];
      res.redirect('/orders');
    });
  }
});



// История заказов
router.get('/', (req, res) => {
  db.all('SELECT id, items, total_price, address, phone, delivery_time, user_id FROM orders', [], (err, rows) => {
    if (err) {
      throw err;
    }
    const ordersWithFormattedItems = rows.map(row => {
      const items = JSON.parse(row.items);
      // Форматируем каждый элемент и соединяем их с помощью "; "
      const formattedItems = items.map(item => `${item[0]},${item[1]},${item[2]}`).join('; ');
      return { ...row, items: formattedItems };
    });
    res.render('orders', { title: 'Orders', orders: ordersWithFormattedItems });
  });
});

module.exports = router;