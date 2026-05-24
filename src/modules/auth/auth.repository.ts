import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import type { SafeUser, User, UserRole } from '../../utils/types';

@Injectable()
export class AuthRepository {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {}

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query<User>(
      'SELECT id, name, email, password, role, created_at, updated_at FROM users WHERE email = $1',
      [email],
    );
    return result.rows[0] ?? null;
  }

  async emailExists(email: string): Promise<boolean> {
    const result = await this.pool.query<{ count: string }>(
      'SELECT COUNT(*) AS count FROM users WHERE email = $1',
      [email],
    );
    return Number(result.rows[0].count) > 0;
  }

  async create(
    name: string,
    email: string,
    hashedPassword: string,
    role: UserRole,
  ): Promise<SafeUser> {
    const result = await this.pool.query<SafeUser>(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at, updated_at`,
      [name, email, hashedPassword, role],
    );
    return result.rows[0];
  }
}
