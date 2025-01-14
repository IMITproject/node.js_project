
//orders.js
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
    req.session.checkoutData = { phone: req.body.phone };
    res.redirect('/login');
  } else {
    const cart = req.session.cart || [];
    console.log('Cart before checkout:', cart); // Логируем содержимое корзины

    const totalPrice = cart.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0);

    // Разделяем билеты и блюда
    const tickets = cart.filter(item => item.movieId !== undefined); // Билеты имеют movieId
    const snacks = cart.filter(item => item.itemId !== undefined);   // Блюда имеют itemId

    console.log('Tickets:', tickets); // Логируем билеты
    console.log('Snacks:', snacks);   // Логируем блюда

    // Формируем данные для сохранения
    const ticketData = tickets.map(ticket => [ticket.movieName, ticket.quantity, ticket.moviePrice]);
    const snackData = snacks.map(snack => [snack.itemName, snack.quantity, snack.itemPrice]);

    const { phone } = req.body;

    // Сохраняем заказ в базу данных
    db.run(
      'INSERT INTO orders (tickets, items, total_price, phone, user_id) VALUES (?, ?, ?, ?, ?)',
      [JSON.stringify(ticketData), JSON.stringify(snackData), totalPrice, phone, req.user.id],
      function (err) {
        if (err) {
          console.error('Error inserting order:', err);
          throw err;
        }
        req.session.cart = []; // Очищаем корзину
        res.redirect('/orders');
      }
    );
  }
});

// История заказов
router.get('/', (req, res) => {
  db.all('SELECT id, tickets, items, total_price, phone, user_id FROM orders', [], (err, rows) => {
    if (err) {
      throw err;
    }
    const ordersWithFormattedItems = rows.map(row => {
      // Форматируем билеты
      const tickets = JSON.parse(row.tickets || '[]');
      const formattedTickets = tickets.length > 0
        ? tickets.map(ticket => `${ticket[0]}, ${ticket[1]}, ${ticket[2]}`).join('; ')
        : ''; // Если билетов нет, оставляем пустую строку

      // Форматируем блюда
      const items = JSON.parse(row.items || '[]');
      const formattedItems = items.length > 0
        ? items.map(item => `${item[0]}, ${item[1]}, ${item[2]}`).join('; ')
        : ''; // Если блюд нет, оставляем пустую строку

      // Объединяем билеты и блюда
      let formattedOrder = '';
      if (formattedTickets) {
        formattedOrder += `Билеты: ${formattedTickets}`;
      }
      if (formattedItems) {
        if (formattedOrder) formattedOrder += '; ';
        formattedOrder += `Блюда: ${formattedItems}`;
      }

      return { ...row, items: formattedOrder };
    });
    res.render('orders', { title: 'История заказов', orders: ordersWithFormattedItems });
  });
});

module.exports = router;