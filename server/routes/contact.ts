import { Router, Request, Response } from 'express';
import { ContactMessage } from '../models/ContactMessage';

const router = Router();

// POST /api/contact
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required fields.' });
      return;
    }

    await ContactMessage.create({ name, email, message });

    res.json({ success: true, message: 'Your message has been stored successfully.' });
  } catch (err) {
    console.error('Error handling contact message:', err);
    res.status(500).json({ error: 'Internal server error while storing your contact message.' });
  }
});

export default router;
