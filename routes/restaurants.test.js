
// All necessary imports here
const request = require('supertest');
const express = require('express');
const router = require('./restaurants');
jest.mock('./database.js');

describe('GET /', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use('/', router);
    });

    it('should return a list of restaurants', async () => {
        const mockRestaurants = [{ id: 1, name: 'Sushi Place' }, { id: 2, name: 'Burger House' }];
        require('./database.js').all.mockImplementation((query, params, callback) => {
            callback(null, mockRestaurants);
        });

        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        expect(response.text).toContain('Sushi Place');
        expect(response.text).toContain('Burger House');
    });

    it('should render restaurant view with title "Рестораны"', async () => {
        const mockRestaurants = [{ id: 1, name: 'Sushi Place' }];
        require('./database.js').all.mockImplementation((query, params, callback) => {
            callback(null, mockRestaurants);
        });

        const response = await request(app).get('/');

        expect(response.text).toContain('title: \'Рестораны\'');
    });

    it('should handle database errors gracefully', async () => {
        const mockError = new Error('Database error');
        require('./database.js').all.mockImplementation((query, params, callback) => {
            callback(mockError, null);
        });

        try {
            await request(app).get('/');
        } catch (error) {
            expect(error.message).toBe('Database error');
        }
    });
});
