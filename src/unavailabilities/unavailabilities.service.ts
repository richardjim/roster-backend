import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unavailability } from './entities/unavailability.entity';
import { CreateUnavailabilityInput } from './dto/create-unavailability.input';
import { UpdateUnavailabilityInput } from './dto/update-unavailability.input';
import { UnavailabilityStatus } from '../common/enums/unavailability-status.enum';
import { ShiftAssignment } from '../shift-assignments/entities/shift-assignment.entity';
import { AssignmentStatus } from '../common/enums/assignment-status.enum';

@Injectable()
export class UnavailabilitiesService {
  constructor(
    @InjectRepository(Unavailability)
    private unavailabilitiesRepository: Repository<Unavailability>,
    @InjectRepository(ShiftAssignment)
    private assignmentsRepository: Repository<ShiftAssignment>,
  ) {}

  async create(
    createUnavailabilityInput: CreateUnavailabilityInput,
  ): Promise<Unavailability> {
    // Check if user is already assigned to this shift
    const existingAssignment = await this.assignmentsRepository.findOne({
      where: {
        userId: createUnavailabilityInput.userId,
        shiftId: createUnavailabilityInput.shiftId,
        status: AssignmentStatus.ASSIGNED,
      },
    });

    if (existingAssignment) {
      throw new BadRequestException(
        'User is already assigned to this shift. Please remove assignment first.',
      );
    }

    // Check if unavailability already exists
    const existingUnavailability =
      await this.unavailabilitiesRepository.findOne({
        where: {
          userId: createUnavailabilityInput.userId,
          shiftId: createUnavailabilityInput.shiftId,
        },
      });

    if (existingUnavailability) {
      throw new BadRequestException(
        'Unavailability already exists for this shift',
      );
    }

    const unavailability = this.unavailabilitiesRepository.create(
      createUnavailabilityInput,
    );
    return this.unavailabilitiesRepository.save(unavailability);
  }

  async findAll(): Promise<Unavailability[]> {
    return this.unavailabilitiesRepository.find({
      relations: ['user', 'shift'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<Unavailability[]> {
    return this.unavailabilitiesRepository.find({
      where: { userId },
      relations: ['shift'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByShift(shiftId: string): Promise<Unavailability[]> {
    return this.unavailabilitiesRepository.find({
      where: { shiftId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Unavailability> {
    const unavailability = await this.unavailabilitiesRepository.findOne({
      where: { id },
      relations: ['user', 'shift'],
    });

    if (!unavailability) {
      throw new NotFoundException(`Unavailability with ID ${id} not found`);
    }
    return unavailability;
  }

  async update(
    id: string,
    updateUnavailabilityInput: UpdateUnavailabilityInput,
  ): Promise<Unavailability> {
    const unavailability = await this.findOne(id);
    Object.assign(unavailability, updateUnavailabilityInput);
    return this.unavailabilitiesRepository.save(unavailability);
  }

  async updateStatus(
    id: string,
    status: UnavailabilityStatus,
  ): Promise<Unavailability> {
    const unavailability = await this.findOne(id);
    unavailability.status = status;
    return this.unavailabilitiesRepository.save(unavailability);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.unavailabilitiesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Unavailability with ID ${id} not found`);
    }
    return true;
  }
}
