const express = require('express');
const router = express.Router();
const db = require('./database.js');
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

// Проверка аутентификации
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Оформление заказа
router.post('/checkout', isAuthenticated, (req, res) => {
  if (!req.user) {
    req.session.cart = req.session.cart || [];
    req.session.checkoutData = { phone: req.body.phone }; // Сохраняем только номер телефона
    res.redirect('/login');
  } else {
    const cart = req.session.cart || [];
    const totalPrice = cart.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0);

    const items = cart.map(item => [item.itemName, item.quantity, item.itemPrice]);

    const { phone } = req.body; // Получаем только номер телефона

    // Вставляем данные заказа в базу без адреса и времени доставки
    db.run('INSERT INTO orders (items, total_price, phone, user_id) VALUES (?, ?, ?, ?)', 
      [JSON.stringify(items), totalPrice, phone, req.user.id], function(err) {
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
  db.all('SELECT id, items, total_price, phone, user_id FROM orders', [], (err, rows) => {
    if (err) {
      throw err;
    }
    const ordersWithFormattedItems = rows.map(row => {
      const items = JSON.parse(row.items);
      const formattedItems = items.map(item => `${item[0]}, ${item[1]}, ${item[2]}`).join('; ');
      return { ...row, items: formattedItems };
    });
    res.render('orders', { title: 'История заказов', orders: ordersWithFormattedItems });
  });
});

module.exports = router;
