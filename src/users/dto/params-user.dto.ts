import { ApiProperty } from '@nestjs/swagger';

export class ParamsUserDto {
  @ApiProperty({
    description: 'Id',
  })
  id: string;
}
