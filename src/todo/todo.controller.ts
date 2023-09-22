import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiInternalServerErrorResponse,
  getSchemaPath,
  ApiQuery,
  ApiOperation,
} from '@nestjs/swagger';

import { Todo, TodoState } from '@prisma/client';

import { TodoService } from './todo.service';
import {
  TodoEntity,
  NotFoundErrorEntity,
  InternalServerErrorEntity,
} from './entities';
import { CreateTodoDto, UpdateTodoDto, ChangeTodoStateDto } from './dto';

@Controller('todo')
@ApiTags('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of Todo with offset and limit option.' })
  @ApiQuery({
    name: 'o',
    type: 'integer',
    description: 'offset in pagination flow',
    example: 0,
    required: false,
  })
  @ApiQuery({
    name: 'l',
    type: 'integer',
    description: 'limit in pagination flow',
    example: 10,
    required: false,
  })
  @ApiOkResponse({
    description: 'Returns a list of Todo.',
    schema: {
      properties: {
        todo: {
          type: 'array',
          items: {
            $ref: getSchemaPath(TodoEntity),
          },
        },
        todoCount: {
          type: 'integer',
          example: 10,
        },
      },
    },
  })
  async getTodo(@Query('o') offset?: string, @Query('l') limit?: string) {
    const todoArray = await this.todoService.getMany({
      skip: isNaN(+offset) ? 0 : +offset,
      take: isNaN(+limit) ? 0 : +limit,
    });

    return todoArray;
  }

  @Get(':id')
  @ApiOperation({ summary: "Get a specific Todo by it's ID." })
  @ApiOkResponse({ description: 'Returns the Todo.', type: TodoEntity })
  @ApiInternalServerErrorResponse({
    description: 'It occurs when you send wrong ID format(not numeric)',
    type: InternalServerErrorEntity,
  })
  @ApiNotFoundResponse({
    description: 'It occurs when there is no Todo with the entry ID.',
    type: NotFoundErrorEntity,
  })
  async getTodoById(@Param('id') id: string) {
    if (isNaN(+id)) {
      throw new HttpException('Wrong id Provided!', 500);
    }

    const todo = await this.todoService.getUnique({ id: +id });
    if (todo === null) {
      throw new NotFoundException('Could not find Todo.');
    }

    return todo;
  }

  @Post()
  @ApiOperation({ summary: 'Create new Todo' })
  @ApiCreatedResponse({
    description: 'Returns the created Todo.',
    type: TodoEntity,
  })
  @ApiInternalServerErrorResponse({
    description: "It occurs when you don't send title",
    type: InternalServerErrorEntity,
  })
  async addTodo(@Body() { title, description }: CreateTodoDto) {
    if (title === undefined) {
      throw new HttpException('Title must be provided', 500);
    }

    return await this.todoService.create({ title, description });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update title and description of Todo' })
  @ApiOkResponse({
    description: "Returns the Todo with it's latest changes.",
    type: TodoEntity,
  })
  @ApiInternalServerErrorResponse({
    description: 'It occurs when you send wrong ID format(not numeric)',
    type: InternalServerErrorEntity,
  })
  @ApiNotFoundResponse({
    description: 'It occurs when there is no Todo with the entry ID.',
    type: NotFoundErrorEntity,
  })
  async updateTodo(
    @Param('id') id: string,
    @Body() { title, description }: UpdateTodoDto,
  ) {
    if (isNaN(+id)) {
      throw new HttpException('Wrong id Provided!', 500);
    }

    try {
      return await this.todoService.update({
        where: { id: +id },
        data: { title, description },
      });
    } catch (err) {
      throw new NotFoundException(`There is no todo item with id of ${id}`);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update state of Todo.' })
  @ApiOkResponse({
    description: "Returns the Todo with it's latest changes.",
    type: TodoEntity,
  })
  @ApiInternalServerErrorResponse({
    description:
      'It occurs when you send either wrong ID format(not numeric) or wrong state(neither Done nor Undone)',
    type: InternalServerErrorEntity,
  })
  @ApiNotFoundResponse({
    description: 'It occurs when there is no Todo with the entry ID.',
    type: NotFoundErrorEntity,
  })
  async changeTodoState(
    @Param('id') id: string,
    @Body() { state }: ChangeTodoStateDto,
  ) {
    if (isNaN(+id)) {
      throw new HttpException('Wrong id Provided!', 500);
    }

    if (state !== undefined && !(state in TodoState)) {
      throw new HttpException('Invalid state.', 501);
    }

    try {
      return await this.todoService.update({
        where: { id: +id },
        data: { state: TodoState[state] },
      });
    } catch (err) {
      throw new NotFoundException(`There is no todo item with id of ${id}`);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific Todo.' })
  @ApiOkResponse({ description: 'Returns the deleted Todo.', type: TodoEntity })
  @ApiInternalServerErrorResponse({
    description: 'It occurs when you send wrong ID format(not numeric)',
    type: InternalServerErrorEntity,
  })
  @ApiNotFoundResponse({
    description: 'It occurs when there is no Todo with the entry ID.',
    type: NotFoundErrorEntity,
  })
  async deleteTodo(@Param('id') id: string) {
    if (isNaN(+id)) {
      throw new HttpException('Wrong id Provided!', 500);
    }

    let deletedTodo: Todo;
    try {
      deletedTodo = await this.todoService.delete({ id: +id });
    } catch (err) {
      throw new NotFoundException(`There is no todo item with id of ${id}`);
    }

    return deletedTodo;
  }
}
