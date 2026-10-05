import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AssignmentService } from './assignments.service';

@Controller('assignments')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Get()
  getAll() {
    return this.assignmentService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.assignmentService.getById(id);
  }

  @Post()
  create(
    @Body('assignment_date') assignment_date: string,
    @Body('guide_id') guide_id: string,
  ) {
    return this.assignmentService.create(assignment_date, guide_id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body('assignment_date') assignment_date: string,
    @Body('guide_id') guide_id: string,
  ) {
    return this.assignmentService.update(id, assignment_date, guide_id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.assignmentService.delete(id);
  }
}
