import { ApiProperty } from '@nestjs/swagger';

export class NotFoundErrorEntity {
  @ApiProperty({ example: 404 })
  statusCode: number = 404;

  @ApiProperty({ example: 'Not Found' })
  error: string;

  @ApiProperty({ example: 'Could not find the item.' })
  message: string;
}
