import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ShoppingService } from './shopping.service';

@Controller('shopping')
export class ShoppingController {
  constructor(private readonly shoppingService: ShoppingService) {}

  @Get()
  getAll() {
    return this.shoppingService.getAll();
  }

  @Post()
  create(@Body('name') name: string, @Body('category') category?: string) {
    return this.shoppingService.create(name, category);
  }

  @Patch('mark-all-available')
  markAllAvailable() {
    return this.shoppingService.markAllAvailable();
  }

  @Patch(':id')
  setMissing(@Param('id') id: string, @Body('missing') missing: boolean) {
    return this.shoppingService.setMissing(id, missing);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.shoppingService.delete(id);
  }
}
