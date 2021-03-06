import { injectable, inject } from 'tsyringe';
import User from '../infra/typeorm/entities/User';

import AppError from '@shared/errors/AppErrors';
import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface Request{
    user_id: string;
    name: string;
    email: string;
    old_password?: string;
    password?: string;
}

@injectable()
class UpdateProfileService{
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ user_id, name, email, password, old_password }: Request): Promise<User>{
        console.log('aaa');
        const user = await this.usersRepository.finById(user_id);
        console.log('aaa');
        if (!user) {
            throw new AppError('User not found');
        }
        console.log('bbb');

        const userWithUpdateEmail = await this.usersRepository.findByEmail(email);
        console.log('ccc');
        if( userWithUpdateEmail && userWithUpdateEmail.id !== user_id) {
            throw new AppError('E-mail already in use.');
        }
        console.log('ddd');
        user.name = name;
        user.email = email;

        if (password && !old_password){
            throw new AppError('You need to inform the old password to set a new password.')
        }
        console.log('eeee');

        if(password && old_password){
            const checkOldPassword = await this.hashProvider.compareHash(
                old_password,
                user.password
            );
    
            if(!checkOldPassword) {
                throw new AppError('Old password this not match');
            }

            user.password = await this.hashProvider.generateHash(password);
        }
        console.log('fff');
        return this.usersRepository.save(user);
    }

}

export default UpdateProfileService;