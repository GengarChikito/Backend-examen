import { IsEmail, IsString, MinLength, IsDateString, Validate } from 'class-validator';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

// Validador personalizado para mayores de 18 años
@ValidatorConstraint({ name: 'IsAdult', async: false })
export class IsAdultConstraint implements ValidatorConstraintInterface {
  validate(birthDate: string, args: ValidationArguments) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 18;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Debes ser mayor de 18 años para registrarte.';
  }
}

export class CreateUserDto {
  @IsEmail({}, { message: 'El correo debe ser válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsDateString()
  @Validate(IsAdultConstraint) // Aplica la validación de edad
  birthDate: string;

  // Opcional: Código de referido
  @IsString()
  referralCode?: string;
}