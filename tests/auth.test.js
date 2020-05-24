const {startTestApp, stopTestApp} = require('./utils/startTestApp.js');
const axios = require('axios');

beforeAll(async(done) => {
  await startTestApp();
  done();
});

afterAll(async (done) => {
  await stopTestApp();
  done();
});

const apiClient = axios.create({
  baseURL: 'http://localhost:1337'
});


describe('Authentication', () => {
  test('server should respond', async () => {
    await apiClient.head('/admin');
  });

  test('register should return a jwt', async () => {
    const res = await apiClient.post('/auth/local/register', {
      'username': 'Test User',
      'email': 'test@coding-events.com',
      'password': '123456'
    });
    expect(res.data.jwt).toBeTruthy();
    expect(res.data.user.username).toBe('Test User');
  });

  test('create event', async() => {
    const res = await apiClient.post('/auth/local', {
      'identifier': 'Test User',
      'password': '123456'
    });

    const {jwt, user: {id: userId}} = res.data;
    expect(jwt).toBeTruthy();

    const testEvent = {
      title: 'First Event',
      details: 'Some test details',
      date: new Date(),
      location: 'Leipzig'
    };

    const {data: event} = await apiClient.post('/events', testEvent, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });

    expect(event.title).toBe(testEvent.title);
    expect(event.host.id).toBe(userId);

  });
});