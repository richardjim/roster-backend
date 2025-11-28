import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ShiftAssignment } from '../../shift-assignments/entities/shift-assignment.entity';
import { Unavailability } from '../../unavailabilities/entities/unavailability.entity';

@ObjectType()
@Entity('shifts')
export class Shift {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'date' })
  date: string;

  @Field()
  @Column({ type: 'time' })
  startTime: string;

  @Field()
  @Column({ type: 'time' })
  endTime: string;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(() => Int)
  @Column({ default: 1 })
  maxAssignments: number;

  @Field()
  @Column({ default: false })
  isRecurring: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [ShiftAssignment], { nullable: true })
  @OneToMany(() => ShiftAssignment, (assignment) => assignment.shift)
  assignments: ShiftAssignment[];

  @Field(() => [Unavailability], { nullable: true })
  @OneToMany(() => Unavailability, (unavailability) => unavailability.shift)
  unavailabilities: Unavailability[];

  @Field(() => Int)
  assignmentCount?: number;

  @Field()
  isOpen?: boolean;
}
