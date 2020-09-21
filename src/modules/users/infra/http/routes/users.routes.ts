import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import multer from 'multer';
import uploadConfig from '@config/upload';

import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

import ensureAhthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();
const upload = multer(uploadConfig.multer);


usersRouter.post(
    '/', 
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }
    }),
    usersController.create
);

// ensureAhthenticated = somente usuários logados poderão acessar
// upload.single = utiliza single representando que somente um arquivo será upado
// e o nome do campo que irá receber
usersRouter.patch('/avatar', ensureAhthenticated, upload.single('avatar'), userAvatarController.update);

export default usersRouter;