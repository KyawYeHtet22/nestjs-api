import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn(),
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should sign up a new user', async () => {
    const authDto: AuthDto = {
      username: 'test',
      password: 'test',
    };
    await controller.signUp(authDto);
    expect(service.signUp).toHaveBeenCalled();
  });

  it('should sign in an existing user', async () => {
    const authDto: AuthDto = {
      username: 'test',
      password: 'test',
    };
    await controller.signIn(authDto);
    expect(service.signIn).toHaveBeenCalled();
  });
});
