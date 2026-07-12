import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

// GET /api/menu
router.get('/', (req: Request, res: Response) => {
  try {
    const items = db.prepare('SELECT id, name, description, price, image, taste FROM menu_items').all();
    res.json(items);
  } catch (err) {
    console.error('Error fetching menu:', err);
    res.status(500).json({ error: 'Internal server error while fetching the menu.' });
  }
});

// GET /api/menu/:id
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = db.prepare('SELECT id, name, description, price, image, taste FROM menu_items WHERE id = ?').get(id);
    
    if (!item) {
       res.status(404).json({ error: `Menu item with id ${id} not found.` });
       return;
    }
    
    res.json(item);
  } catch (err) {
    console.error('Error fetching menu item:', err);
    res.status(500).json({ error: 'Internal server error while fetching the menu item.' });
  }
});

export default router;
