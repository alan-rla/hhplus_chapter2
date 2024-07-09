import { Module } from '@nestjs/common';
import { UsersController } from './presentations/users.controller';

@Module({
  controllers: [UsersController],
})
export class UsersModule {}
