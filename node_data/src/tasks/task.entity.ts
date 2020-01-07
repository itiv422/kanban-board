import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Task extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @ApiProperty({ description: 'Title' })
    title: string;

    @Column()
    @ApiProperty({ description: 'Description' })
    description: string;

    @Column()
    @ApiProperty({
        description: 'Task status',
        default: 'OPEN',
    })
    status: TaskStatus;

    @ManyToOne(type => User, user => user.tasks, { eager: false })
    user: User;

    @Column()
    userId: number;

    constructor(title: string, description: string, status: TaskStatus, user: User) {
        super();
        this.title = title;
        this.description = description;
        this.status = status;
        this.user = user;
    }
}
