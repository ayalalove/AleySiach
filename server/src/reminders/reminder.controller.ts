import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ReminderService } from './reminder.service';

@Controller('reminders')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Get()
  getAll() {
    return this.reminderService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.reminderService.getById(id);
  }

  @Post()
  create(
    @Body('reminder_date') reminder_date: string,
    @Body('title') title: string,
    @Body('content') content: string | null,
  ) {
    return this.reminderService.create(reminder_date, title, content);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body('reminder_date') reminder_date: string,
    @Body('title') title: string,
    @Body('content') content: string | null,
  ) {
    return this.reminderService.update(id, reminder_date, title, content);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.reminderService.delete(id);
  }
}
