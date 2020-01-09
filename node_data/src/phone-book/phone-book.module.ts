import { PhoneBookController } from './phone-book.controller';
import { PhoneBookSchema } from './schemas/phone-book.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PhoneBookService } from './phone-book.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'PhoneBook', schema: PhoneBookSchema }]), AuthModule],
  controllers: [PhoneBookController],
  providers: [PhoneBookService]
})
export class PhoneBookModule {}