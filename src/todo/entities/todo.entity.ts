import { ApiProperty } from '@nestjs/swagger';

import { Todo, TodoState } from '@prisma/client';

export class TodoEntity implements Todo {
  @ApiProperty({ example: 0 })
  id: number;

  @ApiProperty({ example: 'Do homework' })
  title: string;

  @ApiProperty({ required: false, nullable: true, example: 'Lorem Ipsum' })
  description: string | null;

  @ApiProperty({ enum: ['Done', 'Undone'], example: 'Done' })
  state: TodoState;

  @ApiProperty({
    required: false,
    nullable: true,
    example: new Date(),
  })
  doneTm: Date | null;
}
