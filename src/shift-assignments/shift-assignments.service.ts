import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShiftAssignment } from './entities/shift-assignment.entity';
import { CreateAssignmentInput } from './dto/create-assignment.input';
import { AssignmentStatus } from '../common/enums/assignment-status.enum';
import { Shift } from '../shifts/entities/shift.entity';

@Injectable()
export class ShiftAssignmentsService {
  constructor(
    @InjectRepository(ShiftAssignment)
    private assignmentsRepository: Repository<ShiftAssignment>,
    @InjectRepository(Shift)
    private shiftsRepository: Repository<Shift>,
  ) {}

  async create(
    createAssignmentInput: CreateAssignmentInput,
  ): Promise<ShiftAssignment> {
    // Check for existing active assignment
    const existing = await this.assignmentsRepository.findOne({
      where: {
        userId: createAssignmentInput.userId,
        shiftId: createAssignmentInput.shiftId,
        status: AssignmentStatus.ASSIGNED,
      },
    });

    if (existing) {
      throw new BadRequestException('User already assigned to this shift');
    }

    // Check shift capacity
    const assignmentCount = await this.assignmentsRepository.count({
      where: {
        shiftId: createAssignmentInput.shiftId,
        status: AssignmentStatus.ASSIGNED,
      },
    });

    const shift = await this.shiftsRepository.findOne({
      where: { id: createAssignmentInput.shiftId },
    });

    if (!shift) {
      throw new NotFoundException('Shift not found');
    }

    if (assignmentCount >= shift.maxAssignments) {
      throw new BadRequestException('Shift is at maximum capacity');
    }

    // Check for overlapping shifts
    await this.checkOverlappingAssignments(
      createAssignmentInput.userId,
      createAssignmentInput.shiftId,
    );

    const assignment = this.assignmentsRepository.create(createAssignmentInput);
    return this.assignmentsRepository.save(assignment);
  }

  async findAll(): Promise<ShiftAssignment[]> {
    return this.assignmentsRepository.find({
      where: { status: AssignmentStatus.ASSIGNED },
      relations: ['user', 'shift'],
      order: { assignedAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<ShiftAssignment> {
    const assignment = await this.assignmentsRepository.findOne({
      where: { id },
      relations: ['user', 'shift', 'assignor'],
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return assignment;
  }

  async findByUser(
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<ShiftAssignment[]> {
    const query = this.assignmentsRepository
      .createQueryBuilder('assignment')
      .leftJoinAndSelect('assignment.shift', 'shift')
      .leftJoinAndSelect('assignment.user', 'user')
      .where('assignment.userId = :userId', { userId })
      .andWhere('assignment.status = :status', {
        status: AssignmentStatus.ASSIGNED,
      });

    if (startDate && endDate) {
      query.andWhere('shift.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    } else if (startDate) {
      query.andWhere('shift.date >= :startDate', { startDate });
    } else if (endDate) {
      query.andWhere('shift.date <= :endDate', { endDate });
    }

    return query
      .orderBy('shift.date', 'ASC')
      .addOrderBy('shift.startTime', 'ASC')
      .getMany();
  }

  async findByShift(shiftId: string): Promise<ShiftAssignment[]> {
    return this.assignmentsRepository.find({
      where: { shiftId, status: AssignmentStatus.ASSIGNED },
      relations: ['user'],
      order: { assignedAt: 'ASC' },
    });
  }

  async updateStatus(
    id: string,
    status: AssignmentStatus,
  ): Promise<ShiftAssignment> {
    const assignment = await this.findOne(id);
    assignment.status = status;
    return this.assignmentsRepository.save(assignment);
  }

  async remove(id: string): Promise<boolean> {
    const assignment = await this.assignmentsRepository.findOne({
      where: { id },
    });
    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    assignment.status = AssignmentStatus.CANCELLED;
    await this.assignmentsRepository.save(assignment);
    return true;
  }

  private async checkOverlappingAssignments(
    userId: string,
    shiftId: string,
  ): Promise<void> {
    const shift = await this.shiftsRepository.findOne({
      where: { id: shiftId },
    });

    if (!shift) return;

    const userAssignments = await this.assignmentsRepository
      .createQueryBuilder('assignment')
      .leftJoinAndSelect('assignment.shift', 'shift')
      .where('assignment.userId = :userId', { userId })
      .andWhere('assignment.status = :status', {
        status: AssignmentStatus.ASSIGNED,
      })
      .andWhere('shift.date = :date', { date: shift.date })
      .getMany();

    for (const assignment of userAssignments) {
      const existingShift = assignment.shift;
      if (this.shiftsOverlap(shift, existingShift)) {
        throw new BadRequestException(
          `User has overlapping shift: ${existingShift.title} (${existingShift.startTime} - ${existingShift.endTime})`,
        );
      }
    }
  }

  private shiftsOverlap(shift1: Shift, shift2: Shift): boolean {
    const start1 = this.timeToMinutes(shift1.startTime);
    const end1 = this.timeToMinutes(shift1.endTime);
    const start2 = this.timeToMinutes(shift2.startTime);
    const end2 = this.timeToMinutes(shift2.endTime);

    return start1 < end2 && start2 < end1;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
