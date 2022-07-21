import { UsersModule } from './../users/users.module';
import { NewsSchema, News } from './schemas/news.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';

const newsModel = MongooseModule.forFeature([
  { name: News.name, schema: NewsSchema },
]);

@Module({
  imports: [newsModel, UsersModule],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
