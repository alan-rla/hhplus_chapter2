import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateQueueDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
