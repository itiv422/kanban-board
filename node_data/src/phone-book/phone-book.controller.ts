import { PhoneBook } from './interfaces/phone-book.interface';
import { CreatePhoneBookDto } from './dto/create-phone-book.dto';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { PhoneBookService } from './phone-book.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('phoneBook')
@Controller('phoneBook')
export class PhoneBookController {
    constructor(private readonly phoneBookService: PhoneBookService) { }

    @Post()
    async create(@Body() createPhoneBookDto: CreatePhoneBookDto) {
        await this.phoneBookService.create(createPhoneBookDto);
    }

    @Get()
    async findAll(): Promise<PhoneBook[]> {
        return this.phoneBookService.findAll();
    }
}