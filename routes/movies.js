const express = require('express');
const router = express.Router();
const db = require('./database.js');

// Получить все фильмы (путь /movies)
router.get('/', (req, res) => {
    db.all('SELECT * FROM movies', [], (err, movies) => {
        if (err) {
            throw err;
        }
        
        res.render('movies', {
            title: 'Все Фильмы',
            movies: movies,
            cinemaName: '' 
        });
    });
});

// Получить фильмы по cinemaId (путь /movies/:cinemaId)
router.get('/:cinemaId', (req, res) => {
    const cinemaId = req.params.cinemaId;

    db.all('SELECT * FROM movies WHERE cinema_id = ?', [cinemaId], (err, movies) => {
        if (err) {
            throw err;
        }

        db.get('SELECT name FROM cinemas WHERE id = ?', [cinemaId], (err, cinema) => {
            if (err) {
                throw err;
            }

            res.render('movies', {
                title: 'Movies',
                movies: movies,
                cinemaName: cinema.name // Передаем название кинотеатра
            });
        });
    });
});

module.exports = router;
