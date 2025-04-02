import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProfileSkill } from './Skill';
import { Contact } from './Contact';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, name: 'auth_id' })
  authId!: string;

  @Column({ name: 'profile_image', nullable: true })
  profileImage!: string;

  @Column({ name: 'cover_image', nullable: true })
  coverImage!: string;

  @Column()
  email!: string;

  @Column({ name: 'first_name' })
  firstName!: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  @Column({ name: 'user_role' })
  userRole!: string;

  @OneToMany(() => ProfileSkill, profileSkill => profileSkill.profile)
  skills!: ProfileSkill[];

  @OneToMany(() => Contact, contact => contact.profile)
  contacts!: Contact[];
}
