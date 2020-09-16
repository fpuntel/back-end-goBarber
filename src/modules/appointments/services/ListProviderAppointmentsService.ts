import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import IAppointmentsRepositories from '../repositories/iAppointmentsRepositories';
import Appointment from '../infra/typeorm/entities/Appointment';

interface Request{
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

@injectable()
class ListProvidersAppointmentsService{
    constructor(
        @inject('IAppointmentsRepositories')
        private appointmentsRepository: IAppointmentsRepositories
    ) {}

    public async execute({ provider_id, year, month, day }: Request): Promise<Appointment[]>{
       const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
           {
            provider_id,
            year, 
            month,
            day,
         },
       );

       return appointments;
    }

}

export default ListProvidersAppointmentsService;