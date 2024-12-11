import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  first_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  middle_name?: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  last_name: string;

  @Column({ type: 'varchar', unique: true, length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password_hash: string;

  @Column({ type: 'date', nullable: true })
  dob?: Date;

  @Column({ type: 'boolean', default: false, nullable: false })
  show_dob: boolean;

  @Column({ type: 'date', nullable: true })
  arrival_in_canada?: Date;

  @Column({ type: 'int', nullable: true })
  goal_id?: number;

  @Column({
    type: 'enum',
    enum: ['USER', 'ADMIN', 'MENTOR'],
    default: 'USER',
    nullable: false,
  })
  role: 'USER' | 'ADMIN' | 'MENTOR';
}
