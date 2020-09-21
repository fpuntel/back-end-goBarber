import { injectable, inject } from 'tsyringe';
import User from '../infra/typeorm/entities/User';

import AppError from '@shared/errors/AppErrors';
import IUserRepository from '../repositories/IUserRepository';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface Request{
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUserService{
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({ name, email, password}: Request): Promise<User>{

        const checkUserExists = await this.usersRepository.findByEmail(email);

        if (checkUserExists){
            throw new AppError('Email addres already used.');
        }

        const hasedPassword = await this.hashProvider.generateHash(password);

        const user = await this.usersRepository.create({
            name,
            email,
            password: hasedPassword,
        });

        await this.cacheProvider.invalidatePrefix('providers-list');

        return user;
    }
}

export default CreateUserService;