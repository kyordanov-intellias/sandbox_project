import { DataSource } from "typeorm";
import { configPostsFile } from "../../config/config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: configPostsFile.database.host,
  port: configPostsFile.database.port,
  username: configPostsFile.database.username,
  password: configPostsFile.database.password,
  database: configPostsFile.database.database,
  synchronize: true,
  logging: false,
  entities: [],
});
