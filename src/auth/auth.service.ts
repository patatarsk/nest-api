import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { hash, compare } from 'bcrypt';
import { bcryptConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUpUser(signUpUserDto: SignUpUserDto): Promise<User> {
    const { email } = signUpUserDto;
    const getUser = await this.userModel.findOne({ email });

    if (getUser) {
      throw new ConflictException('User already exists');
    }

    const password = await hash(
      signUpUserDto.password,
      bcryptConstants.saltRounds,
    );
    const signUpUser = new this.userModel({ ...signUpUserDto, password });
    return signUpUser.save();
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    const isValidPassword = await compare(password, user.password);

    if (user && isValidPassword) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
