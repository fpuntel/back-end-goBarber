import { hash } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';
import User from '../infra/typeorm/entities/User';

import AppError from '@shared/errors/AppErrors';
import IUserRepository from '../repositories/IUserRepository';

interface Request{
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUserService{
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository
    ) {}

    public async execute({ name, email, password}: Request): Promise<User>{

        const checkUserExists = await this.usersRepository.findByEmail(email);

        if (checkUserExists){
            throw new AppError('Email addres already used.');
        }

        const hasedPassword = await hash(password,8);

        const user = await this.usersRepository.create({
            name,
            email,
            password: hasedPassword,
        });

        return user;
    }
}

export default CreateUserService;