import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import {
  AuthCredentialsSignupDto,
  AuthCredentialsSigninDto,
} from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private email: EmailService,
  ) {}

  async signUp(
    authCredentialsSignupDto: AuthCredentialsSignupDto,
  ): Promise<any> {
    const res = await this.userRepository.signUp(
      authCredentialsSignupDto,
      this.email,
    );
    return res;
  }

  async signIn(
    authCredentialsSigninDto: AuthCredentialsSigninDto,
  ): Promise<{ accessToken: string }> {
    const { email, fullName } = await this.userRepository.validateUserPassword(
      authCredentialsSigninDto,
    );

    if (!email) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { email, fullName };
    const accessToken = await this.jwtService.sign(payload);
    this.logger.debug(
      `Generated JWT Token with payload ${JSON.stringify(payload)}`,
    );

    return { accessToken };
  }
}
