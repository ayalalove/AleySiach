import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class ReminderService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  private collection() {
    return this.connection.collection('reminders');
  }

  async getAll() {
    return this.collection().find().toArray();
  }

  async getById(id: string) {
    return this.collection().findOne({
      _id: new ObjectId(id),
    });
  }

  async create(reminder_date: string, title: string, content: string | null) {
    const result = await this.collection().insertOne({
      reminder_date,
      title,
      content: content ?? null,
    });

    return {
      _id: result.insertedId,
      reminder_date,
      title,
      content: content ?? null,
    };
  }

  async update(
    id: string,
    reminder_date: string,
    title: string,
    content: string | null,
  ) {
    await this.collection().updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          reminder_date,
          title,
          content: content ?? null,
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
      message: 'Reminder deleted successfully',
    };
  }
}
