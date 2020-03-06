import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/auth/user.entity';
import { BoardColumn } from './board-template.interface';

@Entity()
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  userId: number;

  @Column({ type: 'simple-json' })
  templates: BoardColumn;

  @Column()
  salt: string;

  @Column()
  createdAt: String;

  @Column()
  votes: number;

  @Column()
  shouldHideTask: boolean;

  @Column()
  disableVotes: boolean;

  @Column()
  hideVoteCount: boolean;

  @ManyToOne(
    type => User,
    user => user.boards,
    { eager: false },
  )
  user: User;
}
