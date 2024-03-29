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

    if (!user) {
      return null;
    }

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      return null;
    }

    const { password: pswrd, ...result } = user.toJSON();

    return result;
  }

  async login(user: any): Promise<any> {
    const { username, _id } = user;
    const payload = { username, sub: _id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
