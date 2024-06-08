import { CreateBookDto } from './create-book.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseBookDto extends CreateBookDto {
  @ApiProperty()
  id: string;
}
