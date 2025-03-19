import { DataSource } from "typeorm";
import { Profile } from "../models/Profile";
import { configFile } from "../../config/config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: configFile.database.host,
  port: configFile.database.port,
  username: configFile.database.username,
  password: configFile.database.password,
  database: configFile.database.database,
  synchronize: true,
  logging: false,
  entities: [Profile],
});
