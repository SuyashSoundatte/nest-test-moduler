export interface DatabaseConfig {
  url: string;
}

export interface InfrastructureConfig {
  database: DatabaseConfig;
}
