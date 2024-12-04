const request = require('supertest');
const app = require('./service');
const version = require('./version.json');
const config = require('./config.js');

jest.mock('./routes/authRouter.js', () => ({
  authRouter: require('express').Router(),
  setAuthUser: (req, res, next) => {
    req.user = { id: 1, username: 'testuser' };
    next();
  },
}));
jest.mock('./routes/orderRouter.js', () => require('express').Router());
jest.mock('./routes/franchiseRouter.js', () => require('express').Router());

test('get /', async () => {
    const response = await request(app).get('');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'welcome to JWT Pizza',
      version: version.version,
    });
});

test('use *', async () => {
    const response = await request(app).get('/cats');
    
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
        message: 'unknown endpoint',
    });
});

test('error handler', async () => {
  const response = await request(app).get('/api/docs');

  expect(response.statusCode).toBe(500);
  expect(response.body).toEqual({
    message: expect.any(String),
    stack: expect.any(String),
  });
});