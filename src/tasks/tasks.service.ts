import { SolrService } from './services/solr.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private readonly taskRepository: TaskRepository,
        private readonly solrService: SolrService
    ) { }

    async getTasks(
        filterDto: GetTasksFilterDto,
        user: User
    ): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }

    async searchTasks(query: string, user: User): Promise<any> {
        return this.solrService.search(query, user.username);
    }

    async getTaskById(id: number, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });

        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return found;
    }

    async createTask(
        createTaskDto: CreateTaskDto,
        user: User
    ): Promise<Task> {
        const task = await this.taskRepository.createTask(createTaskDto, user);
        this.solrService.addTask(
            {
                title: task.title,
                description: task.description,
                status: task.status,
                username: user.username,
                taskId: task.id
            }
        );
        return task;
    }

    async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();
        this.solrService.updateTaskStatusByTaskId(id,
            {
                title: task.title,
                description: task.description,
                status,
                username: user.username,
                taskId: task.id
            });

        return task;
    }

    async deteleTask(id: number, user: User): Promise<void> {
        const result = await this.taskRepository.delete({ id, userId: user.id });
        if (!result.affected) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        this.solrService.deleteTaskByTaskId(id);
    }
}
