import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { Category } from './schemas/book.schema';

describe('BookController', () => {
  let controller: BookController;
  let service: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BookController>(BookController);
    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a book', async () => {
    const bookDto: CreateBookDto = {
      title: 'Test Book',
      author: 'Test Author',
      description: 'Test Description',
      price: 10,
      category: Category.ADVENTURE,
    };
    // await controller.create(bookDto);
    expect(controller.create).toHaveBeenCalledWith(bookDto);
    expect(service.create).toHaveBeenCalledWith(bookDto);
  });

  // it('should get all books', async () => {
  //   const result = [];
  //   service.findAll.mockResolvedValue(result);
  //   expect(await controller.findAll()).toBe(result);
  // });

  // it('should get one book', async () => {
  //   const result = { id: 1, title: 'Test Book', author: 'Test Author' };
  //   service.findOne.mockResolvedValue(result);
  //   expect(await controller.findOne('1')).toBe(result);
  // });

  // it('should update a book', async () => {
  //   const bookDto = { title: 'Updated Book', author: 'Updated Author' };
  //   service.update.mockResolvedValue(bookDto);
  //   expect(await controller.update('1', bookDto)).toBe(bookDto);
  // });

  // it('should delete a book', async () => {
  //   service.remove.mockResolvedValue({ deleted: true });
  //   expect(await controller.remove('1')).toEqual({ deleted: true });
  // });
});
