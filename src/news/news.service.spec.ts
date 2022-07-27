import { CreateNewsDto } from './dto/create-news.dto';
import { News, NewsDocument } from './schemas/news.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { NewsService } from './news.service';
import { Model } from 'mongoose';
import { User, UserDocument } from './../users/schemas/user.schema';
import mongoose from 'mongoose';

const userId = new mongoose.Types.ObjectId().toString();
const ownerId = new mongoose.Types.ObjectId().toString();
const ownerId2 = new mongoose.Types.ObjectId().toString();
const newsId = new mongoose.Types.ObjectId().toString();

const fakeNewsDto: CreateNewsDto = {
  title: 'Test news',
  text: 'Test news text',
  owners: [ownerId, ownerId2],
};

const fakeOwnerId = new mongoose.Schema.Types.ObjectId(userId);

const fakeId = new mongoose.Types.ObjectId(userId).toString();

const fakeCreatedNews: News = {
  _id: new mongoose.Schema.Types.ObjectId(newsId),
  title: fakeNewsDto.title,
  text: fakeNewsDto.text,
  owners: [
    new mongoose.Schema.Types.ObjectId(ownerId),
    new mongoose.Schema.Types.ObjectId(ownerId2),
    fakeOwnerId,
  ],
};

const fakePopulatedNews = {
  _id: new mongoose.Schema.Types.ObjectId(newsId),
  title: fakeNewsDto.title,
  text: fakeNewsDto.text,
  owners: [
    {
      name: 'Fake1',
      email: 'Fake1',
    },
    {
      name: 'Fake2',
      email: 'Fake2',
    },
    {
      name: 'Fake3',
      email: 'Fake3',
    },
  ],
};

const fakePopulatedNewsArray = [fakePopulatedNews];

class fakeNewsModel {
  title: string;
  text: string;
  owners: string[];

  constructor() {
    this.title = 'Test news';
    this.text = 'Test news text';
    this.owners = [];
  }

  save = jest.fn().mockReturnValue(fakeCreatedNews);
  static aggregate = jest.fn().mockReturnThis();
  static find = jest.fn().mockReturnThis();
  static populate = jest.fn().mockReturnThis();
  static exec = jest.fn();
}

describe('NewsService', () => {
  let service: NewsService;
  let newsModelMock: Model<NewsDocument>;
  let usersModelMock: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsService,
        {
          provide: getModelToken(News.name),
          useValue: fakeNewsModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: {
            updateMany: jest.fn().mockImplementationOnce(() => ({
              exec: jest.fn(),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<NewsService>(NewsService);
    newsModelMock = module.get(getModelToken(News.name));
    usersModelMock = module.get(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    test('it should update userModel with updateMany', async () => {
      await service.create(fakeNewsDto, fakeOwnerId);

      expect(usersModelMock.updateMany).toHaveBeenCalledTimes(1);
    });

    test('it should create news', async () => {
      const createdNews = await service.create(fakeNewsDto, fakeOwnerId);

      expect(createdNews).toEqual(fakeCreatedNews);
    });
  });

  describe('findAll', () => {
    beforeAll(() => {
      fakeNewsModel.exec = jest.fn().mockReturnValue(fakePopulatedNewsArray);
    });
    test('it should call find method', async () => {
      await service.findAll();

      expect(newsModelMock.find).toBeCalledTimes(1);
    });

    test('it should find all news', async () => {
      const res = await service.findAll();

      expect(res).toEqual(fakePopulatedNewsArray);
    });
  });

  describe('findOne', () => {
    beforeAll(() => {
      fakeNewsModel.exec = jest.fn().mockReturnValue(fakePopulatedNews);
    });
    test('it should call agregate method', async () => {
      await service.findOne(fakeId);

      expect(newsModelMock.aggregate).toBeCalledTimes(1);
    });

    test('it should find one news', async () => {
      const news = await service.findOne(fakeId);

      expect(news).toEqual(fakePopulatedNews);
    });
  });
});
