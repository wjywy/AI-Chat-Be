// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersService } from './users.service';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { User } from './entities/user.entity';

describe('UsersService', () => {
  // let service: UsersService;
  // // 创建模拟的用户仓库
  // const mockUserRepository = {
  //   find: jest.fn(),
  //   findOne: jest.fn(),
  //   save: jest.fn(),
  //   create: jest.fn(),
  //   // 根据需要添加其他方法
  // };
  // // 创建模拟的 RedisService
  // const mockRedisService = {
  //   get: jest.fn(),
  //   set: jest.fn(),
  //   del: jest.fn(),
  //   // 根据需要添加其他方法
  // };
  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [
  //       UsersService,
  //       {
  //         provide: getRepositoryToken(User),
  //         useValue: mockUserRepository,
  //       },
  //       {
  //         provide: 'RedisService', // 提供 RedisService
  //         useValue: mockRedisService,
  //       },
  //     ],
  //   }).compile();
  //   service = module.get<UsersService>(UsersService);
  // });
  it('should be defined', () => {
    // expect(service).toBeDefined();
  });
});
