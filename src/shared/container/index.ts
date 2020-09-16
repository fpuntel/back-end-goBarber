import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import IAppoitmentsRepository from '@modules/appointments/repositories/iAppointmentsRepositories';
import AppointmentsRepositories from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRepository from '@modules/users/repositories/IUserRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UserRepository';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokenRepository';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';

container.registerSingleton<IAppoitmentsRepository>(
    'AppointmentsRepositories', 
    AppointmentsRepositories,
);

container.registerSingleton<IUsersRepository>(
    'UsersRepository', 
    UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
    'UserTokensRepository', 
    UserTokensRepository,
);

container.registerSingleton<INotificationsRepository>(
    'NotificationsRepository', 
    NotificationsRepository,
);