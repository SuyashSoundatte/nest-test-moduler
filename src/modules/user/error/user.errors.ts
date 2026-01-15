import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../../common/exceptions/base.exception';
import { ErrorCategory, ErrorSeverity } from '../../../common/exceptions/error.types';

export class UserNotFoundException extends BaseException {
  constructor(userId: number) {
    super(
      'USER_NOT_FOUND',
      'User not found',
      `User with id ${userId} does not exist`,
      HttpStatus.NOT_FOUND,
      ErrorSeverity.LOW,
      ErrorCategory.BUSINESS_LOGIC,
      { userId },
    );
  }
}

export class UserCreateFailedException extends BaseException {
  constructor(reason?: string) {
    super(
      'USER_CREATE_FAILED',
      'Unable to create user',
      reason ?? 'Database insert failed',
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorSeverity.HIGH,
      ErrorCategory.VALIDATION,
    );
  }
}
