import { ParamsUserDto } from './dto/params-user.dto';
import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth('access-token')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  findOne(@Param() ParamsUserDto: ParamsUserDto) {
    const { id } = ParamsUserDto;

    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  update(
    @Param() ParamsUserDto: ParamsUserDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { id } = ParamsUserDto;

    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  remove(@Param() ParamsUserDto: ParamsUserDto) {
    const { id } = ParamsUserDto;

    return this.usersService.remove(id);
  }
}
