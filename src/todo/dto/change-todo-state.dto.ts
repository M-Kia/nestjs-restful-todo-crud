import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { TodoState } from '@prisma/client';

export class ChangeTodoStateDto {
  @IsEnum(TodoState)
  @IsOptional()
  @ApiProperty({
    title: 'state',
    type: 'string',
    enum: ['Done', 'Undone'],
    description: 'State of the todo',
    example: 'Done',
  })
  state?: string;
}
