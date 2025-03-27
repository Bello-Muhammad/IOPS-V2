import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Patient } from "./patients.schema";
import { FilterQuery, Model } from "mongoose";


@Injectable()
export class PatientRepository {
    constructor(@InjectModel(Patient.name) private patientModel: Model<Patient>) {}

    async findMany(patientFilterQuery: FilterQuery<Patient>): Promise<Patient[]> {
        return await this.patientModel.find(patientFilterQuery);
    };

    async findOne(patientFilterQuery: FilterQuery<Patient>): Promise<Patient> {
        return await this.patientModel.findOne(patientFilterQuery);
    }

    async create(patient: Patient): Promise<Patient> {
        const newPatient = new this.patientModel(patient);
        return await newPatient.save();
    }

    async findOneAndUpdate(
        patientFilterQuery: FilterQuery<Patient>, 
        patient: Partial<Patient>
    ): Promise<Patient> {
        return await this.patientModel.findOneAndUpdate(patientFilterQuery, patient, { new: true });
    }

    async findOneAndDelete(
        patientFilterQuery: FilterQuery<Patient>
    ): Promise<Patient> {
        return await this.patientModel.findOneAndDelete(patientFilterQuery);
    }
}