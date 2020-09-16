import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToOne ,
    JoinColumn
} from 'typeorm';

// Classe é uma parâmetro que está passando para entidade
// Precisa descomentar duas linhas no tsconfig.json:
//      "experimentalDecorators": true,
//      "emitDecoratorMetadata": true,    
// Assim toda vez que for salva será salvo dentro da tabela
// de appoitments

import User from '@modules/users/infra/typeorm/entities/User';

@Entity('appointments')
class Appointment{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    provider_id: string;

    // Realiza o relacionamento ManyToOne.
    // "Muitos agendamentos para um usuário"
    @ManyToOne(() => User)
    @JoinColumn({name: 'provider_id'})
    provider: User

    @Column()
    user_id: string;

    // Realiza o relacionamento ManyToOne.
    // "Muitos agendamentos para um usuário"
    @ManyToOne(() => User)
    @JoinColumn({name: 'user_id'})
    user: User

    @Column('timestamp with time zone')
    date: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Appointment;