import { Field, InputType, Int } from '@nestjs/graphql';
import { Min, Max } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 0 })
  @Min(0)
  skip?: number;

  @Field(() => Int, { defaultValue: 20 })
  @Min(1)
  @Max(100)
  take?: number;
}
