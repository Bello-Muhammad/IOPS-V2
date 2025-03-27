import { HttpException, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import mongoose, { FilterQuery, Model } from "mongoose";
import { PostedLocation } from "./postedLocation.schema";

@Injectable()
export class PostedLocationRepository {
    constructor(
      @InjectModel(PostedLocation.name) private postedLocationModel: Model<PostedLocation>,
      @InjectConnection() private readonly connection: mongoose.Connection
    ) {}

  async findOne(postedLocationFilterQuery: FilterQuery<PostedLocation>): Promise<PostedLocation> {
    return await this.postedLocationModel.findOne(postedLocationFilterQuery).populate('staffs');
  }

  find(): Promise<PostedLocation[]> {
    return this.postedLocationModel.find().populate('staffs');
  }

  async create(PostedLocation: PostedLocation): Promise<PostedLocation> {
    const newPostedLocation = new this.postedLocationModel(PostedLocation);
    return await newPostedLocation.save();
  }

  async findOneAndUpdate(
    postedLocationFilterQuery: FilterQuery<PostedLocation>,
    PostedLocation: Partial<PostedLocation>
  ): Promise<PostedLocation> {
    return await this.postedLocationModel.findOneAndUpdate(postedLocationFilterQuery, PostedLocation, {
      new: true
    });
  }

  async findAndUpdatePost(
    id: string,
    staffId: string 
  ) {
    return await this.postedLocationModel.findByIdAndUpdate({_id: id }, {
      $push: {
        staffs: staffId
      }
    }, { new: true })
  }

  async findAndUpdatePostTransfer(currentId: string, newId: string, staffId: string) {
    const session = await this.connection.startSession();
    session.startTransaction();
    const oldId = await this.postedLocationModel.findById({ _id: currentId});

    if(!oldId) throw new HttpException('current local government not found', 404);

    try {
      await oldId.updateOne({
        $pull: {
          staffs: staffId
        }
      }).session(session);
  
      const newLocation = await this.postedLocationModel.findByIdAndUpdate({ _id: newId }, {
        $push: {
          staffs: staffId
        }
      }, { new: true }).populate('staffs').session(session);
  
      await session.commitTransaction();
      // console.log(newLocation)
      return { from: oldId.lga, newLocation}
    } catch (error) {
      await session.abortTransaction()
      throw new Error(error.message as string)
    } finally {
      session.endSession();
    }

  }

  findOneAndDelete(postedLocationFilterQuery: FilterQuery<PostedLocation>): Promise<PostedLocation> {
    return this.postedLocationModel.findOneAndDelete(postedLocationFilterQuery);
  }
}