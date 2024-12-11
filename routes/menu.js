// routes/menu.js
const express = require('express');
const router = express.Router();
const db = require('./database.js');
router.get('/:restaurantId', (req, res) => {
    const restaurantId = req.params.restaurantId;

    // Получаем элементы меню
    db.all('SELECT * FROM menu_items WHERE restaurant_id = ?', [restaurantId], (err, menuItems) => {
        if (err) {
            throw err;
        }

        // Получаем информацию о ресторане
        db.get('SELECT name FROM restaurants WHERE id = ?', [restaurantId], (err, restaurant) => {
            if (err) {
                throw err;
            }

            // Передаем название ресторана и элементы меню в шаблон
            res.render('menu', { title: 'Menu', 
                menuItems: menuItems,
                restaurantName: restaurant.name // Передаем название ресторана
            });
        });
    });
});
module.exports = router;
