import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';

@InputType()
export class RepeatShiftInput {
  @Field()
  @IsNotEmpty()
  shiftId: string;

  @Field(() => [Date])
  @IsArray()
  @ArrayMinSize(1)
  dates: Date[];
}
