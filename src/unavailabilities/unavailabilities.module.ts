import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnavailabilitiesService } from './unavailabilities.service';
import { UnavailabilitiesResolver } from './unavailabilities.resolver';
import { Unavailability } from './entities/unavailability.entity';
import { ShiftAssignment } from '../shift-assignments/entities/shift-assignment.entity';
import { UsersModule } from '../users/users.module';
import { ShiftsModule } from '../shifts/shifts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Unavailability, ShiftAssignment]),
    forwardRef(() => UsersModule),
    forwardRef(() => ShiftsModule),
  ],
  controllers: [],
  providers: [UnavailabilitiesService, UnavailabilitiesResolver],
  exports: [UnavailabilitiesService],
})
export class UnavailabilitiesModule {}
