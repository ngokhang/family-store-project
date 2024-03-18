import { SetMetadata } from '@nestjs/common';
import { REPONSE_MESSAGE } from '../constants';

export const ResponseMessage = (message: string) =>
  SetMetadata(REPONSE_MESSAGE, message);
