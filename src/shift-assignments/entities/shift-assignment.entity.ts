import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Shift } from '../../shifts/entities/shift.entity';
import { AssignmentStatus } from '../../common/enums/assignment-status.enum';

@ObjectType()
@Entity('shift_assignments')
@Index(['userId', 'shiftId', 'status'])
export class ShiftAssignment {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('uuid')
  userId: string;

  @Field()
  @Column('uuid')
  shiftId: string;

  @Field(() => AssignmentStatus)
  @Column({
    type: 'enum',
    enum: AssignmentStatus,
    default: AssignmentStatus.ASSIGNED,
  })
  status: AssignmentStatus;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assignedAt: Date;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  assignedBy?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.assignments, { eager: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Field(() => Shift)
  @ManyToOne(() => Shift, (shift) => shift.assignments, { eager: true })
  @JoinColumn({ name: 'shiftId' })
  shift: Shift;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignedBy' })
  assignor?: User;
}
