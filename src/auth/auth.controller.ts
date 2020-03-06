import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import {
  AuthCredentialsSignupDto,
  AuthCredentialsSigninDto,
} from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialsSignupDto: AuthCredentialsSignupDto,
  ): Promise<any> {
    return this.authService.signUp(authCredentialsSignupDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialsSigninDto: AuthCredentialsSigninDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsSigninDto);
  }
}
