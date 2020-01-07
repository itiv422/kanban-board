export class CreatePhoneBookDto {
    readonly phoneBook: [
        {
            readonly firstName: string,
            readonly secondName: string,
            readonly number: string,
            readonly address: string
        }
    ];
}