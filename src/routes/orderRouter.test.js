const request = require('supertest');
const express = require('express');
const { Role, DB } = require('../database/database.js');
const { authRouter } = require('./authRouter.js');
const orderRouter = require('./orderRouter.js');
const { asyncHandler, StatusCodeError } = require('../endpointHelper.js');

jest.mock('../database/database.js', () => ({
  DB: {
    getMenu: jest.fn(),
    addMenuItem: jest.fn(),
    getOrders: jest.fn(),
    addDinerOrder: jest.fn(),
  },
  Role: {
    Admin: 'Admin',
  },
}));

jest.mock('./authRouter.js', () => ({
  authRouter: {
    authenticateToken: jest.fn((req, res, next) => next()),
  },
}));


let app;

beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/order', orderRouter);
});

afterEach(() => {
    jest.clearAllMocks();
});


test('getMenu', async () => {
    const mockMenu = [{ id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' }];
    DB.getMenu.mockResolvedValue(mockMenu);

    const response = await request(app).get('/api/order/menu');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockMenu);
});

// test('addMenuItem', async () => {
//     const mockMenuItem = { title: 'Student', description: 'No topping, no sauce, just carbs', image: 'pizza9.png', price: 0.0001 };
//     const mockMenu = [{ id: 1, ...mockMenuItem }];
//     DB.addMenuItem.mockResolvedValue();
//     DB.getMenu.mockResolvedValue(mockMenu);

//     const response = await request(app)
//     .put('/api/order/menu')
//     .set('Authorization', 'Bearer someToken')
//     .send(mockMenuItem);

//     expect(response.status).toBe(200);
//     expect(response.body).toEqual(mockMenu);
// });

// test('addMenuItem StatusCodeError', async () => {
//     const mockMenuItem = { title: 'Student', description: 'No topping, no sauce, just carbs', image: 'pizza9.png', price: 0.0001 };
//     const mockError = new Error('unable to add menu item');
//     mockError.statusCode = 403;
//     DB.addMenuItem.mockRejectedValue(mockError);

//     const response = await request(app)
//     .put('/api/order/menu')
//     .set('Authorization', 'Bearer someToken')
//     .send(mockMenuItem);

//     expect(response.status).toBe(403);
//     expect(response.body.message).toBe('unable to add menu item');
// });

test('getOrders', async () => {
    const mockOrders = { dinerId: 4, orders: [{ id: 1, franchiseId: 1, storeId: 1, date: '2024-06-05T05:14:40.000Z', items: [{ id: 1, menuId: 1, description: 'Veggie', price: 0.05 }] }], page: 1 };
    DB.getOrders.mockResolvedValue(mockOrders);

    const response = await request(app)
    .get('/api/order')
    .set('Authorization', 'Bearer someToken');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockOrders);
});

// test('createOrder', async () => {
//     const orderReq = { franchiseId: 1, storeId: 1, items: [{ menuId: 1, description: 'Veggie', price: 0.05 }] };
//     const mockOrder = { order: { franchiseId: 1, storeId: 1, items: [{ menuId: 1, description: 'Veggie', price: 0.05 }], id: 1 }, jwt: '1111111111', reportUrl: 'url' };
//     DB.addDinerOrder.mockResolvedValue({ id: 1, ...orderReq });

//     global.fetch = jest.fn().mockResolvedValue({
//     ok: true,
//     json: jest.fn().mockResolvedValue({ jwt: '1111111111', reportUrl: 'url' }),
//     });

//     const response = await request(app)
//     .post('/api/order')
//     .set('Authorization', 'Bearer someToken')
//     .send(orderReq);

//     expect(response.status).toBe(200);
//     expect(response.body).toEqual(mockOrder);
// });

// test('createOrder 500 status code', async () => {
//     const orderReq = { franchiseId: 1, storeId: 1, items: [{ menuId: 1, description: 'Veggie', price: 0.05 }] };
//     const mockOrder = { order: { franchiseId: 1, storeId: 1, items: [{ menuId: 1, description: 'Veggie', price: 0.05 }], id: 1 }, jwt: '1111111111' };
//     DB.addDinerOrder.mockResolvedValue({ id: 1, ...orderReq });

//     global.fetch = jest.fn().mockResolvedValue({
//     ok: false,
//     json: jest.fn().mockResolvedValue({ reportUrl: 'url' }),
//     });

//     const response = await request(app)
//     .post('/api/order')
//     .set('Authorization', 'Bearer someToken')
//     .send(orderReq);

//     expect(response.status).toBe(500);
//     expect(response.body.message).toBe('Failed to fulfill order at factory');
// });
