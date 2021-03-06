import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { ApiBearerAuth, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { SearchQueryValidationPipe } from './pipes/search-query-validation.pipe';

@Controller('tasks')
@UseGuards(AuthGuard())
@ApiBearerAuth()
@ApiTags('tasks')
export class TasksController {
    private readonly logger = new Logger('TasksController');

    constructor(private readonly tasksService: TasksService) { }

    @Get()
    @ApiCreatedResponse({
        description: 'Get all tasks.',
        type: [Task]
    })
    getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
        @GetUser() user: User
    ): Promise<Task[]> {
        this.logger.verbose(`User "${user.userName}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`);
        return this.tasksService.getTasks(filterDto, user);
    }

    @ApiCreatedResponse({
        description: 'Search tasks.'
    })
    @Get('/search')
    searchTasks(
        @Query('query', SearchQueryValidationPipe) query: string,
        @GetUser() user: User
    ): Promise<any> {
        return this.tasksService.searchTasks(query, user);
    }

    @Get('/:id')
    @ApiCreatedResponse({
        description: 'Get task by id.',
        type: Task
    })
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    @ApiCreatedResponse({
        description: 'Create task.',
        type: Task
    })
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User
    ): Promise<Task> {
        this.logger.verbose(`User "${user.userName}" creating a new tasks. Data: ${JSON.stringify(createTaskDto)}`);
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Patch('/:id/status')
    @ApiCreatedResponse({
        description: 'Update task.',
        type: Task
    })
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User
    ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status, user);
    }

    @Delete('/:id')
    @ApiCreatedResponse({
        description: 'Delete task.',
        type: Task
    })
    deleteTask(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<void> {
        return this.tasksService.deteleTask(id, user);
    }
}
