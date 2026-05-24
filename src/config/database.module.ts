import { Global, Module } from '@nestjs/common';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

@Global()
@Module({
  providers: [{ provide: 'PG_POOL', useValue: pool }],
  exports: ['PG_POOL'],
})
export class DatabaseModule {}
