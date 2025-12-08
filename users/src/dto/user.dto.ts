import { IsDate, IsString, IsUUID } from 'class-validator';

export class UserDto {
  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsUUID()
  uuid: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
