import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Profile } from "./Profile";
import { ProficiencyLevel } from "../enums/ProficiencyLevel";

@Entity("skills")
export class Skill {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;
}

@Entity("profile_skills")
export class ProfileSkill {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Profile)
  @JoinColumn({ name: "profile_id" })
  profile!: Profile;

  @ManyToOne(() => Skill)
  @JoinColumn({ name: "skill_id" })
  skill!: Skill;

  @Column({
    name: "proficiency_level",
    type: "enum",
    enum: ProficiencyLevel,
    default: ProficiencyLevel.BEGINNER,
  })
  proficiencyLevel!: ProficiencyLevel;
}
