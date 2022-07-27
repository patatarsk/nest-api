import { Test, TestingModule } from '@nestjs/testing';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import mongoose from 'mongoose';
import { CreateNewsDto } from './dto/create-news.dto';
import { GetParamsDto } from './dto/get-params.dto';

export const fakeNews: CreateNewsDto & { _id: string } = {
  _id: new mongoose.Types.ObjectId().toString(),
  owners: [
    new mongoose.Types.ObjectId().toString(),
    new mongoose.Types.ObjectId().toString(),
  ],
  text: 'Test',
  title: 'Test',
};

export const fakeReq = {
  user: {
    _id: new mongoose.Types.ObjectId().toString(),
  },
};

export const fakeReqParamDto: GetParamsDto = {
  id: fakeNews._id,
};

describe('NewsController', () => {
  let controller: NewsController;
  let serviceMock: NewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [
        {
          provide: NewsService,
          useFactory: () => ({
            create: jest.fn().mockResolvedValue(fakeNews),
            findAll: jest.fn().mockResolvedValue([fakeNews]),
            findOne: jest.fn().mockResolvedValue(fakeNews),
          }),
        },
      ],
    }).compile();

    controller = module.get<NewsController>(NewsController);
    serviceMock = module.get<NewsService>(NewsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    beforeEach(async () => {
      await controller.create(fakeNews, fakeReq);
    });

    test('it should call method create from service with provided data', () => {
      expect(serviceMock.create).toBeCalledWith(fakeNews, fakeReq.user._id);
    });
  });

  describe('findAll', () => {
    beforeEach(async () => {
      await controller.findAll();
    });

    test('it should call method findAll from service once', () => {
      expect(serviceMock.findAll).toBeCalledTimes(1);
    });
  });

  describe('findOne', () => {
    beforeEach(async () => {
      await controller.findOne(fakeReqParamDto);
    });

    test('it should call method findOne from service with provided data once', () => {
      expect(serviceMock.findOne).toBeCalledWith(fakeReqParamDto.id);
    });
  });
});
