import { GetParamsDto } from './dto/get-params.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('news')
@UseGuards(JwtAuthGuard)
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @ApiBearerAuth('access-token')
  create(@Body() createNewsDto: CreateNewsDto, @Request() req) {
    const { _id } = req.user;

    return this.newsService.create(createNewsDto, _id);
  }

  @Get()
  @ApiBearerAuth('access-token')
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  findOne(@Param() getParamsDto: GetParamsDto) {
    const { id } = getParamsDto;

    return this.newsService.findOne(id);
  }
}
