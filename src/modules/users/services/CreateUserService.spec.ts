import AppError from '@shared/errors/AppErrors';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

// describe para ficar organizado, divide os testes
describe('CreateUser', () => {
    // Nao criar nada no banco, para isso eh criado um repositorio fake.
    it('should be able to create a new user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

        const user = await createUser.execute({ 
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        expect(user).toHaveProperty('id');
    });

    it('should not be able to create a new user with same email from another', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

        await createUser.execute({ 
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        expect(
            createUser.execute({ 
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: '123456'
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

});