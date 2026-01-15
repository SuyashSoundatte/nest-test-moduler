import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolClient, QueryConfig, QueryResult, QueryResultRow } from 'pg';

@Injectable()
export class PostgresService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PostgresService.name);
  private readonly pool: Pool;

  constructor(private readonly config: ConfigService) {
    this.pool = new Pool({
      connectionString: this.config.get<string>('POSTGRES_URL'),
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000,
    });
  }

  async onModuleInit() {
    // write the retry logic at prod level
    try {
      const client = await this.pool.connect();
      await client.query('SELECT 1');
      client.release();

      this.logger.log('PostgreSQL Connected 🐘🐘🐘');
    } catch (err) {
      this.logger.error('PostgreSQL connection failed 🐍🐍🐍', err);
      throw err;
    }
  }

  /* ── SIMPLE QUERY ───────────────────────────── */
  async query<T extends QueryResultRow = QueryResultRow>(
    text: string | QueryConfig<any[]>,
    params?: any[],
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(text as any, params);
  }

  /* ── TRANSACTION WRAPPER ────────────────────── */
  async transact<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /* ── GRACEFUL SHUTDOWN ──────────────────────── */
  async onModuleDestroy() {
    if (this.pool) {
      this.logger.log('Closing PostgreSQL pool...');
      await this.pool.end();
    }
  }
}
