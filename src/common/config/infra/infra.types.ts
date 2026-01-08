export interface DatabaseConfig {
  host: string;
  port: number;
  name: string;
  poolSize: number;
}

export interface InfrastructureConfig {
  database: DatabaseConfig;
}
