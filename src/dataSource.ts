import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();
export const dataSource = new DataSource({
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: false,
  charset: 'utf8_general_ci', // 이모티콘 사용 가능하게 해줌
  entities: [__dirname + '/infrastructures/entities/*.entity.{ts,js}'],
  migrations: [__dirname + '/database/migrations/*.{ts,js}'],
  synchronize: false, // TODO: 테이블 한번 만든 후 false로 변경해야 함!
  dropSchema: false,
});
