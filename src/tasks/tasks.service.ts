import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { Board } from 'src/board/board.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getBoard(boardId: number, user: User): Promise<Board> {
    const board = user.boards.find(
      board => board.userId === user.id && board.id === boardId,
    );
    if (!board) throw new NotFoundException(`Board doesn't exits`);
    return board;
  }

  async getTasksByBoardById(id: number): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      boardId: id,
    });
    return tasks;
  }

  async getTasks(filterDto: GetTasksFilterDto, board: Board): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, board);
  }

  async getTaskById(id: number, board: Board): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, boardId: board.id },
    });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, board: Board): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, board);
  }

  async deleteTask(id: number, board: Board): Promise<void> {
    const result = await this.taskRepository.delete({ id, boardId: board.id });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTask(
    id: number,
    board: Board,
    updateTaskDto: CreateTaskDto,
  ): Promise<{ result: Task }> {
    const task = await this.getTaskById(id, board);
    if (!task)
      throw new NotFoundException('source not found to perform this operation');
    task.description = updateTaskDto.description;
    task.noOfVotes = updateTaskDto.noOfVotes;
    await task.save();
    return { result: task };
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    board: Board,
  ): Promise<Task> {
    const task = await this.getTaskById(id, board);
    task.status = status;
    await task.save();
    return task;
  }
}
