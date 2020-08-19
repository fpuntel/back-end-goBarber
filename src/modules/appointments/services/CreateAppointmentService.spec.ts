import AppError from '@shared/errors/AppErrors';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

// describe para ficar organizado, divide os testes
describe('CreateAppointments', () => {
    // Nao criar nada no banco, para isso eh criado um repositorio fake.
    it('should be able to create a new appointment', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);

        const appointment = await createAppointment.execute({ 
            date: new Date(), 
            provider_id: '123123123',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123123123');
    });

    it('should not be able to create two appointments on the same time', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);

        const appointmentDate = new Date(2020, 4, 10, 11);
        // Tenta criar dois agendamentos no mesmo horário
        await createAppointment.execute({ 
            date: appointmentDate, 
            provider_id: '123123123',
        });

        expect(createAppointment.execute({ 
            date: appointmentDate, 
            provider_id: '123123123',
        })).rejects.toBeInstanceOf(AppError);
    });
});