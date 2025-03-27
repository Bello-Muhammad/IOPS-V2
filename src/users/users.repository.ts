import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User } from './users.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(userFilterQuery: FilterQuery<User>): Promise<User> {
    return this.userModel.findOne(userFilterQuery);
  }

  async find(userFilterQuery: FilterQuery<User>): Promise<User[]> {
    return this.userModel.find(userFilterQuery);
  }

  async create(user: User): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findOneAndUpdate(
    userFilterQuery: FilterQuery<User>,
    user: Partial<User>
  ): Promise<User> {
    return this.userModel.findOneAndUpdate(userFilterQuery, user, {
      new: true
    });
  }

  async findAndUpdatePassword (
    userFilterQuery: FilterQuery<User>,
    password: string
  ): Promise<User> {
    const user = await this.userModel.findOne(userFilterQuery);

    user.password = password;

    return await user.save();
  }

  async findOneAndDelete(userFilterQuery: FilterQuery<User>): Promise<User> {
    return this.userModel.findOneAndDelete(userFilterQuery);
  }
}
