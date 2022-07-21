import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './../users/schemas/user.schema';
import { News, NewsDocument } from './schemas/news.schema';
import mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(User.name) private userModel: mongoose.Model<UserDocument>,
    @InjectModel(News.name) private newsModel: mongoose.Model<NewsDocument>,
  ) {}

  async create(
    createNewsDto: CreateNewsDto,
    ownerId: mongoose.Schema.Types.ObjectId,
  ) {
    const { owners, ...newsData } = createNewsDto;

    const ceatedNews = await new this.newsModel({
      ...newsData,
    });

    const ownersIds = [...owners, ownerId];

    ceatedNews.owners.push(...ownersIds);

    await this.userModel.updateMany(
      { _id: { $in: ownersIds } },
      { $push: { news: ceatedNews._id } },
    );

    return ceatedNews.save();
  }

  findAll() {
    return this.newsModel.find();
  }

  findOne(id: string) {
    return this.newsModel.findById(id);
  }
}
