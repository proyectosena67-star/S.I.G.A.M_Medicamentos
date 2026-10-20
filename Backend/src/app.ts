import cors from 'cors';
import express from 'express';
import { errorHandler, notFound } from './middlewares/error.middleware';
import routes from './routes';

const app = express();

app.set('trust proxy', true); // para que req.ip sea la IP real detrás de un proxy
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
