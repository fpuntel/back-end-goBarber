import 'reflect-metadata';
import AppError from '@shared/errors/AppErrors';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;

// describe para ficar organizado, divide os testes
describe('CreateAppointments', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeNotificationsRepository = new FakeNotificationsRepository();

        createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
            fakeNotificationsRepository
        );
    });

    // Nao criar nada no banco, para isso eh criado um repositorio fake.
    it('should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() =>{
            return new Date(2020, 4, 10, 12).getTime();
        });
        
        const appointment = await createAppointment.execute({ 
            date: new Date(2020, 4, 10, 13), 
            user_id: '123456',
            provider_id: '123123123',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123123123');
    });

    it('should not be able to create two appointments on the same time', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() =>{
            return new Date(2020, 4, 10, 12).getTime();
        });
       
        const appointmentDate = new Date(2020, 4, 10, 15);
        // Tenta criar dois agendamentos no mesmo horário
        await createAppointment.execute({ 
            date: appointmentDate, 
            user_id: '123456',
            provider_id: '123123123',
        });

        expect(createAppointment.execute({ 
            date: appointmentDate, 
            user_id: '123456',
            provider_id: '123123123',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be to create an appointment on past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() =>{
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(createAppointment.execute({ 
            date: new Date(2020, 4, 10, 11), 
            user_id: '123456',
            provider_id: '123123123',
        })).rejects.toBeInstanceOf(AppError);

    });

    it('should not be to create an appointment with same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() =>{
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(createAppointment.execute({ 
            date: new Date(2020, 4, 10, 13), 
            user_id: '123456',
            provider_id: '123456',
        })).rejects.toBeInstanceOf(AppError);

    });

    it('should not be to create an appointment before 8am and after 5pm', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() =>{
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(createAppointment.execute({ 
            date: new Date(2020, 4, 11, 7), 
            user_id: '123456',
            provider_id: '654321',
        })).rejects.toBeInstanceOf(AppError);

        await expect(createAppointment.execute({ 
            date: new Date(2020, 4, 11, 18), 
            user_id: '123456',
            provider_id: '654321',
        })).rejects.toBeInstanceOf(AppError);
    });
});