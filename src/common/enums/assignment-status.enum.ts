import { registerEnumType } from '@nestjs/graphql';

export enum AssignmentStatus {
  ASSIGNED = 'ASSIGNED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(AssignmentStatus, {
  name: 'AssignmentStatus',
});
