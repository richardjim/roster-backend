import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { ShiftsService } from './shifts/shifts.service';
import { ShiftAssignmentsService } from './shift-assignments/shift-assignments.service';
import { UserRole } from './common/enums/user-role.enum';
import { Shift } from './shifts/entities/shift.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const shiftsService = app.get(ShiftsService);
  const assignmentsService = app.get(ShiftAssignmentsService);

  console.log(' Seeding database...');

  // Create admin user
  const admin = await usersService.create({
    email: 'admin-main@roster.com',
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
  });
  console.log(' Created admin user');

  // Create regular users
  const users = await Promise.all([
    usersService.create({
      email: 'john.test@roster.com',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.USER,
    }),
    usersService.create({
      email: 'jane.test@roster.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: UserRole.USER,
    }),
    usersService.create({
      email: 'bob.johnson-test@roster.com',
      firstName: 'Bob',
      lastName: 'Johnson',
      role: UserRole.USER,
    }),
    usersService.create({
      email: 'alice.williams-test@roster.com',
      firstName: 'Alice',
      lastName: 'Williams',
      role: UserRole.USER,
    }),
  ]);
  console.log('Created 4 regular users');

  // Create shifts for the next 7 days
  const today = new Date();
  const shifts: Shift[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0]; // convert to string

      // Morning shift
      const morningShift = await shiftsService.create({
        date: dateStr,
        startTime: '08:00',
        endTime: '16:00',
        title: 'Morning Shift',
        description: 'Standard morning shift coverage',
        maxAssignments: 2,
      });
      shifts.push(morningShift);

      // Evening shift
      const eveningShift = await shiftsService.create({
        date: dateStr,
        startTime: '16:00',
        endTime: '23:59',
        title: 'Evening Shift',
        description: 'Evening coverage shift',
        maxAssignments: 2,
      });
      shifts.push(eveningShift);

      // Night shift (next day)
      const nightShiftDate = new Date(date);
      nightShiftDate.setDate(date.getDate() + 1);
      const nightShiftStr = nightShiftDate.toISOString().split('T')[0];

      const nightShift = await shiftsService.create({
        date: nightShiftStr,
        startTime: '00:00',
        endTime: '08:00',
        title: 'Night Shift',
        description: 'Overnight coverage shift',
        maxAssignments: 1,
      });
      shifts.push(nightShift);
    }
  }
  console.log('Created 21 shifts (3 per day for 7 days)');

  // Assign users to some shifts
  await assignmentsService.create({
    userId: users[0].id,
    shiftId: shifts[0].id,
    assignedBy: admin.id,
  });

  await assignmentsService.create({
    userId: users[1].id,
    shiftId: shifts[0].id,
    assignedBy: admin.id,
  });

  await assignmentsService.create({
    userId: users[2].id,
    shiftId: shifts[1].id,
    assignedBy: admin.id,
  });

  await assignmentsService.create({
    userId: users[0].id,
    shiftId: shifts[3].id,
    assignedBy: admin.id,
  });

  await assignmentsService.create({
    userId: users[3].id,
    shiftId: shifts[4].id,
    assignedBy: admin.id,
  });

  console.log('Created 5 shift assignments');

  console.log('Seeding completed successfully!\n');
  console.log('Admin credentials:');
  console.log('   Email: admin@roster.com\n');
  console.log('Test users:');
  users.forEach((user) => {
    console.log(`   ${user.firstName} ${user.lastName}: ${user.email}`);
  });

  await app.close();
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
