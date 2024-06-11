import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { IBook } from './schemas/book.schema';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiTags,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ResponseBookDto } from './dto/response-book.dto';
import { ErrorResponseDto } from '../common/dto/common.dto';

@ApiTags('Books')
@ApiHeader({ name: 'Authorization' })
@UseGuards(AuthGuard)
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiOperation({ summary: 'Create a book' })
  @ApiResponse({ status: 201, type: ResponseBookDto })
  async create(@Body() createBookDto: CreateBookDto): Promise<IBook> {
    return this.bookService.create(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({ status: 200, type: [ResponseBookDto] })
  async findAll(): Promise<IBook[]> {
    return this.bookService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by id' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: ResponseBookDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  async findOne(@Param('id') id: string): Promise<IBook> {
    return this.bookService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a book by id' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: ResponseBookDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<IBook> {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book by id' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: ResponseBookDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  async remove(@Param('id') id: string): Promise<IBook> {
    return this.bookService.remove(id);
  }
}
