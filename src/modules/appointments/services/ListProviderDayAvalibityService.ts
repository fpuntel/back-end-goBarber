import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';
import IAppointmentsRepositories from '../repositories/iAppointmentsRepositories';

interface Request{
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

type IResponse = Array<{
    hour: number;
    available: boolean;
}>;

@injectable()
class ListProvidersDayAvailabilyService{
    constructor(
        @inject('IAppointmentsRepositories')
        private appointmentsRepository: IAppointmentsRepositories
    ) {}

    public async execute({ provider_id, year, month, day }: Request): Promise<IResponse>{
 
        const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
            provider_id, 
            year, 
            month, 
            day
        });

        const hourStart = 8;
        
        const eachHourArray = Array.from(
            {length: 10},
            (_, index) => index + hourStart, 
        );

        const currentDate = new Date(Date.now());

        const availability = eachHourArray.map(hour => {
            const hashAppointmentInHour = appointments.find(appointment =>
                getHours(appointment.date) === hour,
            );
   
            const compareDate = new Date(year, month - 1, day, hour);

            return {
                hour, 
                available: !hashAppointmentInHour &&
                isAfter(compareDate, currentDate),
            }            
        });

     
        return availability;
    }

}

export default ListProvidersDayAvailabilyService;