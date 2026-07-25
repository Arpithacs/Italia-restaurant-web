import { Router, Request, Response } from 'express';
import { MenuItem } from '../models/MenuItem';

const router = Router();

// GET /api/menu
router.get('/', async (req: Request, res: Response) => {
  try {
    const items = await MenuItem.find();
    const formatted = items.map(item => ({
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      taste: item.taste
    }));
    res.json(formatted);
  } catch (err) {
    console.error('Error fetching menu:', err);
    res.status(500).json({ error: 'Failed to retrieve menu list.' });
  }
});

// GET /api/menu/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findById(id);
    
    if (!item) {
      res.status(404).json({ error: `Menu item with id ${id} not found.` });
      return;
    }

    res.json({
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      taste: item.taste
    });
  } catch (err) {
    console.error(`Error fetching menu item ${req.params.id}:`, err);
    res.status(500).json({ error: 'Internal server error fetching menu item.' });
  }
});

export default router;
