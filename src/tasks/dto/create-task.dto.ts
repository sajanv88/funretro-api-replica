import { IsNotEmpty, Min, Max } from 'class-validator';

export class CreateTaskDto {
  title: string;

  @IsNotEmpty()
  @Max(6, { message: 'Maximum vote limit is 6' })
  noOfVotes: number;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  boardTemplateId: number;

  @IsNotEmpty()
  annonymousToken: string;
}
