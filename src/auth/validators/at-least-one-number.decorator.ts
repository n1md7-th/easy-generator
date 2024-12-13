import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class AtLeastOneNumberConstraint
  implements ValidatorConstraintInterface
{
  validate(password: string) {
    return /[0-9]/.test(password);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    if (!validationArguments) {
      return 'Property must contain at least one number';
    }

    return `Property "${validationArguments.property}" must contain at least one number`;
  }
}

export function AtLeastOneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: AtLeastOneNumberConstraint,
    });
  };
}
