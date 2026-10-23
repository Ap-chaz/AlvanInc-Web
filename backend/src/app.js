import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { allowedOrigins } from './config.js';
import { adminOrigin } from './middleware/adminOrigin.js';
import { notFound, errorHandler } from './middleware/errors.js';
import routes from './routes/index.js';

const app = express();

// Render sits behind 4 proxies (see the notes on trust proxy): this lets Express read the real visitor address.
app.set('trust proxy', 4);

app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Admin forms (a project with its approach steps, a package with its features) can pass 10kb,
// so signed-in editing gets a larger limit. The public enquiry form keeps the small one.
app.use('/api/admin', express.json({ limit: '100kb' }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use('/api/admin', adminOrigin);

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
