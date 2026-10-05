import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GuideService } from './gudie.service';

@Controller('guides')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @Get()
  getAll() {
    return this.guideService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.guideService.getById(id);
  }

  @Post()
  create(@Body('name') name: string) {
    return this.guideService.create(name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('name') name: string) {
    return this.guideService.update(id, name);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.guideService.delete(id);
  }
}
