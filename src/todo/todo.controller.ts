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
  @ApiOkResponse({ type: TodoEntity })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorEntity })
  @ApiNotFoundResponse({ type: NotFoundErrorEntity })
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
  @ApiCreatedResponse({ type: TodoEntity })
  async addTodo(@Body() createTodo: CreateTodoDto) {
    return await this.todoService.create(createTodo);
  }

  @Put(':id')
  @ApiOkResponse({ type: TodoEntity })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorEntity })
  @ApiNotFoundResponse({ type: NotFoundErrorEntity })
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
  @ApiOkResponse({ type: TodoEntity })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorEntity })
  @ApiNotFoundResponse({ type: NotFoundErrorEntity })
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
  @ApiOkResponse({ type: TodoEntity })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorEntity })
  @ApiNotFoundResponse({ type: NotFoundErrorEntity })
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
