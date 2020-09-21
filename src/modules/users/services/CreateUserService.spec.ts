import AppError from '@shared/errors/AppErrors';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository; 
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

// describe para ficar organizado, divide os testes
describe('CreateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();

        createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
    })

    // Nao criar nada no banco, para isso eh criado um repositorio fake.
    it('should be able to create a new user', async () => {
        const user = await createUser.execute({ 
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        expect(user).toHaveProperty('id');
    });

    it('should not be able to create a new user with same email from another', async () => {
        await createUser.execute({ 
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        await expect(
            createUser.execute({ 
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: '123456'
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

});