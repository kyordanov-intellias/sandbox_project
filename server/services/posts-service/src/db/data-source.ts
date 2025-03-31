import { DataSource } from "typeorm";
import { configPostsFile } from "../../config/config";
import { Post } from "../models/Post.entity";
import { Comment } from "../models/Comment.entity";
import { Like } from "../models/Like.entity";
export const AppDataSource = new DataSource({
  type: "postgres",
  host: configPostsFile.database.host,
  port: configPostsFile.database.port,
  username: configPostsFile.database.username,
  password: configPostsFile.database.password,
  database: configPostsFile.database.database,
  synchronize: true,
  logging: false,
  entities: [Post, Comment, Like],
});
