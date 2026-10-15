import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ObjectId } from 'mongodb';

const DEFAULT_ITEMS: Record<string, string[]> = {
  'מוצרי חלב וביצים': [
    'חלב',
    'ביצים',
    'גבינה צהובה',
    'גבינה לבנה',
    "קוטג'",
    'יוגורט',
    'חמאה',
  ],
  מאפים: ['לחם', 'פיתות', 'לחמניות'],
  'ירקות ופירות': [
    'עגבניות',
    'מלפפונים',
    'בצל',
    'תפוחי אדמה',
    'גזר',
    'תפוחים',
    'בננות',
    'לימונים',
  ],
  'מזון יבש': [
    'אורז',
    'פסטה',
    'קמח',
    'סוכר',
    'מלח',
    'שמן',
    'קפה',
    'תה',
    'קורנפלקס',
    'טונה',
    'רסק עגבניות',
  ],
  'ניקיון והיגיינה': [
    'נייר טואלט',
    'מגבות נייר',
    'סבון כלים',
    'אבקת כביסה',
    'שקיות זבל',
    'סבון ידיים',
    'נוזל רצפות',
    'שמפו',
  ],
};

@Injectable()
export class ShoppingService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  private collection() {
    return this.connection.collection('shopping_items');
  }

  async getAll() {
    const count = await this.collection().countDocuments();

    if (count === 0) {
      const defaults = Object.entries(DEFAULT_ITEMS).flatMap(
        ([category, names]) =>
          names.map((name) => ({ name, category, missing: false })),
      );

      await this.collection().insertMany(defaults);
    }

    return this.collection().find().toArray();
  }

  async getById(id: string) {
    return this.collection().findOne({
      _id: new ObjectId(id),
    });
  }

  async create(name: string, category?: string) {
    const trimmedName = name?.trim();

    if (!trimmedName) {
      return {
        success: false,
        message: 'Item name is required',
      };
    }

    const existing = await this.collection().findOne({ name: trimmedName });

    if (existing) {
      return {
        success: false,
        message: 'Item already exists',
      };
    }

    const item = {
      name: trimmedName,
      category: category?.trim() || 'אחר',
      missing: true,
    };

    const result = await this.collection().insertOne(item);

    return {
      _id: result.insertedId,
      ...item,
    };
  }

  async setMissing(id: string, missing: boolean) {
    await this.collection().updateOne(
      { _id: new ObjectId(id) },
      { $set: { missing } },
    );

    return this.getById(id);
  }

  async markAllAvailable() {
    await this.collection().updateMany(
      { missing: true },
      { $set: { missing: false } },
    );

    return {
      success: true,
      message: 'All items marked as available',
    };
  }

  async delete(id: string) {
    await this.collection().deleteOne({
      _id: new ObjectId(id),
    });

    return {
      success: true,
      message: 'Item deleted successfully',
    };
  }
}
