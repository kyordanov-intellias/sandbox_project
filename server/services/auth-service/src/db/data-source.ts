import { DataSource } from 'typeorm';
import { configFile } from '../../config/config';
import { User } from '../models/User.entity';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: configFile.database.host,
    port: configFile.database.port,
    username: configFile.database.username,
    password: configFile.database.password,
    database: configFile.database.database,
    synchronize: true,
    logging: true,
    entities: [User],
}); 