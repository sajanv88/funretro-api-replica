import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { User } from 'src/auth/user.entity';

@Injectable()
export class EmailService {
  constructor(private readonly email: MailerService) {}

  async sendWelcomeEmail(user: User): Promise<any> {
    try {
      await this.email.sendMail({
        to: user.email,
        template: 'welcome',
        context: {
          name: user.fullName,
          url: `/auth/set_password?email=${user.email}&verify_code=${user.salt}`,
        },
      });
    } catch (error) {
      console.log(error, 'email error');
    }
    return {};
  }
}
