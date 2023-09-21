import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    title: 'title',
    type: 'string',
    description: 'Title of the todo',
    example: 'exercise',
  })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    title: 'description',
    type: 'string',
    description: 'Description of the todo',
    example: 'Do 10 push-ups',
  })
  description?: string;
}
