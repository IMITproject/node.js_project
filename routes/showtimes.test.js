
const request = require('supertest');
const express = require('express');
const router = require('./showtimes.js');
const db = require('./database.js');

jest.mock('./database.js'); // Mocking the database module

const app = express();
app.use(router);

describe('GET /:cinemaId', () => {
    
    it('should return a 500 error if database query fails for movies', async () => {
        db.all.mockImplementation((query, params, callback) => {
            callback(new Error('Database Error'), null);
        });

        const res = await request(app).get('/1');
        expect(res.status).toBe(500);
        expect(res.text).toBe('Ошибка получения данных');
    });

    it('should return a 404 error if no movies are found for the cinema', async () => {
        db.all.mockImplementation((query, params, callback) => {
            callback(null, []);
        });

        const res = await request(app).get('/1');
        expect(res.status).toBe(404);
        expect(res.text).toBe('Фильмы не найдены для этого кинотеатра');
    });

    it('should return a 500 error if database query fails for cinema', async () => {
        db.all.mockImplementation((query, params, callback) => {
            callback(null, [{ id: 1, name: 'Movie1' }]);
        });
        db.get.mockImplementation((query, params, callback) => {
            callback(new Error('Cinema Database Error'), null);
        });

        const res = await request(app).get('/1');
        expect(res.status).toBe(500);
        expect(res.text).toBe('Ошибка получения данных о кинотеатре');
    });

    it('should successfully render movies with cinema name', async () => {
        db.all.mockImplementation((query, params, callback) => {
            callback(null, [{ id: 1, name: 'Movie1' }, { id: 2, name: 'Movie2' }]);
        });
        db.get.mockImplementation((query, params, callback) => {
            callback(null, { name: 'Cinema1' });
        });

        app.set('view engine', 'pug'); // Setting a view engine for testing render

        const res = await request(app).get('/1');
        expect(res.status).toBe(200);
        // Further expectations depend on how 'movies' pug template is structured });
});
})