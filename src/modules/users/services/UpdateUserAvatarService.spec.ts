import AppError from '@shared/errors/AppErrors';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;;
let updateUserAvatar: UpdateUserAvatarService;

// describe para ficar organizado, divide os testes
describe('UpdateUserAvatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeStorageProvider = new FakeStorageProvider();

        updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider
        );
    })

    // Nao criar nada no banco, para isso eh criado um repositorio fake.
    it('should be able to update a user avatar', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg',
        });

        expect(user.avatar).toBe('avatar.jpg');
    });

    // Nao criar nada no banco, para isso eh criado um repositorio fake.
    it('should not be able to update avatar form non existing user', async () => {
        await expect(updateUserAvatar.execute({
            user_id: 'non-existing-user',
            avatarFilename: 'avatar.jpg',
        })).rejects.toBeInstanceOf(AppError);
    });

        // Nao criar nada no banco, para isso eh criado um repositorio fake.
        it('should delete old avatar when updating new one', async () => {
            const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    
            const user = await fakeUsersRepository.create({
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: '123456',
            });
    
            await updateUserAvatar.execute({
                user_id: user.id,
                avatarFilename: 'avatar.jpg',
            });

            await updateUserAvatar.execute({
                user_id: user.id,
                avatarFilename: 'avatar2.jpg',
            });

            expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
            expect(user.avatar).toBe('avatar2.jpg');
        });
    

});