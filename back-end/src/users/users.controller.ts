import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { User } from './entities/user.entity';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { GroupOfColaborators } from './entities/group-of-colaborators.entity';
import { AuthOrTokenAuthGuard } from 'src/utils/guards/auth-or-token.guard';
import { CreateCollaboratorGroupDto } from './dto/create-collaborator-group.dto';
import { UpdateCollaboratorGroupDto } from './dto/update-collaborator-group.dto';

@Controller('users')
@UseGuards(AuthOrTokenAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('groupOfColaborators')
  createGroupOfColaborators(@Body() createCollaboratorGroupDto: CreateCollaboratorGroupDto) {
    return this.usersService.createGroupOfColaborators(createCollaboratorGroupDto);
  }

  @Get()
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<User>> {
    return this.usersService.findAll(query);
  }

  @Get('groupOfColaborators')
  findAllGroupOfColaborators(@Paginate() query: PaginateQuery): Promise<Paginated<GroupOfColaborators>> {
    return this.usersService.findAllGroupOfColaborators(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('groupOfColaborators/:id')
  findOneGroupOfColaborators(@Param('id') id: string) {
    return this.usersService.findOneGroupOfColaborators(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('groupOfColaborators/:id')
  updateGroupOfColaborators(@Param('id') id: string, @Body() updateCollaboratorGroupDto: UpdateCollaboratorGroupDto) {
    return this.usersService.updateGroupOfColaborators(id, updateCollaboratorGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Delete('groupOfColaborators/:id')
  removeGroupOfColaborators(@Param('id') id: string) {
    return this.usersService.removeGroupOfColaborators(id);
  }

  @Patch(':id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    return this.usersService.updatePassword(id, updatePasswordDto);
  }
}
