import { SetMetadata } from '@nestjs/common';
import { REPONSE_MESSAGE } from 'src/constants';

export const ResponseMessage = (message: string) =>
  SetMetadata(REPONSE_MESSAGE, message);
