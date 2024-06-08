import { ApiProperty } from '@nestjs/swagger';

export class ResponseAuthDto {
  @ApiProperty()
  access_token: string;
}
