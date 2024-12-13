import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class AtLeastOneSpecialConstraint
  implements ValidatorConstraintInterface
{
  validate(password: string) {
    return /[!@^&#,+()$~%'":*?<>{}]/.test(password);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    if (!validationArguments) {
      return 'Property must contain at least one special character';
    }

    return `Property "${validationArguments.property}" must contain at least one special character`;
  }
}

export function AtLeastOneSpecial(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: AtLeastOneSpecialConstraint,
    });
  };
}
