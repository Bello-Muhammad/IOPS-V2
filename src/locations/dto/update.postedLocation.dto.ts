import { IsOptional, IsString } from 'class-validator';

export class UpdatePostLocationDto {
    @IsOptional()
    @IsString()
    lga?: string;

    @IsOptional()
    @IsString()
    staffId?: string
}