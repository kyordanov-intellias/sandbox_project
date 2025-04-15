import { DataSource } from "typeorm";
import { configChatFile } from "../../config/config";
import { Message } from "../models/Message.entity";
import { ChatRoom } from "../models/ChatRoom.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: configChatFile.database.host,
  port: configChatFile.database.port,
  username: configChatFile.database.username,
  password: configChatFile.database.password,
  database: configChatFile.database.database,
  synchronize: true,
  logging: false,
  entities: [Message, ChatRoom],
});
