import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  auth_id!: string;

  @Column()
  email!: string;

  @Column()
  first_name!: string;

  @Column()
  last_name!: string;

  @Column()
  role!: string;
}