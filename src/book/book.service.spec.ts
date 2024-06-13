import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { BookSchema, Category } from './schemas/book.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

describe('BookService', () => {
  let service: BookService;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }]),
      ],
      providers: [BookService],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CRUD operations', () => {
    let bookId: string;
    let updatedBookDto: any;
    const bookDto = {
      title: 'Test Book',
      description: 'Test Description',
      author: 'Test Author',
      price: 123,
      category: Category.ADVENTURE,
    };

    it('should create a book', async () => {
      const book = await service.create(bookDto);
      expect(book).toMatchObject(bookDto);
      bookId = book.id;
    });

    it('should get all books', async () => {
      const books = await service.findAll();
      expect(books).toMatchObject([bookDto]);
    });

    it('should get a book', async () => {
      const book = await service.findOne(bookId);
      expect(book).toMatchObject(bookDto);
    });

    it('should throw an error when a book is not found', async () => {
      const invalidId = new Types.ObjectId().toHexString();
      expect(service.findOne(invalidId)).rejects.toThrow(NotFoundException);
    });

    it('should update a book', async () => {
      const updateBookDto = {
        title: 'Updated Book',
      };
      const updatedBook = await service.update(bookId, updateBookDto);
      updatedBookDto = {
        ...bookDto,
        ...updateBookDto,
      };
      expect(updatedBook).toMatchObject(updatedBookDto);
    });

    it('should delete a book', async () => {
      const deletedBook = await service.remove(bookId);
      expect(deletedBook).toMatchObject(updatedBookDto);
    });
  });
});
