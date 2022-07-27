import { ParamsUserDto } from './dto/params-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Readable } from 'stream';
import mongoose from 'mongoose';

const fakeUser: CreateUserDto = {
  name: 'fake',
  email: 'fake',
  password: 'fake',
};

const fakeFile: Express.Multer.File = {
  fieldname: 'fake',
  originalname: 'fake',
  encoding: 'fake',
  mimetype: 'fake',
  destination: 'fake',
  filename: 'fake',
  path: 'fake',
  size: 0,
  buffer: Buffer.from('fake'),
  stream: new Readable(),
};

const fakeUpdate: UpdateUserDto = {
  name: 'fake2',
  email: 'fake2',
  password: 'fake2',
};

const fakeParams: ParamsUserDto = {
  id: new mongoose.Types.ObjectId().toString(),
};

const fakeReq = {
  user: {
    username: 'fake',
  },
};

describe('UsersController', () => {
  let controller: UsersController;
  let serviceMock: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useFactory: () => ({
            findAll: jest.fn().mockResolvedValue({}),
            findOne: jest.fn().mockResolvedValue({}),
            update: jest.fn().mockResolvedValue({}),
            remove: jest.fn().mockResolvedValue([]),
            saveAvatar: jest.fn().mockResolvedValue({}),
            autorshipStatistic: jest.fn().mockResolvedValue({}),
          }),
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    serviceMock = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    beforeEach(async () => {
      await controller.findAll();
    });
    test('it should call method findAll from service once', () => {
      expect(serviceMock.findAll).toBeCalledTimes(1);
    });
  });

  describe('autorshipStatistic', () => {
    beforeEach(async () => {
      await controller.autorshipStatistic();
    });
    test('it should call method autorshipStatistic from service once', () => {
      expect(serviceMock.autorshipStatistic).toBeCalledTimes(1);
    });
  });

  describe('findOne', () => {
    beforeEach(async () => {
      await controller.findOne(fakeParams);
    });
    test('it should call method findOne from service with provided data', () => {
      expect(serviceMock.findOne).toBeCalledWith(fakeParams.id);
    });
  });

  describe('update', () => {
    beforeEach(async () => {
      await controller.update(fakeParams, fakeUpdate);
    });
    test('it should call method update from service with provided data', () => {
      expect(serviceMock.update).toBeCalledWith(fakeParams.id, fakeUpdate);
    });
  });

  describe('remove', () => {
    beforeEach(async () => {
      await controller.remove(fakeParams);
    });
    test('it should call method remove from service with provided data', () => {
      expect(serviceMock.remove).toBeCalledWith(fakeParams.id);
    });
  });

  describe('uploadAvatar', () => {
    beforeEach(async () => {
      await controller.uploadAvatar(fakeFile, fakeReq);
    });
    test('it should call method saveAvatar from service with provided data', () => {
      expect(serviceMock.saveAvatar).toBeCalledWith(
        fakeReq.user.username,
        fakeFile.filename,
      );
    });
  });
});
