// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
// } from 'typeorm';

export enum AgentType {
  POETRY = 'poetry',
  XIAOHONGSHU = 'xiaohongshu',
  WEATHER = 'weather',
  RAG = 'rag',
  MBTI = 'mbti',
}

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity('agents')
// export class Agent {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   name: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({
//     type: 'enum',
//     enum: AgentType,
//   })
//   type: AgentType;

//   @Column({ type: 'text' })
//   systemPrompt: string;

//   @Column({ type: 'json', nullable: true })
//   config: Record<string, any>;

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date
