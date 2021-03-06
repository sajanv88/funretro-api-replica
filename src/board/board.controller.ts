import {
  Controller,
  Post,
  UseGuards,
  Get,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  ValidationPipe,
  Put,
  Query,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { BoardService } from './board.service';

@Controller('board')
@UseGuards(AuthGuard())
export class BoardController {
  constructor(private bs: BoardService) {}

  @Get('/profile')
  fetchProfile(@GetUser() user: User) {
    return { user };
  }

  @Get('/boards')
  fetchBoards(@GetUser() user: User) {
    return this.bs.getBoards(user);
  }

  @Get('/clone/:boardId')
  cloneBoard(
    @Param('boardId', ParseIntPipe) boardId: number,
    @GetUser() user: User,
  ) {
    return this.bs.cloneBoard(boardId, user);
  }

  @Get('/:boardId/:signature')
  fetchABoard(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('signature', ValidationPipe) signature: string,
  ) {
    return this.bs.getBoardById(boardId, signature);
  }

  @Post('/create')
  createBoard(@Body() boardDto: CreateBoardDto, @GetUser() user: User) {
    return this.bs.createABoard(boardDto, user);
  }

  @Delete('/:boardId')
  deleteBoard(@Param('boardId', ParseIntPipe) boardId: number) {
    return this.bs.deleteABoard(boardId);
  }

  @Put('/:boardId')
  async updateOptions(
    @Param('boardId', ParseIntPipe)
    boardId: number,
    @Body() boardDto: CreateBoardDto,
    @GetUser() user: User,
  ) {
    const result = await this.bs.updateBoard(boardId, user, boardDto);
    return result;
  }
}
