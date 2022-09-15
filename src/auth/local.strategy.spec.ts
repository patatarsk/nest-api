import { UnauthorizedException } from '@nestjs/common';
import { User } from './../users/schemas/user.schema';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import mongoose from 'mongoose';

const fakeValidatedUser: Partial<User> = {
  _id: new mongoose.Schema.Types.ObjectId(
    new mongoose.Types.ObjectId().toString(),
  ),
  email: 'email',
  name: 'name',
  avatar: '',
  news: [],
};

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn().mockResolvedValueOnce(fakeValidatedUser),
          },
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    localStrategy = new LocalStrategy(authService);
  });

  it('should be defined', () => {
    expect(localStrategy).toBeDefined();
  });

  describe('validate', () => {
    test('should return the user', async () => {
      const { email: username, password } = fakeValidatedUser;
      const user = await localStrategy.validate(username, password);

      expect(user).toEqual(fakeValidatedUser);
    });

    test('should throw UnauthorizedException if user not valid', async () => {
      authService.validateUser = jest.fn().mockImplementationOnce(() => null);

      try {
        await localStrategy.validate('', '');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
