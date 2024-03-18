import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'CustomNumberValidator', async: false })
export class CustomNumberValidator implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const value = Number(text);
    if (isNaN(value) || value < 0) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'Text ($value) is too short or too long!';
  }
}
