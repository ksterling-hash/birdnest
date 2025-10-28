import { DataSourceOptions } from "typeorm";

export const seederConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'birds',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
};