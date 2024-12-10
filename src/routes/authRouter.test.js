// const request = require('supertest');
// const express = require('express');
// const { authRouter, setAuthUser } = require('./authRouter.js');
// const { DB, Role } = require('../database/database.js');
// const jwt = require('jsonwebtoken');

// jest.mock('../database/database.js');
// jest.mock('jsonwebtoken');

// const app = express();
// app.use(express.json());
// app.use(setAuthUser);
// app.use('/api/auth', authRouter);

// beforeEach(() => {
//   jest.resetAllMocks();
// });

const request = require('supertest');
const app = require('../service');

const testUser = { name: 'pizza diner', email: 'reg@test.com', password: 'a' };
let testUserAuthToken;

beforeAll(async () => {
  testUser.email = Math.random().toString(36).substring(2, 12) + '@test.com';
  const registerRes = await request(app).post('/api/auth').send(testUser);
  testUserAuthToken = registerRes.body.token;
  expectValidJwt(testUserAuthToken);
});

test('login', async () => {
  const loginRes = await request(app).put('/api/auth').send(testUser);
  expect(loginRes.status).toBe(200);
  expectValidJwt(loginRes.body.token);

  const expectedUser = { ...testUser, roles: [{ role: 'diner' }] };
  delete expectedUser.password;
  expect(loginRes.body.user).toMatchObject(expectedUser);
});

function expectValidJwt(potentialJwt) {
  expect(potentialJwt).toMatch(/^[a-zA-Z0-9\-_]*\.[a-zA-Z0-9\-_]*\.[a-zA-Z0-9\-_]*$/);
}

// test('register', async () => {
//   const newUser = { id: 2, name: 'Test User', email: 'test@user.com', roles: [{ role: Role.Diner }] };
//   DB.addUser.mockResolvedValue(newUser);
//   DB.loginUser.mockResolvedValue();

//   const response = await request(app)
//     .post('/api/auth')
//     .send({ name: 'Test User', email: 'test@user.com', password: 'password' });

//   expect(response.status).toBe(200);
//   expect(DB.addUser).toHaveBeenCalledWith(expect.objectContaining({ name: 'Test User', email: 'test@user.com' }));
// });

// test('register 400 error', async () => {
//   const response = await request(app).post('/api/auth').send({ email: 'test@user.com' });

//   expect(response.status).toBe(400);
//   expect(response.body).toEqual({ message: 'name, email, and password are required' });
// });

// test('login', async () => {
//   const user = { id: 1, name: 'Admin', email: 'admin@user.com', roles: [{ role: Role.Admin }] };
//   DB.getUser.mockResolvedValue(user);
//   DB.loginUser.mockResolvedValue();

//   const response = await request(app)
//     .put('/api/auth')
//     .send({ email: 'admin@user.com', password: 'admin' });

//   expect(response.status).toBe(200);
//   expect(response.body).toEqual({ user });
//   expect(DB.getUser).toHaveBeenCalledWith('admin@user.com', 'admin');
// });

// test('logout', async () => {
//   DB.logoutUser.mockResolvedValue();

//   const response = await request(app)
//     .delete('/api/auth')
//     .set('Authorization', 'Bearer mocked-token-1');

//   expect(response.status).toBe(200);
//   expect(response.body).toEqual({ message: 'logout successful' });
//   expect(DB.logoutUser).toHaveBeenCalledWith('mocked-token-1');
// });

// test('Authenticate token', async () => {
//   const updatedUser = { id: 1, email: 'new@user.com', name: 'Updated User' };

//   DB.updateUser.mockResolvedValue(updatedUser);

//   const response = await request(app)
//     .put('/api/auth/1')
//     .set('Authorization', 'Bearer mocked-token-1')
//     .send({ email: 'new@user.com', password: 'newpassword' });

//   expect(response.status).toBe(200);
//   expect(response.body).toEqual(updatedUser);
//   expect(DB.updateUser).toHaveBeenCalledWith(1, 'new@user.com', 'newpassword');
// });

// test('Authenticate token 401 error', async () => {
//   const response = await request(app).delete('/api/auth');

//   expect(response.status).toBe(401);
//   expect(response.body).toEqual({ message: 'unauthorized' });
// });

// test('updateUser', async () => {
//   const updatedUser = { id: 1, email: 'new@user.com' };
//   DB.updateUser.mockResolvedValue(updatedUser);

//   const response = await request(app)
//     .put('/api/auth/1')
//     .set('Authorization', 'Bearer mocked-token-1')
//     .send({ email: 'new@user.com', password: 'newpassword' });

//   expect(response.status).toBe(200);
//   expect(response.body).toEqual(updatedUser);
//   expect(DB.updateUser).toHaveBeenCalledWith(1, 'new@user.com', 'newpassword');
// });

// test('updateUser 403 error', async () => {
//   jwt.verify.mockImplementation(() => ({ id: 2, roles: [{ role: Role.Diner }] }));

//   const response = await request(app)
//     .put('/api/auth/1')
//     .set('Authorization', 'Bearer mocked-token-2')
//     .send({ email: 'new@user.com' });

//   expect(response.status).toBe(403);
//   expect(response.body).toEqual({ message: 'unauthorized' });
// });