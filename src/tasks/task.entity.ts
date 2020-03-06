import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { Board } from 'src/board/board.entity';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  noOfVotes: number;

  @Column()
  status: TaskStatus;

  @Column()
  boardTemplateId: number;

  @ManyToOne(
    type => Board,
    board => board.id,
    { eager: false },
  )
  boardId: number;
}
