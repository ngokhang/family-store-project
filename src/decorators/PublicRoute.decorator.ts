import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from 'src/constants';

export const PublicRoute = () => SetMetadata(IS_PUBLIC_KEY, true);
