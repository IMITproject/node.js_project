// routes/restaurants.js
const express = require('express');
const router = express.Router();
const db = require('./database.js');

router.get('/', (req, res) => {
    db.all('SELECT * FROM restaurants', [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.render('restaurant', { title: 'Рестораны', restaurants: rows });
    });
});

module.exports = router;
