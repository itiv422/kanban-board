import { PipeTransform, BadRequestException } from '@nestjs/common';

export class SearchQueryValidationPipe implements PipeTransform {

    transform(value: string) {
        if (value.includes('"')) {
            throw new BadRequestException(`Query contains invalid characters`);
        }

        return value;
    }
}
