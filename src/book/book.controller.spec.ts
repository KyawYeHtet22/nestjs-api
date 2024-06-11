import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { Category } from './schemas/book.schema';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateBookDto } from './dto/update-book.dto';

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
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn(),
      })
      .compile();

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
    await controller.create(bookDto);
    expect(service.create).toHaveBeenCalled();
  });

  it('should get all books', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should get one book', async () => {
    const id = '1';
    await controller.findOne(id);
    expect(service.findOne).toHaveBeenCalled();
  });

  it('should update a book', async () => {
    const id = '1';
    const bookDto: UpdateBookDto = {
      title: 'Updated Book',
      author: 'Updated Author',
      description: 'Updated Description',
      price: 20,
      category: Category.CLASSICS,
    };
    await controller.update(id, bookDto);
    expect(service.update).toHaveBeenCalled();
  });

  it('should delete a book', async () => {
    const id = '1';
    await controller.remove(id);
    expect(service.remove).toHaveBeenCalled();
  });
});

/*
await controller.create(bookDto);
  - call actual controller
  - call mock service (can define a return value for the mock function)
*/
