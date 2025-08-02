import express from 'express';
import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  addComment,
  rateTicket,
  getTicketStats,
  assignTicket,
  closeTicket,
  reopenTicket
} from '../controllers/ticketController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { uploadMultiple } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// General routes
router.get('/stats', getTicketStats);
router.get('/', getTickets);
router.post('/', uploadMultiple('attachments', 5), createTicket);

// Specific ticket routes
router.get('/:id', getTicketById);
router.put('/:id', updateTicket);
router.delete('/:id', authorize('admin'), deleteTicket);

// Ticket actions
router.post('/:id/comments', addComment);
router.put('/:id/rate', rateTicket);
router.put('/:id/assign', authorize('admin', 'agent'), assignTicket);
router.put('/:id/close', closeTicket);
router.put('/:id/reopen', reopenTicket);

export default router;
