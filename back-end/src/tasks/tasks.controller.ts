import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskStatusDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { AuthOrTokenAuthGuard } from 'src/utils/guards/auth-or-token.guard';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('tasks')
@UseGuards(AuthOrTokenAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post(':projectId')
  create(@Param('projectId') projectId: string, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto, projectId);
  }

  @Post('comments/task')
  createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.tasksService.createComment(createCommentDto);
  }

  @Get()
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Task>> {
    return this.tasksService.findAll(query);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Patch('status/:id')
  updateStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    return this.tasksService.updateTaskStatus(id, updateTaskStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

}
