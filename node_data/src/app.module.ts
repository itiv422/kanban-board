import { mongoUrl, mongoOptions } from './config/mongodb.config';
import { PhoneBookModule } from './phone-book/phone-book.module';
import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { QueueModule } from 'nest-queue';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    MongooseModule.forRoot(mongoUrl, mongoOptions),
    QueueModule.forRoot({connection: { redis: { port: 6379, host: 'localhost'}}}),
    TasksModule,
    AuthModule,
    PhoneBookModule
  ]
})
export class AppModule { }