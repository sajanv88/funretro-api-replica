import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { BoardColumn } from '../board-template.interface';

export class CreateBoardDto {
  @IsNotEmpty()
  @MinLength(5, { message: 'Minimum character length is 5' })
  @MaxLength(25, { message: 'Maximum character limit is 25' })
  name: string;
  userId: number;
  votes: number = 3;
  shouldHideTask: boolean = false;
  disableVotes: boolean = false;
  hideVoteCount: boolean = false;
  columns: BoardColumn;
}
