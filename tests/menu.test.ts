import request from 'supertest';
import app from '../server/app';
import { connectDB, seedDatabase } from '../server/db';
import mongoose from 'mongoose';

describe('Menu Endpoint Suite', () => {
  beforeAll(async () => {
    await connectDB();
    await seedDatabase();
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  it('should return seeded menu items', async () => {
    const res = await request(app).get('/api/menu');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(8);

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
    const fakeObjectId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/menu/${fakeObjectId}`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('not found');
  });
});
