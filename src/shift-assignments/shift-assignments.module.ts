import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftAssignmentsService } from './shift-assignments.service';
import { ShiftAssignmentsResolver } from './shift-assignments.resolver';
import { ShiftAssignment } from './entities/shift-assignment.entity';
import { Shift } from '../shifts/entities/shift.entity';
import { UsersModule } from '../users/users.module';
import { ShiftsModule } from '../shifts/shifts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShiftAssignment, Shift]),
    forwardRef(() => UsersModule),
    forwardRef(() => ShiftsModule),
  ],
  controllers: [],
  providers: [ShiftAssignmentsService, ShiftAssignmentsResolver],
  exports: [ShiftAssignmentsService],
})
export class ShiftAssignmentsModule {}
