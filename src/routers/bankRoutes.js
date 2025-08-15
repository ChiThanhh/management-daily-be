import express from 'express';
import { createBank, deleteBank, getAllBanks, updateBank } from '../controllers/bankController.js';

const router = express.Router();

router.get('/', getAllBanks);
router.post('/', createBank);
router.put('/:id', updateBank);
router.delete('/:id', deleteBank);

export default router;