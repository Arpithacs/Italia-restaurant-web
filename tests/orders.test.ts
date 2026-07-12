import * as fs from 'fs';
import * as path from 'path';

// Override database path before any database connection starts
const testDbPath = path.join(process.cwd(), 'test_orders.sqlite');
process.env.DATABASE_PATH = testDbPath;
process.env.JWT_SECRET = 'test-suite-super-secret-key-99999';

import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../server/app';
import db, { seedDatabase } from '../server/db';
import bcrypt from 'bcryptjs';

describe('Orders Processing Suite', () => {
  let authToken: string;
  let testUserId: number;
  let menuItems: any[] = [];

  beforeAll(async () => {
    // Seed and prepare database
    seedDatabase();
    
    // Select all seeded dishes
    menuItems = db.prepare('SELECT id, name, price FROM menu_items').all();

    // Create a mock user
    const email = 'orderTestUser@example.com';
    const pwdHash = await bcrypt.hash('password123', 10);
    const userInsert = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
      .run('Test Order Client', email, pwdHash);
    
    testUserId = Number(userInsert.lastInsertRowid);

    // Create valid auth token
    const payload = { id: testUserId, email, name: 'Test Order Client' };
    authToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
  });

  afterAll(() => {
    db.close();
    if (fs.existsSync(testDbPath)) {
      try {
        fs.unlinkSync(testDbPath);
      } catch (err) {
        console.error('Failed to clean up test database file:', err);
      }
    }
  });

  it('should successfully place a standard order and compute price total server-side', async () => {
    // We order 2 of item #0 and 1 of item #1
    const firstItem = menuItems[0];  // price typically 450
    const secondItem = menuItems[1]; // price typically 500
    const expectedTotal = (firstItem.price * 2) + (secondItem.price * 1);

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        items: [
          { menuItemId: firstItem.id, quantity: 2, customization: 'Thin crust' },
          { menuItemId: secondItem.id, quantity: 1, customization: 'No cheese' }
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
          { menuItemId: menuItems[0].id, quantity: 1 }
        ]
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
