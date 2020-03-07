import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardRepository } from './board.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { User } from 'src/auth/user.entity';
import { TasksService } from 'src/tasks/tasks.service';
import { Task } from 'src/tasks/task.entity';
import { Board } from './board.entity';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { BoardInterface } from './board.interface';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
    private ts: TasksService,
  ) {}

  async getBoardById(id: number, salt: string): Promise<Board> {
    const board = await this.boardRepository.findOne({ id, salt });
    if (!board) throw new NotFoundException('Board not found');
    return board;
  }

  async getBoards(user: User): Promise<Board[]> {
    const boards = await this.boardRepository.find({ userId: user.id });
    return boards;
  }

  async getBoardAndTasks(
    signature: string,
  ): Promise<{ board: BoardInterface; tasks: Task[] }> {
    const { id, name, salt, templates } = await this.boardRepository.findOne({
      salt: signature,
    });
    const tasks: Task[] = await this.ts.getTasksByBoardById(id);
    const board: BoardInterface = {
      id,
      name,
      salt,
      templates,
    };
    return { board, tasks };
  }

  async createABoard(
    boardDto: CreateBoardDto,
    user: User,
  ): Promise<{ result: string; name: string }> {
    const response = await this.boardRepository.createNewBoard(boardDto, user);
    return response;
  }

  async cloneBoard(
    boardId: number,
    user: User,
  ): Promise<{ result: string; name: string }> {
    const response = await this.boardRepository.cloneBoard(boardId, user);
    return response;
  }

  async deleteABoard(id: number): Promise<{ result: string }> {
    const board: Board = await this.boardRepository.findOne({ id });
    if (!board) throw new NotFoundException(`Board not found ${id}`);

    const tasks: Task[] = await this.ts.getTasksByBoardById(id);
    tasks.forEach(async (task: Task) => {
      await this.ts.deleteTask(task.id, board);
    });

    await this.boardRepository.delete({ id });
    return {
      result: `"${board.name.toUpperCase()}" has been deleted. All of the tasks associated with this board also deleted.`,
    };
  }

  async createTask(
    salt: string,
    createTaskDto: CreateTaskDto,
  ): Promise<{ result: string }> {
    const board: Board = await this.boardRepository.findOne({ salt });
    if (!board) throw new NotFoundException(`Board not found`);
    await this.ts.createTask(createTaskDto, board);
    return { result: 'ok!' };
  }
}
