
const request = require('supertest');
const session = require('express-session');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./orders'); // Путь к вашему orders.js
const db = require('./database.js'); // Мокаем базу данных
jest.mock('./database.js');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'testsecret', resave: false, saveUninitialized: true }));
app.use(router);

describe('Cart API', () => {
  let testSession;

  beforeEach(() => {
    testSession = request.agent(app);
  });

  describe('GET /cart', () => {
    it('should return empty cart initially', async () => {
      const response = await testSession.get('/cart');
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain('Корзина');
      expect(response.text).toContain('Ваша корзина пуста');
    });
  });

  describe('POST /cart/add', () => {
    it('should add a new item to the cart', async () => {
      await testSession.post('/cart/add').send({ itemId: 1, itemName: 'Item 1', itemPrice: '10.00' });
      const response = await testSession.get('/cart');
      expect(response.text).toContain('Item 1');
      expect(response.text).toContain('10.00');
    });

    it('should update quantity and totalPrice for existing item in the cart', async () => {
      await testSession.post('/cart/add').send({ itemId: 1, itemName: 'Item 1', itemPrice: '10.00' });
      await testSession.post('/cart/add').send({ itemId: 1, itemName: 'Item 1', itemPrice: '10.00' });
      const response = await testSession.get('/cart');
      expect(response.text).toContain('Item 1');
      expect(response.text).toContain('20.00');
    });

    it('should handle invalid item price gracefully', async () => {
      await testSession.post('/cart/add').send({ itemId: 2, itemName: 'Item 2', itemPrice: 'not-a-number' });
      const response = await testSession.get('/cart');
      expect(response.text).toContain('NaN');
    });
  });

  describe('POST /checkout', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should redirect unauthenticated users to login', async () => {
      app.request.isAuthenticated = () => false;
      const response = await testSession.post('/checkout').send({ phone: '1234567890' });
      expect(response.headers.location).toBe('/login');
    });

    it('should process order for authenticated user', async () => {
      app.request.isAuthenticated = () => true;
      app.request.user = { id: 1 };

      await testSession.post('/cart/add').send({ itemId: 1, itemName: 'Item 1', itemPrice: '10.00' });
      db.run.mockImplementation((query, params, callback) => callback(null));

      const response = await testSession.post('/checkout').send({ phone: '1234567890' });
      expect(db.run).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO orders'),
        expect.any(Array),
        expect.any(Function)
      );
      expect(response.headers.location).toBe('/orders');
    });

    it('should handle database insertion error', async () => {
      app.request.isAuthenticated = () => true;
      app.request.user = { id: 1 };

      await testSession.post('/cart/add').send({ itemId: 1, itemName: 'Item 1', itemPrice: '10.00' });
      db.run.mockImplementation((query, params, callback) => callback(new Error('Database Error')));

      await expect(testSession.post('/checkout').send({ phone: '1234567890' })).rejects.toThrow('Database Error');
    });
  });

  describe('GET / (Order history)', () => {
    it('should retrieve order history with tickets and snacks', async () => {
      const mockOrders = [{
        id: 1,
        tickets: JSON.stringify([['Movie 1', 2, 500]]),
        items: JSON.stringify([['Snack 1', 1, 100]]),
        total_price: 1100,
        phone: '1234567890',
        user_id: 1,
      }];
      db.all.mockImplementation((query, params, callback) => callback(null, mockOrders));

      const response = await testSession.get('/');
      expect(response.text).toContain('История заказов');
      expect(response.text).toContain('Билеты: Movie 1, 2, 500');
      expect(response.text).toContain('Блюда: Snack 1, 1, 100');
    });

    it('should handle database retrieval error', async () => {
      db.all.mockImplementation((query, params, callback) => callback(new Error('Database Error'), null));

      await expect(testSession.get('/')).rejects.toThrow('Database Error');
    });
  });
});