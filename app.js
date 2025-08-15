import express from 'express';
import cors from 'cors';
import authRoutes from './src/routers/authRoutes.js'
import bankRoutes from './src/routers/bankRoutes.js'
import bankPriceRoutes from './src/routers/bankPriceRoutes.js'
import employeeRoutes from './src/routers/employeeRoutes.js'
import employeeExpenseRoutes from './src/routers/employeeExpenseRoutes.js'
import transactionRoutes from './src/routers/transactionRoutes.js'
const app = express();

app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/banks', bankRoutes);
app.use('/api/bank-price', bankPriceRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/employee-expense', employeeExpenseRoutes);
app.use('/api/transactions', transactionRoutes);

export default app;