
// Necessary imports
const request = require('supertest');
const express = require('express');
const router = require('./menu');
const db = require('./database');


jest.mock('./database');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'pug');
app.use('/', router);

describe('GET /:restaurantId', () => {
    it('should render menu with correct items and restaurant name', async () => {
        const restaurantId = '1';
        const mockMenuItems = [
            { id: 1, name: 'Burger', price: 5.99, restaurant_id: 1 },
            { id: 2, name: 'Fries', price: 2.99, restaurant_id: 1 }
        ];
        
        const mockRestaurant = { name: 'Test Restaurant' };
        
        db.all.mockImplementationOnce((query, params, callback) => {
            callback(null, mockMenuItems);
        });

        db.get.mockImplementationOnce((query, params, callback) => {
            callback(null, mockRestaurant);
        });

        const response = await request(app).get(`/${restaurantId}`);
        
        expect(response.status).toBe(200);
        expect(response.text).toContain(mockRestaurant.name);
        mockMenuItems.forEach(item => {
            expect(response.text).toContain(item.name);
            expect(response.text).toContain(item.price.toString());
        });
    });

    it('should handle database error when fetching menu items', async () => {
        const restaurantId = '1';
        const mockError = new Error('Database Error');
        
        db.all.mockImplementationOnce((query, params, callback) => {
            callback(mockError, null);
        });

        const response = await request(app).get(`/${restaurantId}`);
 expect(response.status).toBe(500); // Assuming express error handler setting as 500
    });

    it('should handle database error when fetching restaurant info', async () => {
        const restaurantId = '1';
        const mockMenuItems = [{ id: 1, name: 'Burger', price: 5.99, restaurant_id: 1 }];
        const mockError = new Error('Database Error');
 db.all.mockImplementationOnce((query, params, callback) => {
            callback(null, mockMenuItems);
        });

        db.get.mockImplementationOnce((query, params, callback) => {
            callback(mockError, null);
        });

        const response = await request(app).get(`/${restaurantId}`);
 expect(response.status).toBe(500); // Assuming express error handler setting as 500 });

    it('should handle case with no menu items returned', async () => {
        const restaurantId = '1';
        const mockMenuItems = [];
        const mockRestaurant = { name: 'Test Restaurant' };
        
        db.all.mockImplementationOnce((query, params, callback) => {
            callback(null, mockMenuItems);
        });

        db.get.mockImplementationOnce((query, params, callback) => {
            callback(null, mockRestaurant);
        });

        const response = await request(app).get(`/${restaurantId}`);
        
        expect(response.status).toBe(200);
        expect(response.text).toContain(mockRestaurant.name);
        expect(response.text).not.toContain('<ul>'); // Assuming that menu items are within a <ul> element
    });

    it('should handle case with invalid restaurantId', async () => {
        const invalidRestaurantId = 'invalid-id';
        
        const response = await request(app).get(`/${invalidRestaurantId}`);
        
        expect(response.status).toBe(500); // Assuming express error handler setting as 500
    });
});

});