import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ShiftAssignmentsService } from './shift-assignments.service';
import { ShiftAssignment } from './entities/shift-assignment.entity';
import { CreateAssignmentInput } from './dto/create-assignment.input';
import { AssignmentStatus } from '../common/enums/assignment-status.enum';

@Resolver(() => ShiftAssignment)
export class ShiftAssignmentsResolver {
  constructor(
    private readonly shiftAssignmentsService: ShiftAssignmentsService,
  ) {}

  // ============================
  //         MUTATIONS
  // ============================

  @Mutation(() => ShiftAssignment)
  createShiftAssignment(@Args('data') data: CreateAssignmentInput) {
    return this.shiftAssignmentsService.create(data);
  }

  @Mutation(() => ShiftAssignment)
  updateAssignmentStatus(
    @Args('id') id: string,
    @Args('status', { type: () => AssignmentStatus })
    status: AssignmentStatus,
  ) {
    return this.shiftAssignmentsService.updateStatus(id, status);
  }

  @Mutation(() => Boolean)
  removeShiftAssignment(@Args('id') id: string) {
    return this.shiftAssignmentsService.remove(id);
  }

  // ============================
  //          QUERIES
  // ============================

  @Query(() => [ShiftAssignment], { name: 'shiftAssignments' })
  findAll() {
    return this.shiftAssignmentsService.findAll();
  }

  @Query(() => ShiftAssignment, {
    name: 'shiftAssignment',
    nullable: true,
  })
  findOne(@Args('id') id: string) {
    return this.shiftAssignmentsService.findOne(id);
  }

  @Query(() => [ShiftAssignment], { name: 'shiftAssignmentsByUser' })
  findByUser(
    @Args('userId') userId: string,
    @Args('startDate', { nullable: true }) startDate?: Date,
    @Args('endDate', { nullable: true }) endDate?: Date,
  ) {
    return this.shiftAssignmentsService.findByUser(userId, startDate, endDate);
  }

  @Query(() => [ShiftAssignment], { name: 'shiftAssignmentsByShift' })
  findByShift(@Args('shiftId') shiftId: string) {
    return this.shiftAssignmentsService.findByShift(shiftId);
  }
}
