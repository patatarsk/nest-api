import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { AuthModule } from 'src/auth/auth.module';

const userModel = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);

@Module({
  imports: [userModel],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, userModel],
})
export class UsersModule {}
