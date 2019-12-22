import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import config = require("config");
import { TypeormConfigFields } from './typeorm-config.interface';

const dbConfig = config.get<TypeormConfigFields>('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: dbConfig.type,
    host: process.env.RDS_HOSTNAME || dbConfig.host,
    port: Number(process.env.RDS_PORT) || dbConfig.port,
    username: process.env.RDS_USERNAME || dbConfig.username,
    password: process.env.RDS_PASSWORD || dbConfig.password,
    database: process.env.RDS_DB_NAME || dbConfig.database, 
    synchronize: !!process.env.TYPEORM_SYNC || dbConfig.synchronize,
    entities: [__dirname + '/../**/*.entity.js']
};