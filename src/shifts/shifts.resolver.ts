import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ShiftsService } from './shifts.service';
import { Shift } from './entities/shift.entity';
import { CreateShiftInput } from './dto/create-shift.input';
import { UpdateShiftInput } from './dto/update-shift.input';
import { RepeatShiftInput } from './dto/repeat-shift.input';
import { FilterShiftInput } from './dto/filter-shift.input';

@Resolver(() => Shift)
export class ShiftsResolver {
  constructor(private readonly shiftsService: ShiftsService) {}

  // CREATE SHIFT
  @Mutation(() => Shift)
  createShift(
    @Args('createShiftInput') createShiftInput: CreateShiftInput,
  ): Promise<Shift> {
    return this.shiftsService.create(createShiftInput);
  }

  // GET ALL SHIFTS (with optional filtering)
  @Query(() => [Shift])
  shifts(
    @Args('filter', { type: () => FilterShiftInput, nullable: true })
    filter?: FilterShiftInput,
  ): Promise<Shift[]> {
    return this.shiftsService.findAll(filter);
  }

  // OPEN SHIFTS ONLY
  @Query(() => [Shift])
  openShifts(): Promise<Shift[]> {
    return this.shiftsService.findOpenShifts();
  }

  // GET ONE SHIFT
  @Query(() => Shift)
  shift(@Args('id') id: string): Promise<Shift> {
    return this.shiftsService.findOne(id);
  }

  // GET SHIFTS BY DATE RANGE
  @Query(() => [Shift])
  shiftsByDateRange(
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
  ): Promise<Shift[]> {
    return this.shiftsService.findByDateRange(startDate, endDate);
  }

  // UPDATE SHIFT
  @Mutation(() => Shift)
  updateShift(
    @Args('id') id: string,
    @Args('updateShiftInput') updateShiftInput: UpdateShiftInput,
  ): Promise<Shift> {
    return this.shiftsService.update(id, updateShiftInput);
  }

  // REPEAT SHIFT ACROSS MULTIPLE DATES
  @Mutation(() => [Shift])
  repeatShift(
    @Args('repeatShiftInput') repeatShiftInput: RepeatShiftInput,
  ): Promise<Shift[]> {
    return this.shiftsService.repeatShift(repeatShiftInput);
  }

  // DELETE SHIFT
  @Mutation(() => Boolean)
  removeShift(@Args('id') id: string): Promise<boolean> {
    return this.shiftsService.remove(id);
  }
}
