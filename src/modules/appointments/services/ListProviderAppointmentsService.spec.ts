import ListProviderAppointmentsService from './ListProviderAppointmentsService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProvidersAppointments: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

// describe para ficar organizado, divide os testes
describe('ListProvidersAppointments', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeCacheProvider = new FakeCacheProvider();
        
        listProvidersAppointments = new ListProviderAppointmentsService(
            fakeAppointmentsRepository,
            fakeCacheProvider
        );
    })

    // Nao criar nada no banco, para isso eh criado um repositorio fake.
    it('should be able to list the appointments on a specific day', async () => {
        const appointment1 = await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id:'user',
            date: new Date(2020, 4, 20, 14, 0, 0), // Janeiro inicia em 0
        });

        const appointment2 = await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id:'user2',
            date: new Date(2020, 4, 20, 15, 0, 0), // Janeiro inicia em 0
        });

        const appointments = await listProvidersAppointments.execute({
            provider_id: 'provider',
            year: 2020,
            month: 5, // usado 5 pois no banco sera gravado certo
            day: 20,
        });

        expect(appointments).toEqual(expect.arrayContaining([
            appointment1,
            appointment2
        ]))
    });
    
});