import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProfileSkill } from './Skill';
import { Contact } from './Contact';

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

  @OneToMany(() => ProfileSkill, profileSkill => profileSkill.profile)
  skills!: ProfileSkill[];

  @OneToMany(() => Contact, contact => contact.profile)
  contacts!: Contact[];
}