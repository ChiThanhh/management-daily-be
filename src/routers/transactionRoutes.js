import express from 'express';
import { calculateAndSaveDailyPrices, getAllTotalDaily, getMonthlyIncome } from '../controllers/transactionController.js';


const router = express.Router();

router.post('/', calculateAndSaveDailyPrices);
router.get('/daily-totals', getAllTotalDaily);
router.get('/monthly-income', getMonthlyIncome);

export default router;