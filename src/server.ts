import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import 'express-async-error';
import express, { NextFunction, Request, Response } from 'express';
import { appRoutes, webRoutes } from './routes';
const port = process.env.PORT;

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: true, limit: '5000mb', parameterLimit:50000}));
app.use(express.json({limit: '5000mb'}));

// router status api
app.use('/api/ping', (req: Request, res: Response) => {
    res.json({pong: true}) 
});

app.use('/api/app', appRoutes);
app.use('/api/web', webRoutes);

app.listen(port, () => {
    console.info(`Server on: http://localhost:${port}`)
});

// Message Error
app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
    return response.json({
        status: 'Error',
        error: error.name,
        message: error.message
    });
});