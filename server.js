import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import corsOptions from './config/corsOption.js';
import { loggerMiddleware } from './middlewares/logger.js';
import notFoundMiddleware from './middlewares/notFound.js';
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware.js';
import rootRoutes from './routes/rootRoutes.js';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import listRoutes from './routes/listRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT ?? 5000;

// Middlewares
app.use(cors(corsOptions));
app.use(loggerMiddleware);
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(express.static('public'));

// Routes
app.use('/', rootRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/todos', todoRoutes);
app.use('/api/v1/lists', listRoutes);

// Error handler middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
