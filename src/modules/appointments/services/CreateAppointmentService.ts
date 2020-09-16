import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import Appointment from '../infra/typeorm/entities/Appointment';
//import AppointmentRepository from '../infra/typeorm/repositories/AppointmentsRepository';
import AppError from '@shared/errors/AppErrors';

import iAppointmentsRepositories from '../repositories/iAppointmentsRepositories'
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';


interface RequestDTO { 
    provider_id: string;
    user_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    // Conceitos de dependency inversion
    constructor(
        @inject('AppointmentsRepositories')
        private appointmentsRepository: iAppointmentsRepositories,

        @inject('NotificationsRepository')
        private notificationsRepository: INotificationsRepository,
    ) {}
  
    public async execute({ date, provider_id , user_id}: RequestDTO): Promise<Appointment> {
//        date = new Date(2020, 4, 10, 5, 25)
        const appointmentDate = startOfHour(date);

        if (isBefore(appointmentDate, Date.now())){
            throw new AppError("You can't create an appointment on a past date.");
        }

        if (user_id === provider_id){
            throw new AppError("You can't create an appointment with yourself.");
        }

        if(getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17){
            throw new AppError("You can only create appointments between 8am and 5pm");
        }

        // Verifica se já existe agendamento para essa data
        // Precisa utilizar o await pois a findByDate é uma função 
        // async
        console.log(date);
        console.log('aaa');
        const findAppointmentSameDate = await this.appointmentsRepository.findByDate(appointmentDate);
        console.log('bbb');
        if (findAppointmentSameDate) {
            throw new AppError('This appointment is already booked');
        }
        console.log('ccc');
        // Cria um agendamento
        const appointment = await this.appointmentsRepository.create({
            provider_id, 
            user_id,
            date: appointmentDate,
        });
        console.log('ddd');

        const dateFormat = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");
        console.log('eeee');
        await this.notificationsRepository.create({
            recipient_id: provider_id,
            content: `Novo agendamento para o ${dateFormat}`,
        });
        console.log('fff');

        return appointment;
    }    
}

export default CreateAppointmentService;