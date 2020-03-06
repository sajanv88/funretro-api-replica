import { Module } from '@nestjs/common';
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { join } from 'path';
import { EmailService } from './email.service';
import * as config from 'config';

const emailConfig = config.get('email');
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: process.env.EMAIL_TRANSPORT || emailConfig.transport,
        template: {
          dir: join(__dirname, '../templates'),
          adapter: new HandlebarsAdapter(),
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
