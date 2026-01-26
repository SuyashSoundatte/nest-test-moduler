import { HttpStatus } from "@nestjs/common";
import { BaseException } from "../../../common/exceptions/base.exception";
import { ErrorCategory, ErrorSeverity } from "../../../common/exceptions/error.types";

export class InvalidCredentialsException extends BaseException<string>{
  constructor(data?: string){
    super(
      "AUTH_INVALID_CREDENTIALS", 
      "Invalid Data",
      "Authentication failed: bad credentials",
      HttpStatus.UNAUTHORIZED,
      ErrorSeverity.MEDIUM,
      ErrorCategory.AUTHENTICATION,
      data
    )
  }
}