import { Router } from 'express';
import { SupportMessage } from '../models/SupportMessage.js';

const router = Router();

router.post('/contact', async (req, res) => {
  try {
    const message = await SupportMessage.create({
      ...req.body,
      user: req.user?._id,
    });
    res.status(201).json({ message: 'Thanks for contacting us!', ticketId: message._id });
  } catch (error) {
    console.error('Support message error', error);
    res.status(500).json({ message: 'Unable to send message' });
  }
});

export default router;

