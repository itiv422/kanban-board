import { Document } from 'mongoose';

export interface PhoneBook extends Document {
    readonly userName: string;
    readonly phoneBook: [
        {
            readonly firstName: string,
            readonly secondName: string,
            readonly number: string,
            readonly address: string
        }
    ];
}