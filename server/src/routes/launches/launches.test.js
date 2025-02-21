const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');

describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  // afterAll(async () => {
  //   await mongoDisconnect();
  // });

  describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
      const res = await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200);
    });
  });

  describe('Test POST /launches', () => {
    const completeLaunchData = {
      mission: 'Kepler Exploration X',
      rocket: 'Explorer IS1',
      launchDate: 'December 27, 2030',
      target: 'Kepler-442 b',
    };
    const launchDataWithoutDate = {
      mission: 'Kepler Exploration X',
      rocket: 'Explorer IS1',
      target: 'Kepler-442 b',
    };
    const launchDataWithInvalidDate = {
      mission: 'Kepler Exploration X',
      rocket: 'Explorer IS1',
      launchDate: 'zoot',
      target: 'Kepler-442 b',
    };
    test('It should respond with 201 created', async () => {
      const res = await request(app)
        .post('/v1/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201);

      const reqDate = new Date(completeLaunchData.launchDate).valueOf();
      const resDate = new Date(res.body.launchDate).valueOf();
      expect(resDate).toBe(reqDate);
      expect(res.body).toMatchObject(launchDataWithoutDate);
    });

    test('It should catch missing required launch property', async () => {
      const res = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toStrictEqual({
        error: 'Missing required launch property',
      });
    });
    test('It should catch invalid launch date', async () => {
      const res = await request(app)
        .post('/v1/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toStrictEqual({
        error: 'Invalid launch date',
      });
    });
  });
});
