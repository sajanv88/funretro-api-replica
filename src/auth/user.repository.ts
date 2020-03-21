import { Repository, EntityRepository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as uuid from 'uuid';
import { User } from './user.entity';
import {
  AuthCredentialsSignupDto,
  AuthCredentialsSigninDto,
} from './dto/auth-credentials.dto';
import { EmailService } from 'src/email/email.service';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(
    authCredentialsSignupDto: AuthCredentialsSignupDto,
    emailService: EmailService,
  ): Promise<any> {
    const { email, fullName, password } = authCredentialsSignupDto;
    const user = new User();
    user.email = email;
    user.fullName = fullName;
    user.salt = await bcrypt.genSalt();
    user.isVerfied = false;
    user.createdAt = new Date().toISOString();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
      // await emailService.sendWelcomeEmail(user);
    } catch (error) {
      console.log(error, 'err');
      if (error.code === '23505') {
        // duplicate email
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
    return { success: 'Account created!' };
  }

  async validateUserPassword(
    authCredentialsSigninDto: AuthCredentialsSigninDto,
  ): Promise<{ email: string; fullName: string }> {
    const { email, password } = authCredentialsSigninDto;
    const user = await this.findOne({ email });

    if (user && (await user.validatePassword(password))) {
      return { email: user.email, fullName: user.fullName };
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
