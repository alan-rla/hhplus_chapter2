import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database/database.service';
import { QueuesModule } from './queues/queues.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [DatabaseModule],
      useClass: DatabaseService,
      inject: [DatabaseService],
    }),
    DatabaseModule,
    EventsModule,
    QueuesModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
