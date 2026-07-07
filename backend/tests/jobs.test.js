const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Job = require('../models/Job');
const User = require('../models/User');

const registerAndLogin = async username => {
  const password = 'Password123!';

  const resRegister = await request(app)
    .post('/register')
    .send({username, password})
    .set('Accept', 'application/json');
  expect(resRegister.status).toBe(201);

  const resLogin = await request(app)
    .post('/login')
    .send({username, password})
    .set('Accept', 'application/json');
  expect(resLogin.status).toBe(200);

  // Extract token from set-cookie so tests can authenticate using Authorization header
  expect(resLogin.headers['set-cookie']).toBeDefined();
  const cookieHeader = resLogin.headers['set-cookie'].join('; ');
  const tokenMatch = cookieHeader.match(/jwt_token=([^;]+)/);
  expect(tokenMatch).toBeTruthy();
  return tokenMatch[1];
};

describe('Jobs routes', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await require('mongoose').connect(process.env.MONGO_URI);
    }
  });

  afterAll(async () => {
    await Job.deleteMany({});
    await User.deleteMany({});
    if (global.__MONGO_TEARDOWN__) await global.__MONGO_TEARDOWN__();
  });

  test('create job doc, register/login and fetch jobs', async () => {
    const job = await Job.create({
      title: 'Test Engineer',
      company_logo_url: 'https://example.com/logo.png',
      employment_type: 'FULLTIME',
      job_description: 'Test job description',
      location: 'Remote',
      package_per_annum: 1200000,
      rating: 4.5,
    });

    const username = `user${Date.now()}`;
    const token = await registerAndLogin(username);

    const resJobs = await request(app)
      .get('/jobs')
      .query({page: 1, limit: 2})
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(resJobs.status).toBe(200);
    expect(Array.isArray(resJobs.body.jobs)).toBe(true);
    expect(resJobs.body.total).toBeGreaterThanOrEqual(1);

    const saveResponse = await request(app)
      .post(`/jobs/${job._id}/save`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    expect(saveResponse.status).toBe(200);

    const applyResponse = await request(app)
      .post(`/jobs/${job._id}/apply`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    expect(applyResponse.status).toBe(200);

    const removeSavedResponse = await request(app)
      .delete(`/jobs/${job._id}/save`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    expect(removeSavedResponse.status).toBe(200);

    const removeAppliedResponse = await request(app)
      .delete(`/jobs/${job._id}/apply`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    expect(removeAppliedResponse.status).toBe(200);

    const savedJobsResponse = await request(app)
      .get('/saved-jobs')
      .query({page: 1, limit: 2})
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(savedJobsResponse.status).toBe(200);
    expect(savedJobsResponse.body.total).toBe(0);

    const appliedJobsResponse = await request(app)
      .get('/applied-jobs')
      .query({page: 1, limit: 2})
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(appliedJobsResponse.status).toBe(200);
    expect(appliedJobsResponse.body.total).toBe(0);
  });

  test('paginates jobs list responses', async () => {
    await Job.insertMany([
      {
        title: 'Job 1',
        company_logo_url: 'https://example.com/logo1.png',
        employment_type: 'FULLTIME',
        job_description: 'Description 1',
        location: 'Remote',
        package_per_annum: 1000000,
        rating: 4.1,
      },
      {
        title: 'Job 2',
        company_logo_url: 'https://example.com/logo2.png',
        employment_type: 'PARTTIME',
        job_description: 'Description 2',
        location: 'Remote',
        package_per_annum: 1100000,
        rating: 4.2,
      },
      {
        title: 'Job 3',
        company_logo_url: 'https://example.com/logo3.png',
        employment_type: 'FREELANCE',
        job_description: 'Description 3',
        location: 'Remote',
        package_per_annum: 1200000,
        rating: 4.3,
      },
    ]);

    const username = `pageuser${Date.now()}`;
    const token = await registerAndLogin(username);

    const resJobs = await request(app)
      .get('/jobs')
      .query({page: 2, limit: 2})
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(resJobs.status).toBe(200);
    expect(resJobs.body.page).toBe(2);
    expect(resJobs.body.total_pages).toBeGreaterThanOrEqual(2);
    expect(Array.isArray(resJobs.body.jobs)).toBe(true);
  });
});
