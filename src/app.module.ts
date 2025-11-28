import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

import { UsersModule } from './users/users.module';
import { ShiftsModule } from './shifts/shifts.module';
import { ShiftAssignmentsModule } from './shift-assignments/shift-assignments.module';
import { UnavailabilitiesModule } from './unavailabilities/unavailabilities.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const isProd = configService.get('NODE_ENV') === 'production';
        const databaseUrl = configService.get<string>('DATABASE_URL');

        const baseConfig: TypeOrmModuleOptions = {
          type: 'postgres',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: !isProd,
          logging: !isProd,
        };

        if (databaseUrl) {
          // Production (Render / Heroku)
          return {
            ...baseConfig,
            url: databaseUrl,
            ssl: { rejectUnauthorized: false },
          };
        }

        // Local development
        return {
          ...baseConfig,
          host: String(configService.get('DB_HOST', 'localhost')),
          port: Number(configService.get('DB_PORT', 5432)),
          username: String(configService.get('DB_USERNAME', 'postgres')),
          password: String(configService.get('DB_PASSWORD', 'postgres')),
          database: String(configService.get('DB_NAME', 'roster_db')),
          ssl: false,
        };
      },
    }),

    UsersModule,
    ShiftsModule,
    ShiftAssignmentsModule,
    UnavailabilitiesModule,
  ],
})
export class AppModule {}
