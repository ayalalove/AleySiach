import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { ReminderController } from './reminders/reminder.controller';
import { GuideController } from './gudies/guide.controller';
import { AssignmentController } from './assignments/assignments.controller';
import { GuideService } from './gudies/gudie.service';
import { AssignmentService } from './assignments/assignments.service';
import { ReminderService } from './reminders/reminder.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
  ],

  controllers: [GuideController, AssignmentController, ReminderController],

  providers: [GuideService, AssignmentService, ReminderService],
})
export class AppModule {}
