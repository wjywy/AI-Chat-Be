import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chat } from './chat.entity';

export enum MessageRole {
  USER = 'user',
  SYSTEM = 'system',
  ASSISTANT = 'assistant',
}

export interface FileContent {
  fileId: string;
  fileName: string;
  fileSize?: number;
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: MessageRole,
    default: MessageRole.USER,
  })
  role: MessageRole;

  @Column({
    type: 'text',
  })
  content: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  imgUrl: string[];

  @Column({
    type: 'json',
    nullable: true,
  })
  fileContent: FileContent[];

  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chatId' })
  chat: Chat;

  @Column({
    length: 256,
  })
  chatId: string;

  @CreateDateColumn()
  createdAt: Date;
}
