import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, Min, Matches } from 'class-validator';

@InputType()
export class CreateShiftInput {
  @Field()
  @IsNotEmpty()
  date: string;

  @Field()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'startTime must be in HH:MM format',
  })
  startTime: string;

  @Field()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'endTime must be in HH:MM format',
  })
  endTime: string;

  @Field()
  @IsNotEmpty()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int, { defaultValue: 1 })
  @Min(1)
  maxAssignments?: number;
}
