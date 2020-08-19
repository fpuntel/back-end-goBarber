import { sign, verify } from 'jsonwebtoken';
import User from '../infra/typeorm/entities/User';
import authConfig from '@config/auth';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';
import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface Request{
    email: string;
    password: string;
}

interface Response{
    user: User;
    token: string;
}

@injectable()
class AuthenticateUserService{
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider
    ) {}

    public async execute({ email, password }: Request): Promise<Response>{

        const user = await this.usersRepository.findByEmail(email);


        if (!user){
            throw new AppError('Incorrect email/password combination.', 401);
        }

        // Se passou do if o email existe e podemos acessar:
        // user.password (senha criptografada)

        const passwordMatched = await this.hashProvider.compareHash(password, user.password);

        if (!passwordMatched){
            throw new AppError('Incorrect email/password combination.', 401);
        }

        // Usuario autenticado

        // Parametros:
        // 1 - informações que serão carregadas
        // 2 - um token que só a aplicação sabe.
        //     pode ser criada no md5
        // 3 - algumas configurações do toke
        const token = sign({}, authConfig.jwt.secret,{
            subject: user.id,
            expiresIn: authConfig.jwt.expiresIn, // 1d vai ficar logado
        });

        return {
            user,
            token,
        };

    }
}

export default AuthenticateUserService;