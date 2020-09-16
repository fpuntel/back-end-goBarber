import ListProvidersDayAvailabilityService from './ListProviderDayAvalibityService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProvidersDayAvailability: ListProvidersDayAvailabilityService;

// describe para ficar organizado, divide os testes
describe('ListProviderMonthAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProvidersDayAvailability = new ListProvidersDayAvailabilityService(
            fakeAppointmentsRepository
        );
    })

    // Nao criar nada no banco, para isso eh criado um repositorio fake.
    it('should be able to list the day availabily from provider', async () => {

    
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id:'123456',
            date: new Date(2020, 4, 20, 14, 0, 0), // Janeiro inicia em 0
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id:'123456',
            date: new Date(2020, 4, 20, 15, 0, 0), // Janeiro inicia em 0
        });

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 20, 11).getTime();
        });

        const availabily = await listProvidersDayAvailability.execute({
            provider_id: 'user',
            year: 2020,
            month: 5, // usado 5 pois no banco sera gravado certo
            day: 20,
        });

        expect(availabily).toEqual(expect.arrayContaining([
            {hour: 8, available: false},
            {hour: 9, available: false },
            {hour: 10, available: false},
            {hour: 13, available: true},
            {hour: 14, available: false},
            {hour: 15, available: false},
            {hour: 16, available: true},
        ]))
    });
    
});