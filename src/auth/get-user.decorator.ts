import { createParamDecorator } from '@nestjs/common';
import { User } from './user.entity';
import { Board } from 'src/board/board.entity';

export interface UserInterface {
  id: number;
  email: string;
  fullName: string;
  createdAt: string;
  isVerfied: boolean;
  boards: Board[];
}

export const GetUser = createParamDecorator(
  (data, req): UserInterface => {
    const { id, email, fullName, createdAt, isVerfied, boards } = req.user;
    const user: UserInterface = {
      id,
      email,
      fullName,
      createdAt,
      isVerfied,
      boards,
    };
    return user;
  },
);
