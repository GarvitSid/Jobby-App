const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');

describe('Auth routes', () => {
  beforeAll(async () => {
    // ensure connection from setup
    if (mongoose.connection.readyState === 0) {
      await require('mongoose').connect(process.env.MONGO_URI);
    }
  });

  afterAll(async () => {
    await User.deleteMany({});
    if (global.__MONGO_TEARDOWN__) await global.__MONGO_TEARDOWN__();
  });

  test('register and login user', async () => {
    const username = `user${Date.now()}`;
    const password = 'Password123!';

    const resRegister = await request(app)
      .post('/register')
      .send({ username, password })
      .set('Accept', 'application/json');

    expect(resRegister.status).toBe(201);
    expect(resRegister.body).toHaveProperty('message');

    const resLogin = await request(app)
      .post('/login')
      .send({ username, password })
      .set('Accept', 'application/json');

    expect(resLogin.status).toBe(200);
    // Login should set an HttpOnly cookie named jwt_token
    expect(resLogin.headers['set-cookie']).toBeDefined();
    const cookies = resLogin.headers['set-cookie'].join('; ');
    expect(cookies).toMatch(/jwt_token=/);
  });
});
