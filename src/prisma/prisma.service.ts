import { Injectable, OnModuleInit } from '@nestjs/common';

import {
  PrismaClient,
  //  TodoState
} from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();

    // FIXME: This middleware did not triggered.
    // this.$extends({
    //   name: 'auto-update-doneTm',
    //   query: {
    //     todo: {
    //       async findUnique({ query, args }) {
    //         console.log('findUnique');
    //         console.log({ args });
    //         return query(args);
    //       },
    //       async update({ query, args }) {
    //         console.log('-------------------------------');
    //         console.log({ data: args.data });
    //         if (args.data?.state !== undefined) {
    //           console.log({
    //             data: args.data.state,
    //             condition: args.data.state === TodoState.Done,
    //           });
    //           if (args.data.state === TodoState.Done) {
    //             console.log({
    //               where: { ...args.where, state: TodoState.Undone },
    //               data: { ...args.data, doneTm: new Date() },
    //             });
    //           } else {
    //             args.data.doneTm = null;
    //           }
    //         }

    //         return query(args);
    //       },
    //     },
    //   },
    // });
  }

  async onModuleInit() {
    this.$connect();
  }
}
