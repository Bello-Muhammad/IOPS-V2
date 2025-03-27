import { IsNotEmpty, IsString } from "class-validator";

export class TransferStaffDto {
    @IsNotEmpty()
    @IsString()
    currentLGAId: string;

    @IsNotEmpty()
    @IsString()
    newLGAId: string

    @IsNotEmpty()
    @IsString()
    staffId: string    
}