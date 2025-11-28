import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, MinLength } from 'class-validator';

@InputType()
export class CreateUnavailabilityInput {
  @Field()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  shiftId: string;

  @Field()
  @IsNotEmpty()
  @MinLength(5)
  reason: string;
}
