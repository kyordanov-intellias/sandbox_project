import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, } from "typeorm";
import { Profile } from "./Profile";

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;
}
@Entity('profile_skills')
export class ProfileSkill {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'profile_id' })
  profile!: Profile;

  @ManyToOne(() => Skill)
  @JoinColumn({ name: 'skill_id' })
  skill!: Skill;

  @Column()
  proficiency_level?: string;
}
