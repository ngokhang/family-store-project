import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, Matches, MinLength } from 'class-validator';
import { Match } from 'src/decorators/Match.decorator';

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'password',
  'account',
] as const) {
  refresh_token: string;
}

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Mật khẩu hiện tại không được để trống' })
  @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/, {
    message: 'Mật khẩu hiện tại không hợp lệ',
  })
  @MinLength(6, { message: 'Mật khẩu hiện tại phải có ít nhất 6 ký tự' })
  currentPassword: string;

  @IsNotEmpty({ message: 'Mật khẩu hiện tại không được để trống' })
  @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/, {
    message: 'Mật khẩu hiện tại không hợp lệ',
  })
  @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
  newPassword: string;

  @Match('newPassword', {
    message: 'Mật khẩu xác nhận không trùng khớp với mật khẩu mới',
  })
  @MinLength(6, { message: 'Mật khẩu xác nhận phải có ít nhất 6 ký tự' })
  confirmationPassword: string;
}
