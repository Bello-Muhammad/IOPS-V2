import { HttpException, Injectable } from "@nestjs/common";
import mongoose from "mongoose";

@Injectable()
export class DataValidator {
    constructor () {}

    validateId(id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);

        if (!isValid) throw new HttpException('User not found', 404);

        return;
    }
}