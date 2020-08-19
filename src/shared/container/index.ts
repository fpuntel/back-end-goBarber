import { container } from 'tsyringe';

import '@modules/users/provider';

import IAppoitmentsRepository from '@modules/appointments/repositories/iAppointmentsRepositories';
import AppointmentsRepositories from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRepository from '@modules/users/repositories/IUserRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UserRepository';

container.registerSingleton<IAppoitmentsRepository>(
    'AppointmentsRepositories', 
    AppointmentsRepositories,
);

container.registerSingleton<IUsersRepository>(
    'UsersRepository', 
    UsersRepository,
);