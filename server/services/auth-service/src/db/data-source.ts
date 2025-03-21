import { DataSource } from "typeorm";
import { configAuthFile } from "../../config/config";
import { User } from "../models/User.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: configAuthFile.database.host,
  port: configAuthFile.database.port,
  username: configAuthFile.database.username,
  password: configAuthFile.database.password,
  database: configAuthFile.database.database,
  synchronize: true,
  logging: false,
  entities: [User],
});
