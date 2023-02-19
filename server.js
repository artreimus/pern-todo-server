import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import corsOptions from './config/corsOption.js';
import { loggerMiddleware } from './middlewares/logger.js';
import notFoundMiddleware from './middlewares/notFound.js';
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware.js';
import rootRoutes from './routes/rootRoutes.js';
import todoRoutes from './routes/todoRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT ?? 5000;

// Middlewares
app.use(cors(corsOptions));
app.use(loggerMiddleware);
app.use(express.json({ limit: '50mb' }));

app.use(express.static('public'));

// Routes
app.use('/', rootRoutes);
app.use('/api/v1/todos', todoRoutes);

// Error handler middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
