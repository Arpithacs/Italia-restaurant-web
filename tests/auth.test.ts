import request from 'supertest';
import app from '../server/app';
import { connectDB } from '../server/db';
import mongoose from 'mongoose';
import { User } from '../server/models/User';

describe('Authentication Suite', () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-suite-super-secret-key-99999';
    await connectDB();
    await User.deleteMany({});
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  const uniqueEmail = `user_${Date.now()}@example.com`;
  const password = 'securePassword123';

  it('should successfully sign up a new user and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'John Doe',
        email: uniqueEmail,
        password: password
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.name).toBe('John Doe');
    expect(res.body.user.email).toBe(uniqueEmail);
    expect(res.body.user).toHaveProperty('id');
  });

  it('should prevent signup with a duplicate email and return 409', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Another User',
        email: uniqueEmail,
        password: 'differentPassword777'
      });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('Email already registered');
  });

  it('should sign in successfully with correct credentials and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: uniqueEmail,
        password: password
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe(uniqueEmail);
  });

  it('should fail sign in with an incorrect password and return 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: uniqueEmail,
        password: 'wrongPassword99'
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('Invalid email or password');
  });
});
