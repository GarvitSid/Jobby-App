const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');

describe('Profile route', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await require('mongoose').connect(process.env.MONGO_URI);
    }
  });

  afterAll(async () => {
    await Profile.deleteMany({});
    await User.deleteMany({});
    if (global.__MONGO_TEARDOWN__) await global.__MONGO_TEARDOWN__();
  });

  test('returns stored profile details for an authenticated user', async () => {
    const username = `profile${Date.now()}`;
    const password = 'Password123!';

    await request(app).post('/register').send({username, password}).set('Accept', 'application/json');

    const loginResponse = await request(app)
      .post('/login')
      .send({username, password})
      .set('Accept', 'application/json');

    // Extract cookie set by login
    const setCookie = loginResponse.headers['set-cookie'];
    expect(setCookie).toBeDefined();
    const cookieHeader = setCookie.join('; ');
    const tokenMatch = cookieHeader.match(/jwt_token=([^;]+)/);
    expect(tokenMatch).toBeTruthy();
    const token = tokenMatch[1];

    await Profile.findOneAndUpdate(
      {username},
      {
        profile_image_url: 'https://example.com/custom-avatar.png',
        short_bio: 'Custom bio for testing',
      },
      {upsert: true, returnDocument: 'after', setDefaultsOnInsert: true},
    );

    const profileResponse = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.profile_details).toMatchObject({
      name: username,
      profile_image_url: 'https://example.com/custom-avatar.png',
      short_bio: 'Custom bio for testing',
    });
  });
});