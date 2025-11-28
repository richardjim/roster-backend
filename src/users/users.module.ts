import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User } from './entities/user.entity';
import { ShiftAssignmentsModule } from '../shift-assignments/shift-assignments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => ShiftAssignmentsModule),
  ],
  controllers: [],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
