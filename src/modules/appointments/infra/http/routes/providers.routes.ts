import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();


//Aplica o middleware em todas as rotas de appointments
providersRouter.use(ensureAuthenticated);

// Rota:
// - Receber a requisição
// - Chamar outro arquivo
// - Devolver uma resposta
/*
appointmentsRouter.get('/', async (request, response) => {
    //const appointmentRepository = getCustomRepository(AppointmentsRepository);
    const appointments = await appointmentRepository.find();

    return response.json(appointments);
});*/

providersRouter.get('/', providersController.index);
providersRouter.get(
    '/:provider_id/month-availability', 
    celebrate({
        [Segments.PARAMS]: {
            provider_id: Joi.string().uuid().required(),
        },
    }),
    providerMonthAvailabilityController.index)
;
providersRouter.get(
    '/:provider_id/day-availability', 
    celebrate({
        [Segments.PARAMS]: {
            provider_id: Joi.string().uuid().required(),
        },
    }),
    providerDayAvailabilityController.index
);

export default providersRouter;