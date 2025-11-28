import { registerEnumType } from '@nestjs/graphql';

export enum UnavailabilityStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

registerEnumType(UnavailabilityStatus, {
  name: 'UnavailabilityStatus',
});
