import dotenv from 'dotenv';

dotenv.config();

import cors from 'cors';
import express, { json } from 'express';
import { appRoutes } from './routes';
const port = process.env.PORT;

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/app', appRoutes);

app.listen(port, () => {
    console.info(`Server on: http://localhost:${port}`)
})