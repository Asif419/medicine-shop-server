import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './middlewares/globalErrorHandler';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/auth.routes';
import { userRoutes } from './modules/users/user.routes';
import medicineRouter from './modules/medicine/medicine.routes';
import OrderMedicineRouter from './modules/medicine-order/medicine-order.routes';
const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://medicine-shop-client.vercel.app'],
    credentials: true,
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/medicine', medicineRouter);
app.use('/api/orders', OrderMedicineRouter);

app.use(globalErrorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Medicine Shop');
});
// console.log(process.cwd());
export default app;
