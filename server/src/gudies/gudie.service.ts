import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class GuideService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  private collection() {
    return this.connection.collection('guides');
  }

  async getAll() {
    return this.collection().find().toArray();
  }

  async getById(id: string) {
    return this.collection().findOne({
      _id: new ObjectId(id),
    });
  }

  async create(name: string) {
    const result = await this.collection().insertOne({ name });

    return {
      _id: result.insertedId,
      name,
    };
  }

  async update(id: string, name: string) {
    await this.collection().updateOne(
      { _id: new ObjectId(id) },
      { $set: { name } },
    );

    return this.getById(id);
  }

  async delete(id: string) {
    const assignments = this.connection.collection('assignments');

    const existingAssignment = await assignments.findOne({
      guide_id: new ObjectId(id),
    });

    if (existingAssignment) {
      return {
        success: false,
        message: 'Cannot delete guide with existing assignments',
      };
    }

    await this.collection().deleteOne({
      _id: new ObjectId(id),
    });

    return {
      success: true,
      message: 'Guide deleted successfully',
    };
  }
}
