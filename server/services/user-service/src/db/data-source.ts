import { DataSource } from "typeorm";
import { Profile } from "../models/Profile";
import { Skill } from "../models/Skill";
import { ProfileSkill } from "../models/Skill";
import { Contact } from "../models/Contact";
import { configUserFile } from "../../config/config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: configUserFile.database.host,
  port: configUserFile.database.port,
  username: configUserFile.database.username,
  password: configUserFile.database.password,
  database: configUserFile.database.database,
  synchronize: true,
  logging: false,
  entities: [Profile, Skill, ProfileSkill, Contact],
  subscribers: [],
  migrations: [],
});
