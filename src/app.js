import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'casamento-backend' });
});

app.use('/api', apiRouter);
app.use(errorHandler);
