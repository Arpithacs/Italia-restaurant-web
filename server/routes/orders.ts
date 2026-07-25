import { Router, Response } from 'express';
import { Order } from '../models/Order';
import { MenuItem } from '../models/MenuItem';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// POST /api/orders
// Submit a brand new food order
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'User is not authenticated.' });
      return;
    }

    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Order must contain at least one item.' });
      return;
    }

    let total = 0;
    const validatedItems: Array<{
      menuItem: any;
      quantity: number;
      customization: string;
      unitPrice: number;
      name: string;
      image: string;
    }> = [];

    // Verify all menu items exist and lookup reliable prices
    for (const item of items) {
      const { menuItemId, quantity, customization } = item;

      if (!menuItemId || !quantity || typeof quantity !== 'number' || quantity <= 0) {
        res.status(400).json({ error: 'Invalid item format or quantity.' });
        return;
      }

      const menuItem = await MenuItem.findById(menuItemId);

      if (!menuItem) {
        res.status(400).json({ error: `Menu item with id ${menuItemId} does not exist.` });
        return;
      }

      const itemTotal = menuItem.price * quantity;
      total += itemTotal;

      validatedItems.push({
        menuItem: menuItem._id,
        quantity,
        customization: customization || '',
        unitPrice: menuItem.price,
        name: menuItem.name,
        image: menuItem.image
      });
    }

    // Save order in MongoDB
    const userIdStr = String(userId);
    const newOrder = await Order.create({
      user: userIdStr,
      total,
      status: 'placed',
      items: validatedItems
    });

    res.status(201).json({
      id: (newOrder as any)._id.toString(),
      userId: userIdStr,
      total,
      status: (newOrder as any).status,
      items: validatedItems.map(i => ({
        menuItemId: i.menuItem.toString(),
        quantity: i.quantity,
        customization: i.customization,
        unitPrice: i.unitPrice,
        name: i.name,
        image: i.image
      }))
    });
  } catch (err) {
    console.error('Error inserting order into MongoDB:', err);
    res.status(500).json({ error: 'Internal server error while placing the order.' });
  }
});

// GET /api/orders/me
// Retrieve previous orders submitted by the authenticated user
router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'User is not authenticated.' });
      return;
    }

    const userIdStr = String(userId);

    // Query list of user's orders, sorted by most recent
    const orders = await Order.find({ user: userIdStr as any }).sort({ createdAt: -1 });

    const populatedOrders = orders.map(order => ({
      id: (order as any)._id.toString(),
      total: order.total,
      status: order.status,
      created_at: order.createdAt,
      items: order.items.map((item: any) => ({
        id: item._id ? item._id.toString() : item.menuItem.toString(),
        menu_item_id: item.menuItem ? item.menuItem.toString() : '',
        quantity: item.quantity,
        customization: item.customization || '',
        unit_price: item.unitPrice,
        name: item.name,
        image: item.image || ''
      }))
    }));

    res.json(populatedOrders);
  } catch (err) {
    console.error('Error loading historic orders from MongoDB:', err);
    res.status(500).json({ error: 'Internal server error while retrieving order history.' });
  }
});

export default router;
