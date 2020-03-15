import {
  Controller,
  Get,
  Param,
  ValidationPipe,
  Post,
  Body,
  Delete,
  ParseIntPipe,
  Put,
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

  @Delete('/:taskId/:signature')
  async deletePublicTask(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Param('signature', ValidationPipe) signature: string,
  ) {
    return this.bs.deletePublicTask(signature, taskId);
  }

  @Put('/:taskId/:signature')
  async updatePublicTask(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Param('signature', ValidationPipe) signature: string,
    @Body() updateTaskDto: CreateTaskDto,
  ) {
    const result = await this.bs.updatePublicTask(
      signature,
      taskId,
      updateTaskDto,
    );
    return result;
  }
}
