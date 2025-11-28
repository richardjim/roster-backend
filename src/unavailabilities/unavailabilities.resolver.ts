import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UnavailabilitiesService } from './unavailabilities.service';
import { Unavailability } from './entities/unavailability.entity';
import { CreateUnavailabilityInput } from './dto/create-unavailability.input';
import { UpdateUnavailabilityInput } from './dto/update-unavailability.input';
import { UnavailabilityStatus } from '../common/enums/unavailability-status.enum';

@Resolver(() => Unavailability)
export class UnavailabilitiesResolver {
  constructor(
    private readonly unavailabilitiesService: UnavailabilitiesService,
  ) {}

  // ----------- MUTATIONS -----------------

  @Mutation(() => Unavailability)
  createUnavailability(
    @Args('createUnavailabilityInput')
    createUnavailabilityInput: CreateUnavailabilityInput,
  ) {
    return this.unavailabilitiesService.create(createUnavailabilityInput);
  }

  @Mutation(() => Unavailability)
  updateUnavailability(
    @Args('id') id: string,
    @Args('updateUnavailabilityInput')
    updateUnavailabilityInput: UpdateUnavailabilityInput,
  ) {
    return this.unavailabilitiesService.update(id, updateUnavailabilityInput);
  }

  @Mutation(() => Unavailability)
  updateUnavailabilityStatus(
    @Args('id') id: string,
    @Args('status', { type: () => UnavailabilityStatus })
    status: UnavailabilityStatus,
  ) {
    return this.unavailabilitiesService.updateStatus(id, status);
  }

  @Mutation(() => Boolean)
  removeUnavailability(@Args('id') id: string) {
    return this.unavailabilitiesService.remove(id);
  }

  // ----------- QUERIES -----------------

  @Query(() => [Unavailability], { name: 'unavailabilities' })
  findAll() {
    return this.unavailabilitiesService.findAll();
  }

  @Query(() => Unavailability, { name: 'unavailability' })
  findOne(@Args('id') id: string) {
    return this.unavailabilitiesService.findOne(id);
  }

  @Query(() => [Unavailability], { name: 'unavailabilitiesByUser' })
  findByUser(@Args('userId') userId: string) {
    return this.unavailabilitiesService.findByUser(userId);
  }

  @Query(() => [Unavailability], { name: 'unavailabilitiesByShift' })
  findByShift(@Args('shiftId') shiftId: string) {
    return this.unavailabilitiesService.findByShift(shiftId);
  }
}
