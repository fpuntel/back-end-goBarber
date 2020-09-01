import { Router } from 'express';
import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes'
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes'
import passwordRoutes from '@modules/users/infra/http/routes/password.routes'

const routes = Router();

// use - utilizado para qualquer tipo de rota
// assim no arquivo appointments não precisamos
// utilizar /appoitments, apenas /
routes.use('/appointments', appointmentsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRoutes);

export default routes;