import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor(private configService: ConfigService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    this.transporter = createTransport({
      host: this.configService.get<string>('nodemailer_host'),
      port: this.configService.get<number>('nodemailer_port'),
      secure: false,
      auth: {
        user: this.configService.get<string>('nodemailer_auth_user'),
        pass: this.configService.get<string>('nodemailer_auth_pass'),
      },
    });
  }

  async sendEmail({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    if (!this.transporter) {
      throw new Error('邮件服务未初始化');
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await this.transporter.sendMail({
        from: {
          name: 'AI对话平台',
          address: '2934610933@qq.com',
        },
        to,
        subject,
        html,
      });
    } catch (error) {
      console.log(error);
      throw new Error('发送邮件失败');
    }
  }
}
