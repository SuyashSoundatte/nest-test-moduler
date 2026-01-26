import { HttpException, HttpStatus } from "@nestjs/common";
import { ErrorCategory, ErrorMetadata, ErrorResponse, ErrorSeverity } from "./error.types";

export abstract class BaseException<T = unknown > extends HttpException {
  public readonly errorCode: string;
  public readonly metadata: ErrorMetadata<T>;

  constructor(
    errorCode: string,
    userMessage: string,
    technicalMessage: string,
    statusCode: HttpStatus,
    severity: ErrorSeverity,
    category: ErrorCategory,
    additionalData?: T,
  ) {
    super(userMessage, statusCode);
    
    this.errorCode = errorCode;
    this.metadata = {
      timestamp: new Date(),
      errorId: "abc-123",
      severity,
      category,
      additionalData,
    };
  }

  public getResponse(): ErrorResponse {
    return {
      success: false,
      error: {
        code: this.errorCode,
        message: this.message,
        errorId: this.metadata.errorId,
        timestamp: this.metadata.timestamp,
      },
    };
  }
}