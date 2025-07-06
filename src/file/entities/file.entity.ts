import { Chat } from 'src/chat/entities/chat.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Column } from 'typeorm';

@Entity()
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 256,
  })
  fileId: string;

  @Column({ nullable: true })
  filePath: string;

  @Column({ default: 0 })
  totalChunks: number;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ default: false })
  isCanceled: boolean;

  @Column({
    length: 256,
    nullable: true,
  })
  chatId: string;

  @ManyToOne(() => Chat, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chatId' })
  chat: Chat;

  @Column({
    default: 0,
  })
  uploadedChunks: number;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
