import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { RagQuery } from './rag-query.entity';

@Entity('rag_query_results')
@Index(['query_id'])
@Index(['processing_time'])
export class RagQueryResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  query_id: string;

  @Column({ type: 'longtext' })
  answer: string;

  @Column({ type: 'json', nullable: true })
  context_documents: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  analysis_result: string;

  @Column({ type: 'int', nullable: true })
  processing_time: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => RagQuery, (query) => query.results, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'query_id' })
  query: RagQuery;
}
