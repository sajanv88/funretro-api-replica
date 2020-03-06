import { Repository, EntityRepository } from 'typeorm';
import * as bycrpt from 'bcryptjs';
import * as uuid from 'uuid/v4';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from './board.entity';
import { User } from 'src/auth/user.entity';

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
}
