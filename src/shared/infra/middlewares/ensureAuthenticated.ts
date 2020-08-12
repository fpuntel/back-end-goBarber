import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../../../config/auth';
import AppError from '../../errors/AppErrors';

interface TokenPayload{
    iat: number;
    exp: number;
    sub: string;
}

export default function ensureAuthenticated(request: Request, response: Response, next: NextFunction): void {
    // Validação do toke
    const autheHeader = request.headers.authorization;

    if(!autheHeader){
        throw new AppError('JWT token is missing', 401);
    }

    // Isso eh feito pois o token vem no formato:
    // Baerer token
    const [, token] = autheHeader.split(' ');

    try{
        const decoded = verify(token, authConfig.jwt.secret);

        const { sub } = decoded as TokenPayload;

        // Salvo o sub (id do usuário) para ser utilizada em 
        // todas as rotas que utilizam a rota de autenticação
        // para fazer isso, foi criado o diretório @types e 
        // um arquivo express.d.ts para anexar um novo tipo
        // na variável request.
        request.user = {
            id: sub
        };

        return next();
    }catch {
        throw new AppError('Invalid JWT token', 401);
    }
}