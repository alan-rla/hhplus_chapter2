import { Module } from '@nestjs/common';
import { UsersController } from './presentations/users.controller';
import { UsersService } from './application/users.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    // {
    //   provide: UsersRepository,
    //   useClass: UsersRepositoryImpl,
    // },
  ],
})
export class UsersModule {}
