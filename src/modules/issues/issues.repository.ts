import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import type {
  Issue,
  IssueFilters,
  IssueType,
  SafeUser,
} from '../../utils/types';

@Injectable()
export class IssuesRepository {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {}

  async create(
    title: string,
    description: string,
    type: IssueType,
    reporterId: number,
  ): Promise<Issue> {
    const result = await this.pool.query<Issue>(
      `INSERT INTO issues (title, description, type, reporter_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, description, type, status, reporter_id, created_at, updated_at`,
      [title, description, type, reporterId],
    );
    return result.rows[0];
  }

  async findAll(filters: IssueFilters): Promise<Issue[]> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (filters.type) {
      conditions.push(`type = $${idx++}`);
      params.push(filters.type);
    }
    if (filters.status) {
      conditions.push(`status = $${idx++}`);
      params.push(filters.status);
    }

    const where =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const order = filters.sort === 'oldest' ? 'ASC' : 'DESC';

    const result = await this.pool.query<Issue>(
      `SELECT id, title, description, type, status, reporter_id, created_at, updated_at
       FROM issues
       ${where}
       ORDER BY created_at ${order}`,
      params,
    );
    return result.rows;
  }

  async findById(id: number): Promise<Issue | null> {
    const result = await this.pool.query<Issue>(
      `SELECT id, title, description, type, status, reporter_id, created_at, updated_at
       FROM issues WHERE id = $1`,
      [id],
    );
    return result.rows[0] ?? null;
  }

  async update(
    id: number,
    fields: Partial<{ title: string; description: string; type: IssueType }>,
  ): Promise<Issue> {
    const keys = Object.keys(fields) as (keyof typeof fields)[];
    const setClauses = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const values = keys.map((k) => fields[k]);

    const result = await this.pool.query<Issue>(
      `UPDATE issues
       SET ${setClauses}, updated_at = NOW()
       WHERE id = $${keys.length + 1}
       RETURNING id, title, description, type, status, reporter_id, created_at, updated_at`,
      [...values, id],
    );
    return result.rows[0];
  }

  async delete(id: number): Promise<void> {
    await this.pool.query('DELETE FROM issues WHERE id = $1', [id]);
  }

  async findReportersByIds(
    ids: number[],
  ): Promise<Pick<SafeUser, 'id' | 'name' | 'role'>[]> {
    if (ids.length === 0) return [];
    const result = await this.pool.query<
      Pick<SafeUser, 'id' | 'name' | 'role'>
    >('SELECT id, name, role FROM users WHERE id = ANY($1)', [ids]);
    return result.rows;
  }
}
