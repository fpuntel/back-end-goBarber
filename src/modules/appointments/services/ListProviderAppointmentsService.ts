import 'reflect-metadata';
import { injectable, inject } from 'tsyringe'

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'
import { classToClass } from 'class-transformer'
import Appointment from '../infra/typeorm/entities/Appointment'
import IAppointmentsRepository from '../repositories/iAppointmentsRepositories'

interface IRequest {
  provider_id: string
  day: number
  month: number
  year: number
}

@injectable()
class ListProvidersAppointmentsService {
  constructor(
    @inject('AppointmentsRepositories')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) { }

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequest): Promise<Appointment[]> {
    const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

    let appointments = await this.cacheProvider.recover<Appointment[]>(
      cacheKey
    );

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllInDayFromProvider(
        {
          provider_id,
          year,
          month,
          day,
        },
      );

      console.log('Buscou do banco');

      await this.cacheProvider.save(
        cacheKey, 
        appointments
      );
    }

    return appointments;
  }

}

export default ListProvidersAppointmentsService;