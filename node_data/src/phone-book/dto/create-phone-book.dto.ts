import { ApiProperty } from '@nestjs/swagger';

class PhoneBookNode {
    @ApiProperty({ description: 'First name' })
    readonly firstName: string;

    @ApiProperty({ description: 'Second name' })
    readonly secondName: string;

    @ApiProperty({ description: 'Phone number' })
    readonly number: string;

    @ApiProperty({ description: 'Address' })
    readonly address: string;
}

export class CreatePhoneBookDto {
    @ApiProperty({ type: [PhoneBookNode], description: 'Phone book nodes'})
    readonly phoneBook: [PhoneBookNode];
}
