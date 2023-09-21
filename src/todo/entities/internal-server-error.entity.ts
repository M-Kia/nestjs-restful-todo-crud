import { ApiProperty } from '@nestjs/swagger';

export class InternalServerErrorEntity {
  @ApiProperty({ example: 500 })
  statusCode: number;

  @ApiProperty({ example: 'Wrong id provided.' })
  message: string;
}
