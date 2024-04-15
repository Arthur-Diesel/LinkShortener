export class ApiError extends Error {
  constructor(public status: number, message: string, name: string) {
    super(message);
    this.name = name;
  }
}

export class NotFoundException extends ApiError {
  constructor(message: string) {
    super(404, message, "NotFoundException");
  }
}

export class BadRequestException extends ApiError {
  constructor(message: string) {
    super(400, message, "BadRequestException");
  }
}

export class UnauthorizedException extends ApiError {
  constructor(message: string) {
    super(401, message, "UnauthorizedException");
  }
}