import { Router, Request, Response } from 'express';
import { FeedbackMessage } from '../models/FeedbackMessage';

const router = Router();

// POST /api/feedback
router.post('/', async (req: Request, res: Response) => {
  try {
    const { message, rating } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Feedback message is required.' });
      return;
    }

    const numericRating = rating !== undefined ? Number(rating) : undefined;

    await FeedbackMessage.create({ message, rating: numericRating });

    res.json({ success: true, message: 'Your feedback has been stored successfully.' });
  } catch (err) {
    console.error('Error storing feedback message:', err);
    res.status(500).json({ error: 'Internal server error while storing your feedback.' });
  }
});

export default router;
