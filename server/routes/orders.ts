import { Router, Response } from 'express';
import db from '../db';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// POST /api/orders
// Submit a brand new food order
router.post('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
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

    // Begin database transaction for atomic inserts and queries
    let total = 0;
    const validatedItems: Array<{
      menuItemId: number;
      quantity: number;
      customization: string;
      unitPrice: number;
      name: string;
    }> = [];

    // Verify all menu items exist and lookup reliable prices
    for (const item of items) {
      const { menuItemId, quantity, customization } = item;

      if (!menuItemId || !quantity || typeof quantity !== 'number' || quantity <= 0) {
         res.status(400).json({ error: 'Invalid item format or quantity.' });
         return;
      }

      // Query database for item info
      const menuItem = db.prepare('SELECT id, name, price FROM menu_items WHERE id = ?').get(menuItemId) as {
        id: number;
        name: string;
        price: number;
      } | undefined;

      if (!menuItem) {
         res.status(400).json({ error: `Menu item with id ${menuItemId} does not exist.` });
         return;
      }

      const itemTotal = menuItem.price * quantity;
      total += itemTotal;

      validatedItems.push({
        menuItemId: menuItem.id,
        quantity,
        customization: customization || '',
        unitPrice: menuItem.price,
        name: menuItem.name
      });
    }

    // Write order and individual order items inside a database transaction
    const runInTransaction = db.transaction(() => {
      // 1. Insert order record
      const orderInsert = db.prepare('INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)')
        .run(userId, total, 'placed');
      
      const orderId = Number(orderInsert.lastInsertRowid);

      // 2. Insert nested order item details
      const itemInsert = db.prepare(`
        INSERT INTO order_items (order_id, menu_item_id, quantity, customization, unit_price)
        VALUES (?, ?, ?, ?, ?)
      `);

      for (const item of validatedItems) {
        itemInsert.run(orderId, item.menuItemId, item.quantity, item.customization, item.unitPrice);
      }

      return orderId;
    });

    const orderId = runInTransaction();

    res.status(201).json({
      id: orderId,
      userId,
      total,
      status: 'placed',
      items: validatedItems
    });
  } catch (err) {
    console.error('Error inserting order:', err);
    res.status(500).json({ error: 'Internal server error while placing the order.' });
  }
});

// GET /api/orders/me
// Retrieve previous orders submitted by the authenticated user
router.get('/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
       res.status(401).json({ error: 'User is not authenticated.' });
       return;
    }

    // Query list of user's orders, sorted by most recent
    const orders = db.prepare('SELECT id, total, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(userId) as Array<{
      id: number;
      total: number;
      status: string;
      created_at: string;
    }>;

    // Fetch items matching each order
    const populatedOrders = orders.map(order => {
      const items = db.prepare(`
        SELECT oi.id, oi.menu_item_id, oi.quantity, oi.customization, oi.unit_price, mi.name, mi.image
        FROM order_items oi
        JOIN menu_items mi ON oi.menu_item_id = mi.id
        WHERE oi.order_id = ?
      `).all(order.id);

      return {
        ...order,
        items
      };
    });

    res.json(populatedOrders);
  } catch (err) {
    console.error('Error loading historic orders:', err);
    res.status(500).json({ error: 'Internal server error while retrieving order history.' });
  }
});

export default router;
