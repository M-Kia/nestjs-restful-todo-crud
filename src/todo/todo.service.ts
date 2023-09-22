import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Todo, TodoState } from '@prisma/client';

type GetTodoParameters = {
  skip?: number;
  take?: number;
  where?: Prisma.TodoWhereInput;
  orderBy?: Prisma.TodoOrderByWithRelationInput;
};

type UpdateTodoParameters = {
  where: Prisma.TodoWhereUniqueInput;
  data: Prisma.TodoUpdateInput;
};

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async getUnique(params: Prisma.TodoWhereUniqueInput): Promise<Todo | null> {
    return await this.prisma.todo.findUnique({ where: params });
  }

  async getMany(
    params: GetTodoParameters,
  ): Promise<{ todo: Todo[]; todoCount: number }> {
    const { skip, take, where, orderBy } = params;

    const todoCount = await this.prisma.todo.count({
      where,
    });

    const allTodo = await this.prisma.todo.findMany({
      skip,
      take,
      where,
      orderBy,
    });

    return { todo: allTodo, todoCount };
  }

  async create(data: Prisma.TodoCreateInput): Promise<Todo> {
    return await this.prisma.todo.create({ data });
  }

  async update(params: UpdateTodoParameters): Promise<Todo> {
    const { data, where } = params;

    // TODO: This block should go to prisma middleware
    const todo = await this.prisma.todo.findUnique({ where });
    if (todo === null) {
      throw new Error('Todo not found.');
    }

    if (data.state !== undefined) {
      if (data.state === TodoState.Done && todo.doneTm === null) {
        data.doneTm = new Date();
      } else if (data.state !== TodoState.Done && todo.doneTm !== null) {
        data.doneTm = null;
      }

      data.state;
    }
    // End of the block

    return await this.prisma.todo.update({
      where,
      data,
    });
  }

  async delete(where: Prisma.TodoWhereUniqueInput): Promise<Todo> {
    return await this.prisma.todo.delete({
      where,
    });
  }

  @Cron('0 0 8 * * *', {
    name: 'Logger',
    timeZone: 'Asia/Tehran',
  })
  triggerLogger() {
    this.prisma.todo.findMany().then((todo) => console.log(todo));
  }
}
