import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class AtLeastOneLetterConstraint
  implements ValidatorConstraintInterface
{
  validate(password: string) {
    return /[a-zA-Z]/.test(password);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    if (!validationArguments) {
      return 'Property must contain at least one letter';
    }

    return `Property "${validationArguments.property}" must contain at least one letter`;
  }
}

export function AtLeastOneLetter(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: AtLeastOneLetterConstraint,
    });
  };
}
