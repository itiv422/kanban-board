import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import bcryptjs = require("bcryptjs");

const DUPLICATE_USERNAME_DBERROR = '23505';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { userName, password } = authCredentialsDto;
        const salt = await bcryptjs.genSalt();
        const user = new User(userName, await this.hashPassword(password, salt), salt);
        try {
            await user.save();
        } catch (error) {
            if (error.code === DUPLICATE_USERNAME_DBERROR) {
                throw new ConflictException('Username alredy exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { userName, password } = authCredentialsDto;
        const user = await this.findOne({ userName });
        if (user && await user.validatePassword(password)) {
            return user.userName;
        } else {
            return null;
        }

    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcryptjs.hash(password, salt);
    }
}
