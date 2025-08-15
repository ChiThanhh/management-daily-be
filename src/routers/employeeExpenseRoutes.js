import express from 'express';
import { addExpense, getExpenses, getMonthlyEmployeeExpenses } from '../controllers/employeeExpenseController.js';

const router = express.Router();

router.post('/', addExpense);
router.get('/', getExpenses);
router.get('/monthly', getMonthlyEmployeeExpenses);

export default router;