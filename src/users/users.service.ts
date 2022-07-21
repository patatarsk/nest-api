import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const foundUser = await this.userModel.findOne({ email }).exec();

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    return foundUser;
  }

  async findOne(id: string): Promise<User> {
    const foundUser = await this.userModel.findById(id).exec();

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    return foundUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    await this.userModel.updateOne({ _id: id }, updateUserDto).exec();
  }

  async remove(id: string): Promise<void> {
    await this.userModel.deleteOne({ _id: id }).exec();
  }

  async saveAvatar(username: string, filename: string): Promise<void> {
    await this.userModel
      .updateOne({ email: username }, { avatar: filename })
      .exec();
  }

  async autorshipStatistic(): Promise<void> {
    const agregate = this.userModel.aggregate([
      { $group: { totaldocs: { $sum: 1 } } },
    ]);

    console.log(agregate);
  }
}
