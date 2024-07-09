import { IsNotEmpty, IsUUID } from 'class-validator';

export class SelectUserByIdDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
