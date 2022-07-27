import { NotFoundException } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import mongoose from 'mongoose';

const fakeUser: User = {
  _id: new mongoose.Schema.Types.ObjectId(
    new mongoose.Types.ObjectId().toString(),
  ),
  name: 'test',
  email: 'fake',
  password: 'fake',
  avatar: 'fake',
  news: [],
};

const fakeEmail = 'fake';

const fakeId = 'fake';

describe('UsersService', () => {
  let service: UsersService;
  let usersModelMock: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            find: jest.fn().mockImplementationOnce(() => ({
              exec: jest.fn().mockImplementationOnce(() => [fakeUser]),
            })),
            findOne: jest.fn().mockImplementationOnce(() => ({
              exec: jest.fn().mockImplementationOnce(() => fakeUser),
            })),
            findById: jest.fn().mockImplementationOnce(() => ({
              exec: jest.fn().mockImplementationOnce(() => fakeUser),
            })),
            updateOne: jest.fn().mockImplementationOnce(() => ({
              exec: jest.fn(),
            })),
            deleteOne: jest.fn().mockImplementationOnce(() => ({
              exec: jest.fn(),
            })),
            aggregate: jest.fn().mockImplementationOnce(() => ({
              exec: jest.fn(),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersModelMock = module.get(getModelToken(User.name));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    test('it should call find method', async () => {
      await service.findAll();

      expect(usersModelMock.find).toHaveBeenCalledTimes(1);
    });

    test('it should return users array', async () => {
      const result = await service.findAll();

      expect(result).toEqual([fakeUser]);
    });
  });

  describe('findByEmail', () => {
    test('it should call findOne method', async () => {
      await service.findByEmail(fakeEmail);

      expect(usersModelMock.findOne).toHaveBeenCalledTimes(1);
    });

    test('it should return found user', async () => {
      const result = await service.findByEmail(fakeEmail);

      expect(result).toEqual(fakeUser);
    });

    test('it should throw NotFoundException if user not found', async () => {
      usersModelMock.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockImplementationOnce(() => null),
      }));

      try {
        await service.findByEmail(fakeEmail);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('findOne', () => {
    test('it should call findById method', async () => {
      await service.findOne(fakeId);

      expect(usersModelMock.findById).toHaveBeenCalledTimes(1);
    });

    test('it should return found user', async () => {
      const result = await service.findOne(fakeId);

      expect(result).toEqual(fakeUser);
    });

    test('it should throw NotFoundException if user not found', async () => {
      usersModelMock.findById = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockImplementationOnce(() => null),
      }));

      try {
        await service.findOne(fakeId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('update', () => {
    test('it should call updateOne method', async () => {
      await service.update(fakeId, fakeUser);

      expect(usersModelMock.updateOne).toHaveBeenCalledTimes(1);
    });

    test('it should return nothing', async () => {
      const result = await service.update(fakeId, fakeUser);

      expect(result).toEqual(undefined);
    });
  });

  describe('remove', () => {
    test('it should call deleteOne method', async () => {
      await service.remove(fakeId);

      expect(usersModelMock.deleteOne).toHaveBeenCalledTimes(1);
    });

    test('it should return nothing', async () => {
      const result = await service.remove(fakeId);

      expect(result).toEqual(undefined);
    });
  });

  describe('saveAvatar', () => {
    test('it should call updateOne method', async () => {
      await service.saveAvatar(fakeUser.name, fakeUser.avatar);

      expect(usersModelMock.updateOne).toHaveBeenCalledTimes(1);
    });

    test('it should return nothing', async () => {
      const result = await service.saveAvatar(fakeUser.name, fakeUser.avatar);

      expect(result).toEqual(undefined);
    });
  });

  describe('autorshipStatistic', () => {
    test('it should call aggregate method', async () => {
      await service.autorshipStatistic();

      expect(usersModelMock.aggregate).toHaveBeenCalledTimes(1);
    });
  });
});
