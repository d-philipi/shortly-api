import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './routes/userRoute.js';
import urlsRoute from './routes/urlsRoute.js';
import rankingRoute from './routes/rankingRoute.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(userRoute);
app.use(urlsRoute);
app.use(rankingRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running in port: ${port}`));