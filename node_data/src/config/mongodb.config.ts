import config = require('config');

export const mongoUrl = process.env.MONGO_URL || config.get<string>('mongo.url');

export const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
