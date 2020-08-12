import { getRepository, Repository } from 'typeorm';

import IUsersRepositories from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '../entities/User';

class UsersRepository implements IUsersRepositories {
    private ormRepository: Repository<User>;
    
    constructor(){
        this.ormRepository = getRepository(User);
    }

    public async finById(id: string): Promise<User | undefined>{
        const user = await this.ormRepository.findOne(id);

        return user;
    }

    public async findByEmail(email: string): Promise<User | undefined>{
        const user = await this.ormRepository.findOne({
            where: { email },
        });

        return user;    
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        const appointment = this.ormRepository.create(userData);
        await this.ormRepository.save(appointment); // salvo no banco

        return appointment;
    }

    public async save(user: User): Promise<User> {
        return this.ormRepository.save(user);
    }
}

export default UsersRepository;