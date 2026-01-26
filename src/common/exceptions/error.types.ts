export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum ErrorCategory {
  VALIDATION = 'VALIDATION',
  DATABASE = 'DATABASE',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
}

export interface ErrorMetadata<T = unknown> {
  timestamp: Date;
  errorId: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  additionalData?: T;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    errorId: string;
    timestamp: Date | string;
  };
}