import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../../config/upload';

import CreateUserService from '../../modules/users/services/CreateUserService';
import UpdateUserAvatarService from '../../modules/users/services/UpdateUserAvatarService';

import ensureAhthenticated from '../../modules/users/infra/http/middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {

    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
        name,
        email,
        password
    });

    delete user.password;

    return response.json(user);

});

// ensureAhthenticated = somente usuários logados poderão acessar
// upload.single = utiliza single representando que somente um arquivo será upado
// e o nome do campo que irá receber
usersRouter.patch('/avatar', ensureAhthenticated, upload.single('avatar'), async (request, response) => {
    const updateUserAvatarService = new UpdateUserAvatarService();

    const user = await updateUserAvatarService.execute({
        user_id: request.user.id,
        avatarFilename: request.file.filename,
    });

    delete (user.password);

    return response.json(user);
});

export default usersRouter;