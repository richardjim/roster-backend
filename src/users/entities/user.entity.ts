import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserRole } from '../../common/enums/user-role.enum';
import { ShiftAssignment } from '../../shift-assignments/entities/shift-assignment.entity';
import { Unavailability } from '../../unavailabilities/entities/unavailability.entity';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field(() => UserRole)
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [ShiftAssignment], { nullable: true })
  @OneToMany(() => ShiftAssignment, (assignment) => assignment.user)
  assignments: ShiftAssignment[];

  @Field(() => [Unavailability], { nullable: true })
  @OneToMany(() => Unavailability, (unavailability) => unavailability.user)
  unavailabilities: Unavailability[];
}
