import { Model } from 'mongoose';
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;
    const getUser = await this.userModel.findOne({ email });

    if (getUser) {
      throw new ConflictException('User already exists');
    }

    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const foundUser = await this.userModel.findById(id).exec();

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    return foundUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const foundUser = await this.userModel.findById(id).exec();

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    await this.userModel.updateOne({ _id: id }, updateUserDto).exec();
  }

  async remove(id: string): Promise<void> {
    const foundUser = await this.userModel.findById(id).exec();

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    await this.userModel.deleteOne({ _id: id });
  }
}
