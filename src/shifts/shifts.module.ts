import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftsService } from './shifts.service';
import { ShiftsResolver } from './shifts.resolver';
import { Shift } from './entities/shift.entity';
import { ShiftAssignmentsModule } from '../shift-assignments/shift-assignments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shift]),
    forwardRef(() => ShiftAssignmentsModule),
  ],
  controllers: [],
  providers: [ShiftsService, ShiftsResolver],
  exports: [ShiftsService],
})
export class ShiftsModule {}
