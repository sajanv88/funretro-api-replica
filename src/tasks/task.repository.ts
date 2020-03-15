import { Task } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import { Board } from 'src/board/board.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');

  async getTasks(filterDto: GetTasksFilterDto, board: Board): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where('task.boardId = :boardId', { boardId: board.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for the board "${
          board.id
        }". Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDto: CreateTaskDto, board: Board): Promise<Task> {
    const { title = '', description, noOfVotes } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.noOfVotes = noOfVotes;
    task.status = TaskStatus.OPEN;
    task.boardId = board.id;
    task.boardTemplateId = createTaskDto.boardTemplateId;

    try {
      await task.save();
    } catch (error) {
      this.logger.error(
        `Failed to create a task for the board "${board.id}". Data: ${createTaskDto}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    return task;
  }
}
