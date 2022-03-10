import dotenv from 'dotenv';

dotenv.config();

import cors from 'cors';
import express, { json } from 'express';
import { appRoutes, webRoutes } from './routes';
const port = process.env.PORT;

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/app', appRoutes);
app.use('/api/web', webRoutes);

app.get('/ping', async(req, res) => {
    return res.json({pong: true});
})
app.listen(port, () => {
    console.info(`Server on: http://localhost:${port}`)
})