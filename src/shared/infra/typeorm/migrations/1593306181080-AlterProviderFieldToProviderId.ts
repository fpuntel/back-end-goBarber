import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export default class AlterProviderFieldToProviderId1593306181080 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('appointments', 'provider');

        await queryRunner.addColumn(
            'appointments', 
            new TableColumn({
                name: 'provider_id',
                type: 'uuid',
                isNullable: true,
            }));
        
        await queryRunner.createForeignKey('appointments', new TableForeignKey({
            name: 'AppointmentProvider',
            columnNames: ['provider_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            // Caso o usuario for deletado, set null em todos os agendamentos
            onDelete: 'SET NULL',
            // Caso o usuário tenha o id alterado, todos os ids do agendmaneto desse usuario são alterados
            onUpdate: 'CASCADE', 
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('Appointment', 'AppointmentProvider');

        await queryRunner.dropColumn('appointments', 'provider_id');

        await queryRunner.addColumn('appointments', new TableColumn({
            name: 'provider',
            type: 'varchar',
        }));
    }

}
