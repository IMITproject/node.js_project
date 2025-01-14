
const express = require('express');
const router = require('./movies');
const db = require('./database');
const request = require('supertest');
const app = express();

jest.mock('./database');

app.use('/movies', router);

describe('Movies API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /movies', () => {
        it('should return all movies', async () => {
            const mockMovies = [{ id: 1, name: 'Movie 1' }, { id: 2, name: 'Movie 2' }];
            db.all.mockImplementation((query, params, callback) => {
                callback(null, mockMovies);
            });

            const response = await request(app).get('/movies');

            expect(response.status).toBe(200);
            expect(response.text).toContain('Все Фильмы');
            mockMovies.forEach(movie => {
                expect(response.text).toContain(movie.name);
            });
        });

        it('should handle database errors gracefully', async () => {
            db.all.mockImplementation((query, params, callback) => {
                callback(new Error('Database Error'), null);
            });

            const response = await request(app).get('/movies');

            expect(response.status).toBe(500); // Assuming express error handling returns 500 });
    });

    describe('GET /movies/:cinemaId', () => {
        it('should return movies for a specific cinema', async () => {
            const cinemaId = 1;
            const mockMovies = [{ id: 1, name: 'Cinema Movie 1', cinema_id: cinemaId }];
            const mockCinemaName = 'Cool Cinema';

            db.all.mockImplementation((query, params, callback) => {
                callback(null, mockMovies);
            });

            db.get.mockImplementation((query, params, callback) => {
                callback(null, { name: mockCinemaName });
            });

            const response = await request(app).get(`/movies/${cinemaId}`);

            expect(response.status).toBe(200);
            expect(response.text).toContain('Movies');
            expect(response.text).toContain(mockCinemaName);
            mockMovies.forEach(movie => {
                expect(response.text).toContain(movie.name);
            });
        });

        it('should handle database errors when fetching movies', async () => {
            const cinemaId = 1;
            db.all.mockImplementation((query, params, callback) => {
                callback(new Error('Database Error'), null);
            });

            const response = await request(app).get(`/movies/${cinemaId}`);

            expect(response.status).toBe(500);
        });

        it('should handle database errors when fetching cinema', async () => {
            const cinemaId = 1;
            const mockMovies = [{ id: 1, name: 'Cinema Movie 1', cinema_id: cinemaId }];

            db.all.mockImplementation((query, params, callback) => {
                callback(null, mockMovies);
            });

            db.get.mockImplementation((query, params, callback) => {
                callback(new Error('Database Error'), null);
            });

            const response = await request(app).get(`/movies/${cinemaId}`);

            expect(response.status).toBe(500);
        });

        it('should handle non-existent cinemaId gracefully', async () => {
            const cinemaId = 999;
            const mockMovies = [];

            db.all.mockImplementation((query, params, callback) => {
                callback(null, mockMovies);
            });

            db.get.mockImplementation((query, params, callback) => {
                callback(null, null);
            });

            const response = await request(app).get(`/movies/${cinemaId}`);

            expect(response.status).toBe(200);
            expect(response.text).toContain('Movies');
            expect(response.text).not.toContain('Cinema');
        });
    });
});
})