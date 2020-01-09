import { PhoneBook } from './interfaces/phone-book.interface';
import { CreatePhoneBookDto } from './dto/create-phone-book.dto';
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PhoneBookService } from './phone-book.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@ApiTags('phoneBook')
@Controller('phoneBook')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class PhoneBookController {
    constructor(private readonly phoneBookService: PhoneBookService) { }

    @Post()
    async update(@Body() createPhoneBookDto: CreatePhoneBookDto, @GetUser() user: User) {
        await this.phoneBookService.update(createPhoneBookDto, user.userName);
    }

    @Get()
    async findAll(@GetUser() user: User): Promise<PhoneBook[]> {
        return this.phoneBookService.findAll(user.userName);
    }
}