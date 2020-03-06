import {
  Controller,
  Get,
  Param,
  ValidationPipe,
  Post,
  Body,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';

@Controller('public')
export class PublicBoardController {
  constructor(private bs: BoardService) {}

  @Get('/:signature')
  async showAll(@Param('signature', ValidationPipe) signature: string) {
    const result = await this.bs.getBoardAndTasks(signature);
    return result;
  }

  @Post('/:signature')
  async submitTask(
    @Param('signature', ValidationPipe) signature: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    const result = await this.bs.createTask(signature, createTaskDto);
    return result;
  }
}
