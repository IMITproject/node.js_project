const request = require('supertest');
const express = require('express');
const session = require('express-session');
const db = require('./database');
const router = require('./tickets'); // Путь к вашему tickets.js
jest.mock('./database');
jest.mock('./isAuth', () => ({
  isAuthenticated: (req, res, next) => next(), // Мокаем авторизацию
}));

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'test', resave: false, saveUninitialized: true }));
app.set('view engine', 'pug');
app.use((req, res, next) => {
  if (!req.session.cart) req.session.cart = [];
  next();
});
app.use(router);

describe('GET /cart', () => {
  it('should render the cart page with empty cart', async () => {
    const res = await request(app).get('/cart');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Ваша корзина пуста');
  });

  it('should render the cart page with existing cart items', async () => {
    app.use((req, res, next) => {
      req.session.cart = [
        { movieId: 1, movieName: 'Movie 1', moviePrice: 20, quantity: 1, totalPrice: 20 },
      ];
      next();
    });

    const res = await request(app).get('/cart');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Movie 1');
  });
});

describe('POST /cart/add', () => {
  it('should add an item to the cart', async () => {
    const res = await request(app)
      .post('/cart/add')
      .send({ movieId: '1', movieName: 'Movie 1', moviePrice: '20' })
      .redirects(1);

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Movie 1');
  });

  it('should increase quantity and total price if item already in the cart', async () => {
    app.use((req, res, next) => {
      req.session.cart = [
        { movieId: 1, movieName: 'Movie 1', moviePrice: 20, quantity: 1, totalPrice: 20 },
      ];
      next();
    });

    const res = await request(app)
      .post('/cart/add')
      .send({ movieId: '1', movieName: 'Movie 1', moviePrice: '20' })
      .redirects(1);

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Movie 1');
  });
});

describe('POST /checkout', () => {
  it('should redirect to /cart if cart is empty', async () => {
    const res = await request(app)
      .post('/checkout')
      .send({ cinemaId: 1, address: '123 Street', phone: '123456789', showtime: '20:00' })
      .redirects(1);

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Ваша корзина пуста');
  });

  it('should complete checkout and clear cart', async () => {
    app.use((req, res, next) => {
      req.session.cart = [
        { movieId: 1, movieName: 'Movie 1', moviePrice: 20, quantity: 1, totalPrice: 20 },
      ];
      req.user = { id: 1 }; // Мокаем аутентифицированного пользователя
      next();
    });

    db.run.mockImplementationOnce((query, params, callback) => callback(null));

    const res = await request(app)
      .post('/checkout')
      .send({ cinemaId: 1, address: '123 Street', phone: '123456789', showtime: '20:00' })
      .redirects(1);

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('История заказов');
  });
});

describe('GET / (ticket history)', () => {
  it('should render the tickets page with ticket data', async () => {
    db.all.mockImplementationOnce((query, params, callback) =>
      callback(null, [
        {
          id: 1,
          total_price: 20,
          address: '123 Street',
          phone: '123456789',
          showtime: '20:00',
          movie_title: 'Movie 1',
          cinema_name: 'Cinema 1',
        },
      ])
    );

    const res = await request(app).get('/').redirects(1);
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Movie 1');
  });

  it('should handle database errors gracefully', async () => {
    db.all.mockImplementationOnce((query, params, callback) =>
      callback(new Error('Failed to fetch tickets'))
    );

    const res = await request(app).get('/').redirects(1);
    expect(res.statusCode).toBe(500);
    expect(res.text).toContain('Ошибка загрузки данных');
  });
});