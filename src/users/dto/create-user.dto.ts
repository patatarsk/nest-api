import { MinLength, IsEmail } from 'class-validator';

export class CreateUserDto {
  @MinLength(3)
  name: string;

  @MinLength(8)
  password: string;

  @IsEmail()
  email: string;
}
