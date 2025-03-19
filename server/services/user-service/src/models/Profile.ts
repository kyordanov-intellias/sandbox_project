import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("profiles")
export class Profile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, name: "user_id" })
  userId!: number;

  @Column({ nullable: true, name: "first_name" })
  firstName!: string;

  @Column({ nullable: true, name: "last_name" })
  lastName!: string;
}
