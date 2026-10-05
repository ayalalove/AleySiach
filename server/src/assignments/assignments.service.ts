import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class AssignmentService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  private collection() {
    return this.connection.collection('assignments');
  }

  async getAll() {
    return this.collection().find().toArray();
  }

  async getById(id: string) {
    return this.collection().findOne({
      _id: new ObjectId(id),
    });
  }

  async create(assignment_date: string, guide_id: string) {
    const guide = await this.connection.collection('guides').findOne({
      _id: new ObjectId(guide_id),
    });

    if (!guide) {
      return {
        success: false,
        message: 'Guide not found',
      };
    }

    const existing = await this.collection().findOne({
      assignment_date,
    });

    if (existing) {
      return {
        success: false,
        message: 'There is already an assignment for this date',
      };
    }

    const result = await this.collection().insertOne({
      assignment_date,
      guide_id: new ObjectId(guide_id),
    });

    return {
      _id: result.insertedId,
      assignment_date,
      guide_id,
    };
  }

  async update(id: string, assignment_date: string, guide_id: string) {
    const guide = await this.connection.collection('guides').findOne({
      _id: new ObjectId(guide_id),
    });

    if (!guide) {
      return {
        success: false,
        message: 'Guide not found',
      };
    }

    await this.collection().updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          assignment_date,
          guide_id: new ObjectId(guide_id),
        },
      },
    );

    return this.getById(id);
  }

  async delete(id: string) {
    await this.collection().deleteOne({
      _id: new ObjectId(id),
    });

    return {
      success: true,
      message: 'Assignment deleted successfully',
    };
  }
}
