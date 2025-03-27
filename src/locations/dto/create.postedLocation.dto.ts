import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePostLocationDto {

    @IsNotEmpty({ message: 'local government can not be empty' })
    @IsString({ message: 'local government must be a string' })
    lga: string;

    @IsOptional()
    @IsString()
    staffId?: string;
}