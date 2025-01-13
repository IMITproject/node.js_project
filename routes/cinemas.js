//cinemas.js
const express = require('express');
const router = express.Router();
const db = require('./database.js');
const multer = require('multer');
const upload = multer({ dest: 'public/image/' });

// Получение списка кинотеатров
router.get('/', (req, res) => {
    db.all('SELECT * FROM cinemas', [], (err, rows) => {
        if (err) {
            console.error(err); // Логируем ошибку
            return res.status(500).send('Ошибка при получении данных из базы'); // Возвращаем ответ с кодом 500
        }
        res.render('cinemas', { title: 'Кинотеатры', cinemas: rows }); // Изменяем title
    });
});

module.exports = router;
