import express from 'express';
import { getPriceByBank, upsertBankPrice } from '../controllers/bankPriceController.js';

const router = express.Router();

router.post('/upsert', upsertBankPrice);
router.get('/:bank_id', getPriceByBank);

export default router;