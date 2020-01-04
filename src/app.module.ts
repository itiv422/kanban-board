import { PhoneBookModule } from './phone-book/phone-book.module';
import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    MongooseModule.forRoot('mongodb://admin:admin@localhost:27017/phone-book'),
    TasksModule,
    AuthModule,
    PhoneBookModule
  ]
})
export class AppModule { }
