import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import app from '../server/app';
import { connectDB, seedDatabase } from '../server/db';
import { MenuItem } from '../server/models/MenuItem';
import { User } from '../server/models/User';

describe('Orders Processing Suite', () => {
  let authToken: string;
  let testUserId: string;
  let menuItems: any[] = [];

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-suite-super-secret-key-99999';
    await connectDB();
    await seedDatabase();

    // Select all seeded dishes
    menuItems = await MenuItem.find();

    // Create a mock user
    const email = 'orderTestUser@example.com';
    const pwdHash = await bcrypt.hash('password123', 10);
    const user = await User.create({
      name: 'Test Order Client',
      email,
      passwordHash: pwdHash
    });

    testUserId = user._id.toString();

    // Create valid auth token
    const payload = { id: testUserId, email, name: 'Test Order Client' };
    authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  it('should successfully place a standard order and compute price total server-side', async () => {
    const firstItem = menuItems[0];
    const secondItem = menuItems[1];
    const expectedTotal = (firstItem.price * 2) + (secondItem.price * 1);

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        items: [
          { menuItemId: firstItem._id.toString(), quantity: 2, customization: 'Thin crust' },
          { menuItemId: secondItem._id.toString(), quantity: 1, customization: 'No cheese' }
        ]
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('total', expectedTotal);
    expect(res.body).toHaveProperty('status', 'placed');
    expect(res.body.items.length).toBe(2);
    expect(res.body.items[0].unitPrice).toBe(firstItem.price);
  });

  it('should reject orders with an empty items array with 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        items: []
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('at least one item');
  });

  it('should deny unauthorized checkout attempts with 401 Access Denied', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        items: [
          { menuItemId: menuItems[0]._id.toString(), quantity: 1 }
        ]
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
