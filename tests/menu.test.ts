import * as fs from 'fs';
import * as path from 'path';

// Override database path before any database connection starts
const testDbPath = path.join(process.cwd(), 'test_menu.sqlite');
process.env.DATABASE_PATH = testDbPath;

import request from 'supertest';
import app from '../server/app';
import db, { seedDatabase } from '../server/db';

describe('Menu Endpoint Suite', () => {
  beforeAll(() => {
    // Seed database to ensure 8 items exist
    seedDatabase();
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

  it('should return exactly 8 seeded menu items', async () => {
    const res = await request(app).get('/api/menu');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(8);

    // Verify first food item matches Pizza Margherita
    const margherita = res.body.find((item: any) => item.name === 'Pizza Margherita');
    expect(margherita).toBeDefined();
    expect(margherita).toHaveProperty('price', 450);
    expect(margherita).toHaveProperty('description');
    expect(margherita).toHaveProperty('image');
  });

  it('should return a single menu item when queried by its specific id', async () => {
    const resAll = await request(app).get('/api/menu');
    const firstItemId = resAll.body[0].id;

    const resSingle = await request(app).get(`/api/menu/${firstItemId}`);
    expect(resSingle.status).toBe(200);
    expect(resSingle.body).toHaveProperty('id', firstItemId);
    expect(resSingle.body.name).toBe(resAll.body[0].name);
  });

  it('should return 404 for a non-existent item id', async () => {
    const res = await request(app).get('/api/menu/9999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('not found');
  });
});
