import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';


import ProfileController from '../controllers/ProfileController';

import ensureAhthenticated from '../middlewares/ensureAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();

// Rotas do perfil não sao permitidas se o usuario
// nao estiver logado
profileRouter.use(ensureAhthenticated);

profileRouter.get(
    '/', 
    profileController.show
);
profileRouter.put(
    '/', 
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            old_password: Joi.string().required(),
            password: Joi.string(),
            password_confirmation: Joi.string().valid(Joi.ref('password'))
        }
    }),
    profileController.update
);


export default profileRouter;