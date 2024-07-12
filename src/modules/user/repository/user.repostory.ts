import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: any): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(query: { q: string }): Promise<User[]> {
    let filters: mongoose.FilterQuery<UserDocument> = {
      $or: [
        { full_name: new RegExp(query.q, 'i') },
        { email: new RegExp(query.q, 'i') },
      ],
    };

    if (!query.q) {
      filters = {};
    }

    let result = await this.userModel.find(filters).sort({ createdAt: -1 })

    return result
  }

  async findAllUsers() : Promise<User[]> {
    return await this.userModel.find().exec()
  }

  async findUserByEmailOrUsername(loginIdentity: string): Promise<User> {
    return this.userModel.findOne({ $or:[{username:loginIdentity}, {email:loginIdentity}] }).exec();
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email }).exec();
  }

  async findUserByPhone(phone: string): Promise<User> {
    return this.userModel.findOne({ phone: phone }).exec();
  }

  async findUserByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username: username }).exec();
  }

  async updateOne(userId: string, data: any) {
    return this.userModel.updateOne({ _id: userId }, { $set: data }).exec();
  }

  async findById(userId: string) {
    return this.userModel.findById(userId).exec();
  }

  async delete(id: string) {
    return await this.userModel.deleteMany({ _id: id });
  }
}
