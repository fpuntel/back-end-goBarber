import { startOfHour } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import Appointment from '../infra/typeorm/entities/Appointment';
//import AppointmentRepository from '../infra/typeorm/repositories/AppointmentsRepository';
import AppError from '@shared/errors/AppErrors';

import iAppointmentsRepositories from '../repositories/iAppointmentsRepositories'

interface RequestDTO { 
    provider_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    // Conceitos de dependency inversion
    constructor(
        @inject('AppointmentsRepositories')
        private appointmentsRepository: iAppointmentsRepositories,
    ) {

    }
  
    public async execute({ date, provider_id }: RequestDTO): Promise<Appointment> {
        const appointmentDate = startOfHour(date);

        // Verifica se já existe agendamento para essa data
        // Precisa utilizar o await pois a findByDate é uma função 
        // async
        const findAppointmentSameDate = await this.appointmentsRepository.findByDate(appointmentDate);
    
        if (findAppointmentSameDate) {
            throw new AppError('This appointment is already booked');
        }
        // Cria um agendamento
        const appointment = await this.appointmentsRepository.create({
            provider_id, 
            date: appointmentDate,
        });

        return appointment;
    }    
}

export default CreateAppointmentService;