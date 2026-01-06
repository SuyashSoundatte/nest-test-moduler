import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import pg, {
  Pool,
  PoolClient,
  QueryConfig,
  QueryResult,
  QueryResultRow,
} from 'pg';

@Injectable()
export class PostgresDataSource implements OnModuleDestroy {
  private readonly pool: Pool;
  private readonly logger = new Logger(PostgresDataSource.name);

  constructor(private readonly configService: ConfigService) {
    this.pool = new pg.Pool({
      connectionString: this.configService.get<string>('POSTGRES_URL'),
      max: 10,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000,
    });

    this.pool.on('connect', () => {
      this.logger.log('🔗 pg connect');
    });

    this.pool.on('error', (err: unknown) => {
      this.logger.error('🐛 pg unexpected error', err as any);
    });
  }

  /* ── QUERY HELPER ───────────────────────── */
  async query<T extends QueryResultRow = QueryResultRow>(
    text: string | QueryConfig<any[]>,
    params?: any[],
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(text as any, params);
  }

  /* ── TRANSACTION ────────────────────────── */
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

  /* ── GRACEFUL SHUTDOWN ──────────────────── */
  async onModuleDestroy() {
    await this.pool.end();
    this.logger.log('🛑 PostgreSQL pool closed');
  }
}
