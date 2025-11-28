# Mini Roster System - Backend

A comprehensive shift scheduling system built with NestJS, GraphQL, TypeORM, and PostgreSQL.

## Features

- ✅ GraphQL API (code-first approach)
- ✅ User management with role-based access
- ✅ Shift creation and management
- ✅ Shift assignments with validation
- ✅ Open shifts tracking
- ✅ Shift repetition for multiple days
- ✅ Unavailability marking
- ✅ Overlap detection
- ✅ Comprehensive validation

## Tech Stack

- **Framework**: NestJS
- **API**: GraphQL (Apollo Server)
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Validation**: class-validator, class-transformer

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/richardjim/roster-backend.git
cd roster-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a PostgreSQL database:
```bash
createdb roster_db
```

4. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. Run the application:
```bash
npm run start:dev
```

6. Seed the database with sample data:
```bash
npm run seed
```

## GraphQL Playground

Once the server is running, access the GraphQL Playground at:
## Sample Queries & Mutations

### Create a User
```graphql
mutation {
  createUser(createUserInput: {
    email: "test@example.com"
    firstName: "Test"
    lastName: "User"
    role: USER
  }) {
    id
    email
    firstName
    lastName
    role
  }
}
```

### Create a Shift
```graphql
mutation {
  createShift(createShiftInput: {
    date: "2025-12-01"
    startTime: "09:00"
    endTime: "17:00"
    title: "Day Shift"
    description: "Regular day shift"
    maxAssignments: 2
  }) {
    id
    title
    date
    startTime
    endTime
  }
}
```

### Assign User to Shift
```graphql
mutation {
  assignUserToShift(createAssignmentInput: {
    userId: "user-id-here"
    shiftId: "shift-id-here"
    assignedBy: "admin-id-here"
  }) {
    id
    status
    user {
      firstName
      lastName
    }
    shift {
      title
      date
    }
  }
}
```

### Get Open Shifts
```graphql
query {
  openShifts {
    id
    title
    date
    startTime
    endTime
    maxAssignments
    assignmentCount
    isOpen
  }
}
```

### Get User's Assignments
```graphql
query {
  userAssignments(userId: "user-id-here") {
    id
    shift {
      title
      date
      startTime
      endTime
    }
    status
    assignedAt
  }
}
```

### Repeat a Shift
```graphql
mutation {
  repeatShift(repeatShiftInput: {
    shiftId: "shift-id-here"
    dates: ["2025-12-02", "2025-12-03", "2025-12-04"]
  }) {
    id
    title
    date
    isRecurring
  }
}
```

### Mark Unavailable
```graphql
mutation {
  markUnavailable(createUnavailabilityInput: {
    userId: "user-id-here"
    shiftId: "shift-id-here"
    reason: "Personal appointment"
  }) {
    id
    reason
    status
    shift {
      title
      date
    }
  }
}
```

### Filter Shifts by Date Range
```graphql
query {
  shifts(filter: {
    startDate: "2025-12-01"
    endDate: "2025-12-07"
  }) {
    id
    title
    date
    startTime
    endTime
    isOpen
    assignmentCount
  }
}
```

## Deployment to Render

1. Create a new Web Service on Render.com
2. Connect your GitHub repository
3. Configure the service:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
4. Add environment variables:
   - `DATABASE_URL` (from Render PostgreSQL)
   - `NODE_ENV=production`
   - `FRONTEND_URL` https://roster-frontend.vercel.app/
5. Deploy!

## Database Schema

See the schema diagram in the project documentation for detailed entity relationships.

## Validation Rules

- Email must be unique
- Shift times must be valid (start before end)
- No overlapping shifts for the same user
- Maximum assignments per shift enforced
- User cannot be assigned to already unavailable shift

## Error Handling

The API returns structured errors with appropriate HTTP status codes:
- `400 Bad Request`: Validation errors
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server errors

## License

MIT
