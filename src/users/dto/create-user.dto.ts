import { IsNotEmpty, Length, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Tên tài khoản không được để trống' })
  @MinLength(6, { message: 'Tên tài khoản phải có ít nhất 6 ký tự' })
  account: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @IsNotEmpty({ message: 'Họ không được để trống' })
  @MinLength(2, { message: 'Họ phải có ít nhất 2 ký tự' })
  firstName: string;

  @IsNotEmpty({ message: 'Tên không được để trống' })
  @MinLength(2, { message: 'Tên phải có ít nhất 2 ký tự' })
  lastName: string;

  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  @MinLength(5, { message: 'Địa chỉ phải có ít nhất 5 ký tự' })
  address: string;

  @Matches(/^0(3[2-9]|5[2689]|7[06789]|8[1-689]|9[0-9])[0-9]{7}$/, {
    message: 'Số điện thoại không hợp lệ',
  })
  @Length(10, 11, { message: 'Độ dài số điện thoại không phù hợp' })
  phoneNumber: string;
}
