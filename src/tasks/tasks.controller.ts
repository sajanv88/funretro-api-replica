import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(private tasksService: TasksService) {}

  @Get('/:boardId')
  async getTasks(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.email}" retrieving all tasks. Filters: ${JSON.stringify(
        filterDto,
      )}`,
    );
    const board = await this.tasksService.getBoard(boardId, user);
    return this.tasksService.getTasks(filterDto, board);
  }

  // @Get('/:id')
  // getTaskById(
  //   @Param('id', ParseIntPipe) id: number,
  //   @GetUser() user: User,
  // ): Promise<Task> {
  //   const board = user.boards.find(board => board.userId === user.id);

  //   return this.tasksService.getTaskById(id, board);
  // }

  @Post('/:boardId')
  @UsePipes(ValidationPipe)
  async createTask(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.email}" creating a new task. Data: ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    const board = await this.tasksService.getBoard(boardId, user);
    return this.tasksService.createTask(createTaskDto, board);
  }

  @Delete('/:boardId/:taskId')
  async deleteTask(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @GetUser() user: User,
  ): Promise<void> {
    const board = await this.tasksService.getBoard(boardId, user);
    return this.tasksService.deleteTask(taskId, board);
  }

  @Patch('/:boardId/:taskId/status')
  async updateTaskStatus(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    const board = await this.tasksService.getBoard(boardId, user);
    return this.tasksService.updateTaskStatus(taskId, status, board);
  }
}
