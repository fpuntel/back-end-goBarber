import path from 'path';
import fs from 'fs';
import uploadConfig from '@config/upload';
import { injectable, inject } from 'tsyringe';
import User from '../infra/typeorm/entities/User';

import AppError from '@shared/errors/AppErrors';
import IUserRepository from '../repositories/IUserRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface Request{
    user_id: string;
    avatarFilename: string;
}


@injectable()
class UpdateUserAvatarServicer{
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,

        @inject('StorageProvider')
        private storageProvider: IStorageProvider,
    ) {}

    public async execute({ user_id, avatarFilename}: Request): Promise<User>{
       
        const user = await this.usersRepository.finById(user_id);

        if (!user){
            throw new AppError('Only authenticated users can change avatar.', 401);
        }

        if (user.avatar){
           await this.storageProvider.deleteFile(user.avatar);
        }

        const filename = await this.storageProvider.saveFile(avatarFilename);

        user.avatar = filename;

        // Atualiza o usuário no banco (update)
        await this.usersRepository.save(user);

        return user;
    }

}

export default UpdateUserAvatarServicer;