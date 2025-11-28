import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shift } from './entities/shift.entity';
import { CreateShiftInput } from './dto/create-shift.input';
import { UpdateShiftInput } from './dto/update-shift.input';
import { RepeatShiftInput } from './dto/repeat-shift.input';
import { FilterShiftInput } from './dto/filter-shift.input';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift)
    private shiftsRepository: Repository<Shift>,
  ) {}

  async create(createShiftInput: CreateShiftInput): Promise<Shift> {
    this.validateShiftTimes(
      createShiftInput.startTime,
      createShiftInput.endTime,
    );

    const shift = this.shiftsRepository.create(createShiftInput);
    return this.shiftsRepository.save(shift);
  }

  async findAll(filter?: FilterShiftInput): Promise<Shift[]> {
    const query = this.shiftsRepository
      .createQueryBuilder('shift')
      .leftJoinAndSelect(
        'shift.assignments',
        'assignment',
        'assignment.status = :status',
        { status: 'ASSIGNED' },
      )
      .loadRelationCountAndMap(
        'shift.assignmentCount',
        'shift.assignments',
        'assignmentCount',
        (qb) =>
          qb.where('assignmentCount.status = :status', { status: 'ASSIGNED' }),
      );

    if (filter?.startDate && filter?.endDate) {
      query.andWhere('shift.date BETWEEN :startDate AND :endDate', {
        startDate: filter.startDate,
        endDate: filter.endDate,
      });
    } else if (filter?.startDate) {
      query.andWhere('shift.date >= :startDate', {
        startDate: filter.startDate,
      });
    } else if (filter?.endDate) {
      query.andWhere('shift.date <= :endDate', { endDate: filter.endDate });
    }

    if (filter?.userId) {
      query.andWhere('assignment.userId = :userId', { userId: filter.userId });
    }

    const shifts = await query
      .orderBy('shift.date', 'ASC')
      .addOrderBy('shift.startTime', 'ASC')
      .getMany();

    return shifts.map((shift) => {
      const assignmentCount = shift.assignments?.length || 0;
      return {
        ...shift,
        assignmentCount,
        isOpen: assignmentCount < shift.maxAssignments,
      };
    });
  }

  async findOpenShifts(): Promise<Shift[]> {
    const shifts = await this.shiftsRepository
      .createQueryBuilder('shift')
      .leftJoinAndSelect(
        'shift.assignments',
        'assignment',
        'assignment.status = :status',
        { status: 'ASSIGNED' },
      )
      .loadRelationCountAndMap(
        'shift.assignmentCount',
        'shift.assignments',
        'assignmentCount',
        (qb) =>
          qb.where('assignmentCount.status = :status', { status: 'ASSIGNED' }),
      )
      .orderBy('shift.date', 'ASC')
      .addOrderBy('shift.startTime', 'ASC')
      .getMany();

    return shifts
      .filter(
        (shift) => (shift.assignments?.length || 0) < shift.maxAssignments,
      )
      .map((shift) => ({
        ...shift,
        assignmentCount: shift.assignments?.length || 0,
        isOpen: true,
      }));
  }

  async findOne(id: string): Promise<Shift> {
    const shift = await this.shiftsRepository.findOne({
      where: { id },
      relations: ['assignments', 'assignments.user', 'unavailabilities'],
    });

    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }

    const activeAssignments =
      shift.assignments?.filter((a) => a.status === 'ASSIGNED') || [];

    return {
      ...shift,
      assignments: activeAssignments,
      assignmentCount: activeAssignments.length,
      isOpen: activeAssignments.length < shift.maxAssignments,
    };
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Shift[]> {
    return this.findAll({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    });
  }

  async update(id: string, updateShiftInput: UpdateShiftInput): Promise<Shift> {
    const shift = await this.findOne(id);

    if (updateShiftInput.startTime && updateShiftInput.endTime) {
      this.validateShiftTimes(
        updateShiftInput.startTime,
        updateShiftInput.endTime,
      );
    }

    Object.assign(shift, updateShiftInput);
    return this.shiftsRepository.save(shift);
  }

  async repeatShift(repeatShiftInput: RepeatShiftInput): Promise<Shift[]> {
    const originalShift = await this.findOne(repeatShiftInput.shiftId);
    const newShifts: Shift[] = [];

    for (const date of repeatShiftInput.dates) {
      const shift = this.shiftsRepository.create({
        date: new Date().toISOString().split('T')[0],
        startTime: originalShift.startTime,
        endTime: originalShift.endTime,
        title: originalShift.title,
        description: originalShift.description,
        maxAssignments: originalShift.maxAssignments,
        isRecurring: true,
      });
      newShifts.push(await this.shiftsRepository.save(shift));
    }

    return newShifts;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.shiftsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }
    return true;
  }

  private validateShiftTimes(startTime: string, endTime: string): void {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    if (start >= end) {
      throw new BadRequestException('Start time must be before end time');
    }
  }
}
