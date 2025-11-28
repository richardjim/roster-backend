import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class FilterShiftInput {
  @Field({ nullable: true })
  startDate?: string;

  @Field({ nullable: true })
  endDate?: string;

  @Field({ nullable: true })
  isOpen?: boolean;

  @Field({ nullable: true })
  userId?: string;
}
