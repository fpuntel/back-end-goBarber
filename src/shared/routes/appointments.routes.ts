import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import CreateAppointmentService from '../../modules/appointments/services/CreateAppointmentService';
import AppointmentsRepository from '../../modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import ensureAuthenticated from '../../modules/users/infra/http/middlewares/ensureAuthenticated';

const appointmentsRouter = Router();

const appointmentRepository = new AppointmentsRepository();

//Aplica o middleware em todas as rotas de appointments
appointmentsRouter.use(ensureAuthenticated);

// Rota:
// - Receber a requisição
// - Chamar outro arquivo
// - Devolver uma resposta

appointmentsRouter.get('/', async (request, response) => {
    const appointmentRepository = getCustomRepository(AppointmentsRepository);
    const appointments = await appointmentRepository.find();

    return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
    const { provider_id, date } = request.body;

    // Transforma a hora recebida em hora cheia
    const parsedDate = parseISO(date);

    const createAppointmentService = new CreateAppointmentService();

    const appointment = await createAppointmentService.execute({ date: parsedDate, provider_id });

    return response.json(appointment);
});

export default appointmentsRouter;