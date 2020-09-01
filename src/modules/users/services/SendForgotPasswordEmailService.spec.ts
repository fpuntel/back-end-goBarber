import AppError from '@shared/errors/AppErrors';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;


// describe para ficar organizado, divide os testes
describe('SendForgotPasswordEmail', () => {

    // Função para ser declarada antes de cada um dos testes
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        
        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUsersRepository, 
            fakeMailProvider,
            fakeUserTokensRepository,
        );
    });

    // Nao criar nada no banco, para isso eh criado um repositorio fake.
    it('should be able to recover the password using the email', async () => {
        
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await sendForgotPasswordEmail.execute({ 
            email: 'johndoe@example.com',
        });

        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able to recover a non-existing a user password', async () => {
        await expect(
            sendForgotPasswordEmail.execute({ 
                email: 'johndoe@example.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should generate a forgot password token', async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await sendForgotPasswordEmail.execute({ 
            email: 'johndoe@example.com',
        });

        expect(generateToken).toHaveBeenCalledWith(user.id);
    })

});