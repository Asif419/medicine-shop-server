import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './middlewares/globalErrorHandler';
import cookieParser from 'cookie-parser';
const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  }),
);



app.use(globalErrorHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Medicine Shop');
});
// console.log(process.cwd());
export default app;
