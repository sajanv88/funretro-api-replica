import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { AuthModule } from 'src/auth/auth.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { PublicBoardController } from './public-board.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoardRepository]),
    AuthModule,
    TasksModule,
  ],
  providers: [BoardService],
  controllers: [BoardController, PublicBoardController],
})
export class BoardModule {}
