import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PhoneBook } from './interfaces/phone-book.interface';
import { CreatePhoneBookDto } from './dto/create-phone-book.dto';

@Injectable()
export class PhoneBookService {
  constructor(@InjectModel('PhoneBook') private readonly phoneBookModel: Model<PhoneBook>) {}

  async update(createPhoneBookDto: CreatePhoneBookDto, userName: string): Promise<PhoneBook> {
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const phoneBookNodes =  (await this.phoneBookModel.updateOne(
      {
        userName
      },
      {
        userName,
        phoneBook: createPhoneBookDto
      }, options)).phoneBook;

    return phoneBookNodes;
  }

  async findAll(userName: string) {
    const result = (await this.phoneBookModel.findOne({ userName }).exec());

    return result;
  }
}
