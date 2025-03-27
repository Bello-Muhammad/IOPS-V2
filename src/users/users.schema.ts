import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { NextFunction } from "express";
import { hash } from "bcrypt"
import { Exclude } from "class-transformer";

@Schema()
export class User {

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ unique: true, trim: true, lowercase: true })
    email: string;

    @Prop({ required: true })
    role: string;

    @Prop({ required: true })
    state: string;

    @Prop({ required: true })
    lga: string;

    @Prop({ required: false, default: false })
    posted?: boolean;

    @Prop({ minlength: 8, trim: true})
    @Exclude()
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>('save', async function (next: NextFunction) {
    this.password = await hash(this.password, 10);

    next();
})

