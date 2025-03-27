import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Patient {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    age: number;

    @Prop({ required: true })
    sex: string;

    @Prop({ required: true })
    maritalStatus: string;

    @Prop({ required: true })
    state: string;

    @Prop({ required: true })
    lga: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    contact: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);