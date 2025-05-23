import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Message } from './message.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 256,
    nullable: true,
    default: '新对话',
  })
  title: string;

  @Column({
    default: true,
  })
  isActive: boolean;

  @Column()
  userId: number;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
