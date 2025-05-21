import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 256,
    comment: '账号/用户名',
  })
  userName: string;

  @Column({
    length: 256,
    comment: '密码',
  })
  password: string;

  @Column({
    length: 256,
    comment: '昵称',
  })
  nickName: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
