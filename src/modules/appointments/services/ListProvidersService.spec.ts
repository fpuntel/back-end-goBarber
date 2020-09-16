import AppError from '@shared/errors/AppErrors';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

// describe para ficar organizado, divide os testes
describe('ListProviders', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();

        listProviders = new ListProvidersService(
            fakeUsersRepository,
        );
    })

    // Nao criar nada no banco, para isso eh criado um repositorio fake.
    it('should be able to list the providers', async () => {
        const user1 = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const user2 = await fakeUsersRepository.create({
            name: 'John Tre',
            email: 'johndoe@example.com',
            password: '123456',
        });


        const loggedUser = await fakeUsersRepository.create({
            name: 'John Qua',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const providers = await listProviders.execute({
            user_id: loggedUser.id,
        });

        expect(providers).toEqual([user1, user2]);
    });   
});