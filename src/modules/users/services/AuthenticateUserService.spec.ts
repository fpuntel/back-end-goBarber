import AppError from '@shared/errors/AppErrors';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

// describe para ficar organizado, divide os testes
describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        createUser = new CreateUserService(
            fakeUsersRepository, 
            fakeHashProvider
        );

        authenticateUser = new AuthenticateUserService(
            fakeUsersRepository, 
            fakeHashProvider
        );
    })

    // Nao criar nada no banco, para isso eh criado um repositorio fake.
    it('should be able to authenticate', async () => {
        const user = await createUser.execute({ 
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const response = await authenticateUser.execute({ 
            email: 'johndoe@example.com',
            password: '123456',
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should be able to authenticate with non existing user', async () => {
        await expect(authenticateUser.execute({ 
            email: 'johndoe@example.com',
            password: '123456',
        })).rejects.toBeInstanceOf(AppError);
    });
    
    it('should not be able to authenticate with wrong password', async () => {
        await createUser.execute({ 
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });


        await expect(authenticateUser.execute({ 
            email: 'johndoe@example.com',
            password: 'wrong-password',
        })).rejects.toBeInstanceOf(AppError);
    });

});

