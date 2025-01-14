
// Import necessary modules
const request = require('supertest');
const express = require('express');
const db = require('./database.js');
const cinemaRouter = require('./cinemas.js');

// Mock the database module
jest.mock('./database.js', () => ({
  all: jest.fn(),
}));

// Initialize express app
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', cinemaRouter);

// Unit tests
describe('Cinemas API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the list of cinemas with status 200 on success', async () => {
    const mockCinemas = [
      { id: 1, name: 'Cinema 1' },
      { id: 2, name: 'Cinema 2' },
    ];
    db.all.mockImplementation((query, params, callback) => {
      callback(null, mockCinemas);
    });

    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Кинотеатры');
    expect(response.text).toContain('Cinema 1');
    expect(response.text).toContain('Cinema 2');
    expect(db.all).toHaveBeenCalledWith(
      'SELECT * FROM cinemas',
      [],
      expect.any(Function)
    );
  });

  it('should return 500 status when there is a database error', async () => {
    db.all.mockImplementation((query, params, callback) => {
      callback(new Error('Database Error'));
    });

    const response = await request(app).get('/');

    expect(response.status).toBe(500);
    expect(response.text).toContain('Ошибка при получении данных из базы');
    expect(db.all).toHaveBeenCalledWith(
      'SELECT * FROM cinemas',
      [],
      expect.any(Function)
    );
  });
});
