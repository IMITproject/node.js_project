const express = require('express');
const router = express.Router();
const db = require('./database.js');

// Получить фильмы по cinemaId (путь /movies/:cinemaId)
router.get('/:cinemaId', (req, res) => {
    const cinemaId = req.params.cinemaId;

    // Получаем фильмы, которые показываются в кинотеатре
    db.all('SELECT * FROM movies WHERE cinema_id = ?', [cinemaId], (err, movies) => {
        if (err) {
            return res.status(500).send('Ошибка получения данных'); 
        }

        // Проверяем, есть ли найденные фильмы
        if (movies.length === 0) {
            return res.status(404).send('Фильмы не найдены для этого кинотеатра');
        }

        // Получаем информацию о кинотеатре
        db.get('SELECT name FROM cinemas WHERE id = ?', [cinemaId], (err, cinema) => {
            if (err) {
                return res.status(500).send('Ошибка получения данных о кинотеатре');
            }

            // Передаем фильмы и название кинотеатра в шаблон
            res.render('movies', {
                title: 'Фильмы',
                movies: movies,
                cinemaName: cinema.name 
            });
        });
    });
});



module.exports = router;
