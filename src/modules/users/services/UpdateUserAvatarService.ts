import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import uploadConfig from '@config/upload';
import { injectable, inject } from 'tsyringe';
import User from '../infra/typeorm/entities/User';

import AppError from '@shared/errors/AppErrors';
import IUserRepository from '../repositories/IUserRepository';

interface Request{
    user_id: string;
    avatarFilename: string;
}


@injectable()
class UpdateUserAvatarServicer{
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository
    ) {}

    public async execute({ user_id, avatarFilename}: Request): Promise<User>{
       
        const user = await this.usersRepository.finById(user_id);

        if (!user){
            throw new AppError('Only authenticated users can change avatar.', 401);
        }

        if (user.avatar){
            // Deletar avatar anterior
            const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);

            const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

            if (userAvatarFileExists){
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        user.avatar = avatarFilename;

        // Atualiza o usuário no banco (update)
        await this.usersRepository.save(user);

        return user;
    }

}

export default UpdateUserAvatarServicer;