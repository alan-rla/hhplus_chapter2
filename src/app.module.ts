import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database/database.service';
import { ScheduleModule } from '@nestjs/schedule';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from './database/database.config';
import { controllers } from '@src/presentations';
import { repositories } from '@src/infrastructures';
import { services } from '@src/domains';
import { facades } from '@src/applications';
import { guards } from '@src/libs/guards';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [DatabaseModule],
      useClass: DatabaseService,
      inject: [DatabaseService],
      async dataSourceFactory(options) {
        if (!options) throw new Error('Invalid options passed');
        return addTransactionalDataSource(new DataSource(dataSourceOptions));
      },
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'single',
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      }),
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [...controllers],
  providers: [...facades, ...services, ...repositories, ...guards],
})
export class AppModule {}
