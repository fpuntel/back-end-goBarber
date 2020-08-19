// Utilizado para testes
import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';

import IAppointmentsRepositories from '../../repositories/iAppointmentsRepositories';
import ICreateAppointmentDTO from '../../dtos/iCreateAppointmentDTO';

import Appointment from '../../infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepositories {
    private appointments: Appointment[] = []; 


    // Retorno Promise, pois é uma função asincrona
    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find(
            appointment => isEqual(appointment.date, date)
        );

        return findAppointment;
    }

    public async create({ provider_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        // Object.assign(appointment, {id: uuid(), date, provider_id}) 

        appointment.id = uuid();
        appointment.date = date;
        appointment.provider_id = provider_id;

        this.appointments.push(appointment);

        return appointment;
    }
}

export default AppointmentsRepository;