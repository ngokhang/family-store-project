import { HttpException, HttpStatus } from '@nestjs/common';

export class ExistedException extends HttpException {
  constructor(name: string) {
    super(`${name} đã tồn tại`, HttpStatus.BAD_REQUEST);
  }
}
