import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ResponseAuthDto } from './dto/response-auth.dto';
import { ErrorResponseDto } from '../common/dto/common.dto';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, type: ResponseAuthDto })
  @ApiResponse({ status: 409, type: ErrorResponseDto })
  async signUp(@Body() authDto: AuthDto): Promise<ResponseAuthDto> {
    return this.authService.signUp(authDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in an existing user' })
  @ApiResponse({ status: 200, type: ResponseAuthDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  async signIn(@Body() authDto: AuthDto): Promise<ResponseAuthDto> {
    return this.authService.signIn(authDto);
  }
}
