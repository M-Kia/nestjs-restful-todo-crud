import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { TodoModule } from './todo/todo.module';

@Module({
  imports: [ScheduleModule.forRoot(), TodoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
