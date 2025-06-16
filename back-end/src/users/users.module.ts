import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { GroupOfColaborators } from './entities/group-of-colaborators.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, GroupOfColaborators])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
