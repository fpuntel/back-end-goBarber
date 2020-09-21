import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmentsRepositories from '@modules/appointments/repositories/iAppointmentsRepositories';
import ICreateAppointmentDTO from '@modules/appointments/dtos/iCreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepositories {
    private ormRepository: Repository<Appointment>;
    
    constructor(){
        this.ormRepository = getRepository(Appointment);
    }

    // Retorno Promise, pois é uma função asincrona
    public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
        // Verificação para não bater horários
        // this. funções do Repositoru
        const findAppointment = await this.ormRepository.findOne({
            // Primeiro date: do banco| Segundo a variável que a função recebe
            where: { date: date, provider_id}, 
        });

        return findAppointment || undefined;
    }

    public async findAllInMonthFromProvider({provider_id, month, year} : IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
        // Caso nao tenha dois digitos, preencha com 0 na frente
        const parsedMonth = String(month).padStart(2, '0');
        const appointments = await this.ormRepository.find({
            where: {
               provider_id, 
               date: Raw(dateFieldName =>
                `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`
                ),
           },

       })

        return appointments;
    }
    
    public async findAllInDayFromProvider({provider_id, day, month, year} : IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
        // Caso nao tenha dois digitos, preencha com 0 na frente
        const parsedMonth = String(month).padStart(2, '0');
        const parsedDay = String(day).padStart(2, '0');
        
        const appointments = await this.ormRepository.find({
            where: {
               provider_id, 
               date: Raw(dateFieldName =>
                `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`
                ),
           },
           relations: ['user'], // Tras inf. do usuario também
       });

        return appointments;
    }

    public async create({ provider_id, user_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({provider_id, user_id, date});
        await this.ormRepository.save(appointment); // salvo no banco

        return appointment;
    }
}

export default AppointmentsRepository;