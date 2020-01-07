import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PhoneBook } from './interfaces/phone-book.interface';
import { CreatePhoneBookDto } from './dto/create-phone-book.dto';

@Injectable()
export class PhoneBookService {
  constructor(@InjectModel('PhoneBook') private readonly phoneBookModel: Model<PhoneBook>) {}

  async create(createPhoneBookDto: CreatePhoneBookDto): Promise<PhoneBook> {
    const createdCat = new this.phoneBookModel(createPhoneBookDto);
    const response = await createdCat.save();
    return response;
  }

  async findAll(): Promise<PhoneBook[]> {
    const result = await this.phoneBookModel.find().exec();
    return result;
  }
}
