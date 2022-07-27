import { ConflictException } from '@nestjs/common';
import { UsersService } from './../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { User } from './../users/schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import mongoose, { Model } from 'mongoose';
import { hash } from 'bcrypt';
import { bcryptConstants } from './constants';

const fakeSignUpUserDto: SignUpUserDto = {
  name: 'Fake1',
  email: 'Fake1',
  password: 'Fake1',
};

const hashPassword = async (password) =>
  await hash(password, bcryptConstants.saltRounds);

const fakeCreatedUser: User = {
  _id: new mongoose.Schema.Types.ObjectId(
    new mongoose.Types.ObjectId().toString(),
  ),
  email: fakeSignUpUserDto.email,
  password: fakeSignUpUserDto.password,
  name: fakeSignUpUserDto.name,
  avatar: '',
  news: [],
};

const fakeValidated: Partial<User> = {
  _id: fakeCreatedUser._id,
  email: fakeCreatedUser.email,
  name: fakeCreatedUser.name,
  avatar: '',
  news: [],
};

const fakeToken = {
  access_token: undefined,
};

class fakeUserModel {
  _id: mongoose.Schema.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  avatar: string;
  news: mongoose.Schema.Types.ObjectId[];

  constructor() {
    this._id = fakeCreatedUser._id;
    this.email = fakeCreatedUser.email;
    this.password = fakeCreatedUser.password;
    this.name = fakeCreatedUser.name;
    this.avatar = fakeCreatedUser.avatar;
    this.news = fakeCreatedUser.news;
  }

  save = jest.fn().mockReturnValue(fakeCreatedUser);
  static findOne = jest.fn();
}

describe('AuthService', () => {
  let service: AuthService;
  let userModel: Model<User>;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: fakeUserModel,
        },
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get(getModelToken(User.name));
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUpUser', () => {
    test('it should create user', async () => {
      fakeUserModel.findOne = jest.fn().mockResolvedValue(null);
      const createdUser = await service.signUpUser(fakeSignUpUserDto);
      fakeCreatedUser.password = createdUser.password;

      expect(createdUser).toEqual(fakeCreatedUser);
    });

    test('it should throw error if user already exists', async () => {
      fakeUserModel.findOne = jest.fn().mockResolvedValue(fakeCreatedUser);
      try {
        await service.signUpUser(fakeSignUpUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
      }
    });
  });

  describe('validateUser', () => {
    test('it should return user if data is valid', async () => {
      fakeCreatedUser.password = await hashPassword(fakeCreatedUser.password);
      usersService.findByEmail = jest.fn().mockImplementationOnce(() => ({
        ...fakeCreatedUser,
        toJSON: jest.fn().mockReturnValue(fakeCreatedUser),
      }));

      const user = await service.validateUser(
        fakeCreatedUser.email,
        fakeSignUpUserDto.password,
      );

      expect(user).toEqual(fakeValidated);
    });

    test('it should return null if user not found', async () => {
      usersService.findByEmail = jest.fn().mockImplementationOnce(() => null);

      const user = await service.validateUser(
        fakeCreatedUser.email,
        fakeSignUpUserDto.password,
      );

      expect(user).toBe(null);
    });

    test('it should return null if incorrect password', async () => {
      usersService.findByEmail = jest.fn().mockImplementationOnce(() => ({
        password: 'incorrect',
      }));

      const user = await service.validateUser(
        fakeCreatedUser.email,
        fakeSignUpUserDto.password,
      );

      expect(user).toBe(null);
    });
  });

  describe('login', () => {
    test('it should return jwt_token', async () => {
      const user = await service.login({
        username: fakeCreatedUser.email,
        _id: fakeCreatedUser._id,
      });

      expect(user).toEqual(fakeToken);
    });
  });
});
