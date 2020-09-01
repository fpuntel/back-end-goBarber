import AppError from '@shared/errors/AppErrors';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPassword: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;


// describe para ficar organizado, divide os testes
describe('ResetPasswordService', () => {

    // Função para ser declarada antes de cada um dos testes
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();
        
        resetPassword = new ResetPasswordService(
            fakeUsersRepository, 
            fakeUserTokensRepository,
            fakeHashProvider
        );
    });

    // Nao criar nada no banco, para isso eh criado um repositorio fake.
    it('should be able to reset the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const { token } = await fakeUserTokensRepository.generate(
            user.id
        );

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPassword.execute({ 
            password: '123123',
            token
        });

        const updateUser = await fakeUsersRepository.finById(user.id)

        expect(generateHash).toHaveBeenCalledWith('123123');
        expect(updateUser?.password).toBe('123123');
    });

    it('should not be able to reset the password with non-existing token', async () => {
        await expect(
            resetPassword.execute({
                token: 'non-existing-token',
                password: '123456'
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password with non-existing user', async () => {
       
        const { token } = await fakeUserTokensRepository.generate('non-existing-user');
       
        await expect(
            resetPassword.execute({
                token,
                password: '123456'
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password if passed more then 2 hours', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const { token } = await fakeUserTokensRepository.generate(
            user.id
        );
        
        // Burla o date, ao ser chamado após essa linha, 
        // chama a minha funcao
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();
            
            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(resetPassword.execute({ 
            password: '123123',
            token
        })).rejects.toBeInstanceOf(AppError);
    });

});