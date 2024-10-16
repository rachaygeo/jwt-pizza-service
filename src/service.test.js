const express = require('express');
const request = require('supertest');
const app = require('./service');
const { authRouter, setAuthUser } = require('./routes/authRouter.js');
const orderRouter = require('./routes/orderRouter.js');
const franchiseRouter = require('./routes/franchiseRouter.js');
const version = require('./version.json');
const config = require('./config');

test('use /docs', async () => {
    const response = await request(app).get('/api/docs');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      version: version.version,
      endpoints: expect.any(Array),
      config: {
        factory: config.factory.url,
        db: config.db.connection.host,
      },
    });
});

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