import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./Profile";

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'profile_id' })
  profile!: Profile;

  @Column()
  type!: string;

  @Column()
  value!: string;

  @Column({ default: false })
  is_primary!: boolean;
}