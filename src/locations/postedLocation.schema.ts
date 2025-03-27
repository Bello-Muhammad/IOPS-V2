import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "src/users/users.schema";

@Schema()
export class PostedLocation {
    @Prop()
    lga: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], required: false })
    staffs?: User[];

}

export const PostedLocationSchema = SchemaFactory.createForClass(PostedLocation);