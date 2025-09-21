import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { RagQueryResult } from './rag-query-result.entity';

@Entity('rag_queries')
@Index(['user_id'])
@Index(['created_at'])
export class RagQuery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  user_id: string;

  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'text', nullable: true })
  analyzed_query: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  model: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => RagQueryResult, (result) => result.query, { cascade: true })
  results: RagQueryResult[];
}
