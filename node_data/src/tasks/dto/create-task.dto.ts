import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
    @IsNotEmpty()
    @ApiProperty({ description: 'Title' })
    title: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'Description' })
    description: string;
}
