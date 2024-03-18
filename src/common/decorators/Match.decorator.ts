import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

export function Match(property: string, validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'match',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: MatchConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    const [relatedPropertyName] = validationArguments.constraints;
    const relatedValue = (validationArguments.object as any)[
      relatedPropertyName
    ];
    return value === relatedValue;
  }
}
