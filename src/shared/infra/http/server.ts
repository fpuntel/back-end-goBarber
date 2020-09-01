import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';

import routes from './routes';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppErrors';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

// Cors evitra que sites que não seja da nossa aplicação
// possam acessar o backend
// Somente requisições via browser
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder)); // para mostrar os arquivos
app.use(routes);

// Middleawares de erros
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
    if (err instanceof AppError){
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        })
    }

    console.log(err);    

    return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
    })

});

app.listen(3333, () => {
    console.log('Server started on port 3333!')
});