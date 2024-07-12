import { Module } from '@nestjs/common';
import { UsersController } from './presentations/users.controller';
import { UsersService } from './application/users.service';
import { UsersRepositoryImpl } from './infrastructure/repositories/users.repository';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'UsersRepository',
      useClass: UsersRepositoryImpl,
    },
  ],
})
export class UsersModule {}
