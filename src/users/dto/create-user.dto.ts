import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'please provide firstName' })
  @IsString({ message: 'first name must be string' })
  firstName: string;

  @IsNotEmpty({ message: 'please provide lastName' })
  @IsString({ message: 'last name must be string' })
  lastName: string;

  @IsNotEmpty({ message: 'please provide user role' })
  @IsString({ message: 'user role must be string' })
  role: string;

  @IsNotEmpty({ message: 'please provide email' })
  @IsString({ message: 'email must be string' })
  email: string;

  @IsNotEmpty({ message: 'please provide state' })
  @IsString({ message: 'state must be string' })
  state: string;

  @IsNotEmpty({ message: 'please provide local governmet' })
  @IsString({ message: 'local government must be string' })
  lga: string;

  @IsOptional()
  password?: string;
}
