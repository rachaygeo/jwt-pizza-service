const request = require('supertest');
const express = require('express');
const { DB } = require('../database/database.js');
const franchiseRouter = require('./franchiseRouter');
const jwt = require('jsonwebtoken');

jest.mock('../database/database.js');

const app = express();
app.use(express.json());
app.use('/api/franchise', franchiseRouter);

test('getFranchises', async () => {
  DB.getFranchises.mockResolvedValue([{ id: 1, name: 'pizzaPocket' }]);

  const response = await request(app).get('/api/franchise');
  expect(response.status).toBe(200);
  expect(response.body).toEqual([{ id: 1, name: 'pizzaPocket' }]);
  expect(DB.getFranchises).toHaveBeenCalled();
});

test('getUserFranchises', async () => {
  DB.getUserFranchises = jest.fn().mockResolvedValue([{ id: 2, name: 'pizzaPocket' }]);

  const user = { id: 4, isRole: () => true };
  const response = await request(app)
    .get('/api/franchise/4')
    .set('Authorization', `Bearer ttt`);

  expect(response.status).toBe(200);
  expect(response.body).toEqual([{ id: 2, name: 'pizzaPocket' }]);
  expect(DB.getUserFranchises).toHaveBeenCalledWith(4);
});

test('createFranchise', async () => {
  const newFranchise = { name: 'pizzaPocket' };
  DB.createFranchise.mockResolvedValue({ id: 1, ...newFranchise });

  const response = await request(app)
    .post('/api/franchise')
    .set('Authorization', 'Bearer admin_token')
    .send(newFranchise);

  expect(response.status).toBe(200);
  expect(response.body).toEqual({ id: 1, ...newFranchise });
  expect(DB.createFranchise).toHaveBeenCalledWith(newFranchise);
});

test('createFranchise 403 error', async () => {
  const newFranchise = { name: 'pizzaPocket' };

  const response = await request(app)
    .post('/api/franchise')
    .set('Authorization', 'Bearer non_admin_token')
    .send(newFranchise);

  expect(response.status).toBe(403);
});

test('deleteFranchise', async () => {
  const franchiseId = 1;
  DB.deleteFranchise.mockResolvedValue(true);

  const response = await request(app)
    .delete(`/api/franchise/${franchiseId}`)
    .set('Authorization', 'Bearer admin_token');

  expect(response.status).toBe(200);
  expect(response.body).toEqual({ message: 'franchise deleted' });
  expect(DB.deleteFranchise).toHaveBeenCalledWith(franchiseId);
});

test('deleteFranchise 403 error', async () => {
  const franchiseId = 1;

  const response = await request(app)
    .delete(`/api/franchise/${franchiseId}`)
    .set('Authorization', 'Bearer non_admin_token');

  expect(response.status).toBe(403);
});

test('createStore', async () => {
  const franchiseId = 1;
  const store = { name: 'SLC' };
  DB.createStore.mockResolvedValue({ id: 1, name: 'SLC', totalRevenue: 0 });

  const response = await request(app)
    .post(`/api/franchise/${franchiseId}/store`)
    .set('Authorization', 'Bearer admin_token')
    .send(store);

  expect(response.status).toBe(200);
  expect(response.body).toEqual({ id: 1, name: 'SLC', totalRevenue: 0 });
  expect(DB.createStore).toHaveBeenCalledWith(franchiseId, store);
});

test('createStore 403 error', async () => {
  const franchiseId = 1;
  const store = { name: 'SLC' };

  const response = await request(app)
    .post(`/api/franchise/${franchiseId}/store`)
    .set('Authorization', 'Bearer non_admin_token')
    .send(store);

  expect(response.status).toBe(403);
});

test('deleteStore', async () => {
  const franchiseId = 1;
  const storeId = 1;
  DB.deleteStore.mockResolvedValue(true);

  const response = await request(app)
    .delete(`/api/franchise/${franchiseId}/store/${storeId}`)
    .set('Authorization', 'Bearer admin_token');

  expect(response.status).toBe(200);
  expect(response.body).toEqual({ message: 'store deleted' });
  expect(DB.deleteStore).toHaveBeenCalledWith(franchiseId, storeId);
});

test('deleteStore 403 error', async () => {
  const franchiseId = 1;
  const storeId = 1;

  const response = await request(app)
    .delete(`/api/franchise/${franchiseId}/store/${storeId}`)
    .set('Authorization', 'Bearer non_admin_token');

  expect(response.status).toBe(403);
});
