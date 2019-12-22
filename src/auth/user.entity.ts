import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';
import { Task } from 'src/tasks/task.entity';
import bcryptjs = require('bcryptjs');

@Entity()
@Unique(['username'])
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @OneToMany(type => Task, task => task.user, { eager: true })
    tasks: Task[];

    constructor(username: string, password: string, salt: string) {
        super();
        this.username = username;
        this.password = password;
        this.salt = salt;
    }

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcryptjs.hash(password, this.salt);

        return hash === this.password;
    }
}
