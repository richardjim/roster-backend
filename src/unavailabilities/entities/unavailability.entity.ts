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
import { UnavailabilityStatus } from '../../common/enums/unavailability-status.enum';

@ObjectType()
@Entity('unavailabilities')
@Index(['userId', 'shiftId', 'status'])
export class Unavailability {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('uuid')
  userId: string;

  @Field()
  @Column('uuid')
  shiftId: string;

  @Field()
  @Column()
  reason: string;

  @Field(() => UnavailabilityStatus)
  @Column({
    type: 'enum',
    enum: UnavailabilityStatus,
    default: UnavailabilityStatus.PENDING,
  })
  status: UnavailabilityStatus;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.unavailabilities, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field(() => Shift)
  @ManyToOne(() => Shift, (shift) => shift.unavailabilities, { eager: true })
  @JoinColumn({ name: 'shiftId' })
  shift: Shift;
}
