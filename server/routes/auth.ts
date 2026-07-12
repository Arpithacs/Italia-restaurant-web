import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'italia-fallback-secret-key-12345';

// Helper to validate email format
const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// POST /api/auth/signup
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validate request body
    if (!name || !email || !password) {
       res.status(400).json({ error: 'All fields (name, email, password) are required.' });
       return;
    }

    if (!isValidEmail(email)) {
       res.status(400).json({ error: 'Invalid email address format.' });
       return;
    }

    if (password.length < 8) {
       res.status(400).json({ error: 'Password must be at least 8 characters long.' });
       return;
    }

    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
       res.status(409).json({ error: 'Email already registered.' });
       return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const info = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
      .run(name, email, passwordHash);

    const userId = Number(info.lastInsertRowid);

    // Create session token
    const payload = { id: userId, email, name };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: userId, name, email }
    });
  } catch (err: any) {
    console.error('Error in signup:', err);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
       res.status(400).json({ error: 'Email and password are required.' });
       return;
    }

    // Find user
    const user = db.prepare('SELECT id, name, email, password_hash FROM users WHERE email = ?').get(email) as any;
    if (!user) {
       res.status(401).json({ error: 'Invalid email or password.' });
       return;
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
       res.status(401).json({ error: 'Invalid email or password.' });
       return;
    }

    // Create token
    const payload = { id: user.id, email: user.email, name: user.name };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
     res.status(404).json({ error: 'Session not found.' });
     return;
  }
  res.json({ user: req.user });
});

export default router;
