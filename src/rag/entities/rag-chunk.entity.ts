import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { RagDocument } from './rag-document.entity';

@Entity('rag_chunks')
@Index(['document_id'])
@Index(['section'])
export class RagChunk {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  document_id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'varchar', length: 50, nullable: true })
  section: string;

  @Column({ type: 'int' })
  chunk_index: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => RagDocument, (document) => document.chunks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'document_id' })
  document: RagDocument;
}
