import * as mongoose from 'mongoose';

export const PhoneBookSchema = new mongoose.Schema({
  userName: String,
  phoneBook: [
      {
          firstName: String,
          secondName: String,
          number: String,
          address: String
      }
  ]
});