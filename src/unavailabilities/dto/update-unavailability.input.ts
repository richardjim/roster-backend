import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateUnavailabilityInput } from './create-unavailability.input';
import { UnavailabilityStatus } from '../../common/enums/unavailability-status.enum';

@InputType()
export class UpdateUnavailabilityInput extends PartialType(
  CreateUnavailabilityInput,
) {
  @Field()
  id: string;

  @Field(() => UnavailabilityStatus, { nullable: true })
  status?: UnavailabilityStatus;
}
