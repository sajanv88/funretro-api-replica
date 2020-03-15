import { BoardColumn } from './board-template.interface';

export interface BoardInterface {
  id: number;
  name: string;
  templates?: BoardColumn;
  salt: string;
  shouldHideTask: boolean;
  disableVotes: boolean;
  hideVoteCount: boolean;
  votes: number;
}
