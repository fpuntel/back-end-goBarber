import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();


//Aplica o middleware em todas as rotas de appointments
appointmentsRouter.use(ensureAuthenticated);

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

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;