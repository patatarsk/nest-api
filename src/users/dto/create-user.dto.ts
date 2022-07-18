import { MinLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Name',
    example: 'Test',
  })
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Password',
    example: '123123123',
  })
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Email',
    example: 'Test@gmail.com',
  })
  @IsEmail()
  email: string;
}
