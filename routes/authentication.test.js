const request = require('supertest');
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const path = require('path');
const router = require('./authentication');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'testsecret',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

jest.mock('passport', () => {
    const originalModule = jest.requireActual('passport');
    return {
        ...originalModule,
        initialize: jest.fn(() => (req, res, next) => next()),
        session: jest.fn(() => (req, res, next) => next()),
        authenticate: jest.fn((strategy, options) => (req, res, next) => {
            if (strategy === 'login' || strategy === 'register') {
                if (req.body.username === 'success') {
                    return res.redirect(options.successRedirect);
                } else {
                    req.flash('error', 'Authentication failed');
                    return res.redirect(options.failureRedirect);
                }
            }
            return next(new Error('Unknown strategy'));
        }),
    };
});

// Тесты
describe('GET /login', () => {
    it('should render login page with message', async () => {
        const response = await request(app).get('/login');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/html/);
        expect(response.text).toContain('authentication/login');
    });

    it('should return 500 if login page fails to render', async () => {
        jest.spyOn(app, 'render').mockImplementationOnce((_, __, callback) => callback(new Error('Render error')));
        const response = await request(app).get('/login');
        expect(response.status).toBe(500);
        expect(response.text).toContain('Error rendering login page');
    });
});

describe('POST /login', () => {
    it('should redirect to cart on successful login', async () => {
        const response = await request(app).post('/login').send({ username: 'success', password: 'password' });
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/orders/cart');
    });

    it('should redirect to login on failed login', async () => {
        const response = await request(app).post('/login').send({ username: 'fail', password: 'password' });
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/login');
    });

    it('should handle unknown strategy gracefully', async () => {
        const response = await request(app).post('/unknown').send({ username: 'test', password: 'password' });
        expect(response.status).toBe(404);
        expect(response.text).toContain('Not Found');
    });
});

describe('GET /register', () => {
    it('should render register page with message', async () => {
        const response = await request(app).get('/register');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/html/);
        expect(response.text).toContain('authentication/register');
    });

    it('should return 500 if register page fails to render', async () => {
        jest.spyOn(app, 'render').mockImplementationOnce((_, __, callback) => callback(new Error('Render error')));
        const response = await request(app).get('/register');
        expect(response.status).toBe(500);
        expect(response.text).toContain('Error rendering register page');
    });
});

describe('POST /register', () => {
    it('should redirect to login on successful registration', async () => {
        const response = await request(app).post('/register').send({ username: 'success', password: 'password' });
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/login');
    });

    it('should redirect to register on failed registration', async () => {
        const response = await request(app).post('/register').send({ username: 'fail', password: 'password' });
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/register');
    });
});

describe('GET /logout', () => {
    it('should logout user and redirect to login', async () => {
        const response = await request(app).get('/logout');
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/login');
    });

    it('should return 500 if logout fails', async () => {
        jest.spyOn(app.request, 'logout').mockImplementationOnce((callback) => callback(new Error('Logout error')));
        const response = await request(app).get('/logout');
        expect(response.status).toBe(500);
        expect(response.text).toContain('Error during logout');
    });
});
