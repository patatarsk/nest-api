import { ParamsUserDto } from './dto/params-user.dto';
import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
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

  @Post('/upload/avatar')
  @UseInterceptors(FileInterceptor('file', { dest: './avatars' }))
  @ApiBearerAuth('access-token')
  uploadAvatar(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const { username } = req.user;

    return this.usersService.saveAvatar(username, file.filename);
  }
}
