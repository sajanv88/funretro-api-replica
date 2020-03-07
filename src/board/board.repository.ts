import { Repository, EntityRepository } from 'typeorm';
import * as bycrpt from 'bcryptjs';
import * as uuid from 'uuid/v4';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from './board.entity';
import { User } from 'src/auth/user.entity';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  async createNewBoard(
    boardDto: CreateBoardDto,
    user: User,
  ): Promise<{ result: string; name: string }> {
    const newBoard = new Board();
    newBoard.name = boardDto.name;
    newBoard.templates = boardDto.columns;
    newBoard.salt = `${await bycrpt.genSalt(10)}.${uuid()}`;
    newBoard.userId = user.id;
    newBoard.createdAt = new Date().toISOString();
    newBoard.votes = boardDto.votes;
    newBoard.disableVotes = boardDto.disableVotes;
    newBoard.hideVoteCount = boardDto.hideVoteCount;
    newBoard.shouldHideTask = boardDto.shouldHideTask;

    const result = `public/${newBoard.salt}`;
    await newBoard.save();
    return { result, name: newBoard.name };
  }

  async cloneBoard(
    boardId: number,
    user: User,
  ): Promise<{ result: string; name: string }> {
    const copyOfExisitingBoard = await this.findOne({
      id: boardId,
      userId: user.id,
    });
    if (!copyOfExisitingBoard)
      throw new NotFoundException(`Board id doesn't exisit ${boardId}`);

    const newBoard = new Board();
    newBoard.name = `${copyOfExisitingBoard.name} - ${uuid().substring(0, 5)}`;
    newBoard.templates = copyOfExisitingBoard.templates;
    newBoard.salt = `${await bycrpt.genSalt(10)}.${uuid()}`;
    newBoard.userId = user.id;
    newBoard.createdAt = new Date().toISOString();
    newBoard.votes = copyOfExisitingBoard.votes;
    newBoard.disableVotes = copyOfExisitingBoard.disableVotes;
    newBoard.hideVoteCount = copyOfExisitingBoard.hideVoteCount;
    newBoard.shouldHideTask = copyOfExisitingBoard.shouldHideTask;

    const result = `public/${newBoard.salt}`;
    await newBoard.save();
    return { result, name: newBoard.name };
  }
}
