import { SignUpUserDto } from './dto/sign-up-user.dto';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthUserDto } from './dto/auth-user.dto';
import mongoose from 'mongoose';

const fakeUser: SignUpUserDto = {
  email: 'Fake',
  password: 'Fake',
  name: 'Fake',
};

const fakeAuth: AuthUserDto = {
  username: 'Fake',
  password: 'Fake',
};

export const fakeReq = {
  user: {
    _id: new mongoose.Types.ObjectId().toString(),
  },
};

const userId = fakeReq.user._id;

describe('AuthController', () => {
  let controller: AuthController;
  let serviceMock: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useFactory: () => ({
            signUpUser: jest.fn().mockResolvedValue(fakeUser),
            login: jest.fn().mockResolvedValue(fakeUser),
          }),
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    serviceMock = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    beforeEach(async () => {
      await controller.signUp(fakeUser);
    });

    test('it should call method signUp from service with provided data', () => {
      expect(serviceMock.signUpUser).toBeCalledWith(fakeUser);
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await controller.login(fakeAuth, fakeReq);
    });

    test('it should call method login from service with provided data', () => {
      expect(serviceMock.login).toBeCalledWith({ ...fakeAuth, _id: userId });
    });
  });
});
