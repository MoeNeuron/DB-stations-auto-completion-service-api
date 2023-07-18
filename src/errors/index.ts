import { ErrorCodes } from "./ErrorCodes";
import { ErrorResponse } from "./ErrorResponse";

class CustomError extends Error {
  constructor(public errorCode: string, public errorMessage: string) {
    super(errorMessage);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorResponse(): ErrorResponse {
    return {
      error_code: this.errorCode,
      error_description: this.message,
    };
  }
}

class BadRequestError extends CustomError {
  constructor(errorCode: string, message: string) {
    super(errorCode, message);
  }
}

class InvalidCharacterError extends BadRequestError {
  constructor(message: string) {
    super(ErrorCodes.INVALID_CHARACTER, message);
  }
}

class ShortQueryError extends BadRequestError {
  constructor(message: string) {
    super(ErrorCodes.SHORT_QUERY, message);
  }
}

class LongQueryError extends BadRequestError {
  constructor(message: string) {
    super(ErrorCodes.LONG_QUERY, message);
  }
}

class EmptyQueryError extends BadRequestError {
  constructor(message: string) {
    super(ErrorCodes.EMPTY_QUERY, message);
  }
}

class MethodNotAllowedError extends CustomError {
  constructor(message = "Method Not Allowed") {
    super(ErrorCodes.METHOD_NOT_ALLOWED, message);
  }
}

class NotFoundError extends CustomError {
  constructor(message = "Not Found") {
    super(ErrorCodes.NOT_FOUND, message);
  }
}

class InternalError extends CustomError {
  constructor(message = "Internal Server Error.") {
    super(ErrorCodes.INTERNAL_ERROR, message);
  }
}

export {
  CustomError,
  BadRequestError,
  InvalidCharacterError,
  ShortQueryError,
  LongQueryError,
  EmptyQueryError,
  MethodNotAllowedError,
  NotFoundError,
  InternalError,
};
