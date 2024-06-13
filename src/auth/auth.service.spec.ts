import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserSchema } from '../user/schemas/user.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        ConfigModule.forRoot({
          envFilePath: '.env',
        }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: '1h' },
          }),
        }),
      ],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CRUD operations', () => {
    const authDto = {
      username: 'Test User',
      password: 'Test Password',
    };

    it('should create a user and return a bearer token', async () => {
      const user = await service.signUp(authDto);
      expect(user).toHaveProperty('access_token');
    });

    it('should throw a ConflictException when a user tries to sign up with a username that already exists', async () => {
      expect(service.signUp(authDto)).rejects.toThrow(ConflictException);
    });

    it('should authenticate a user and return a bearer token', async () => {
      const user = await service.signIn(authDto);
      expect(user).toHaveProperty('access_token');
    });

    it('should throw an UnauthorizedException when a user tries to sign in with an incorrect password', async () => {
      const incorrectAuthDto = {
        username: 'Incorrect User',
        password: 'Incorrect Password',
      };
      expect(service.signIn(incorrectAuthDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
