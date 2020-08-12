import { getRepository, Repository } from 'typeorm';

import IAppointmentsRepositories from '@modules/appointments/repositories/iAppointmentsRepositories';
import ICreateAppointmentDTO from '@modules/appointments/dtos/iAppointmentsRepositories';

import Appointment from '../entities/Appointment';
import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepositories {
    private ormRepository: Repository<Appointment>;
    
    constructor(){
        this.ormRepository = getRepository(Appointment);
    }

    // Retorno Promise, pois é uma função asincrona
    public async findByDate(date: Date): Promise<Appointment | undefined> {
        // Verificação para não bater horários
        // this. funções do Repositoru
        const findAppointment = await this.ormRepository.findOne({
            // Primeiro date: do banco| Segundo a variável que a função recebe
            where: { date: date}, 
        });

        return findAppointment || undefined;
    }

    public async create({ provider_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({provider_id, date});
        await this.ormRepository.save(appointment); // salvo no banco

        return appointment;
    }
}

export default AppointmentsRepository;