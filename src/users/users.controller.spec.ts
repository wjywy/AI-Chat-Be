// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersController } from './users.controller';
// import { UsersService } from './users.service';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { User } from './entities/user.entity';

describe('UsersController', () => {
  // let controller: UsersController;
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
  //     controllers: [UsersController],
  //     providers: [
  //       UsersService,
  //       {
  //         provide: getRepositoryToken(User),
  //         useValue: mockUserRepository,
  //       },
  //       {
  //         provide: 'redisService', // 修改为小写的 'redisService'，与 UsersService 中注入的名称保持一致
  //         useValue: mockRedisService,
  //       },
  //     ],
  //   }).compile();
  //   controller = module.get<UsersController>(UsersController);
  // });
  it('should be defined', () => {
    // expect(controller).toBeDefined();
  });
});
