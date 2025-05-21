import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';

describe('EmailService', () => {
  let service: EmailService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      // 返回测试所需的配置值
      if (key === 'EMAIL_HOST') return 'test-host';
      if (key === 'EMAIL_PORT') return 587;
      if (key === 'EMAIL_USER') return 'test-user';
      if (key === 'EMAIL_PASS') return 'test-pass';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
