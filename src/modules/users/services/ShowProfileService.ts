import { injectable, inject } from 'tsyringe';
import User from '../infra/typeorm/entities/User';

import AppError from '@shared/errors/AppErrors';
import IUserRepository from '../repositories/IUserRepository';

interface Request{
    user_id: string;
}

@injectable()
class ShowProfileService{
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,
    ) {}

    public async execute({ user_id }: Request): Promise<User>{
       
        const user = await this.usersRepository.finById(user_id);

        if (!user) {
            throw new AppError('User not found');
        }

        return user;
    }

}

export default ShowProfileService;