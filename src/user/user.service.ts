import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
    private jwtService: JwtService,
  ) {}

  async signUp(
    createUserDto: CreateUserDto,
  ): Promise<{ access_token: string }> {
    const { username, password } = createUserDto;
    const existingUser = await this.userModel.findOne({ username });
    if (existingUser) {
      throw new ConflictException('Username already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ username, password: hashedPassword });
    await user.save();

    const payload = { sub: user._id, username: user.username };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }

  async signIn(
    createUserDto: CreateUserDto,
  ): Promise<{ access_token: string }> {
    const { username, password } = createUserDto;
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new UnauthorizedException();
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user._id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
