import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

const { MONGODB_URL, MONGODB_DATABASE } = process.env;
@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_URL, {
      dbName: MONGODB_DATABASE,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
