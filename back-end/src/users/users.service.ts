import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { FilterOperator, paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { GroupOfColaborators } from './entities/group-of-colaborators.entity';
import { CreateCollaboratorGroupDto } from './dto/create-collaborator-group.dto';
import { UpdateCollaboratorGroupDto } from './dto/update-collaborator-group.dto';


@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(GroupOfColaborators)
    private readonly groupOfColaboratorsRepository: Repository<GroupOfColaborators>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const existingUserEmail = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUserEmail) {
        throw new ConflictException('email already exists');
      }

      const existingUserName = await this.userRepository.findOne({
        where: { username: createUserDto.username },
      });

      if (existingUserName) {
        throw new ConflictException('username already exists');
      }
      const user = this.userRepository.create(createUserDto);

      if (createUserDto.password) {
        const hashedPassword = bcrypt.hashSync(createUserDto.password, 10);
        user.password = hashedPassword;
      }

      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(error.message, error.stack);
    }
  }

  async findAll(query: PaginateQuery): Promise<Paginated<User>> {
    try {
      return await paginate(query, this.userRepository, {
        sortableColumns: ['id', 'username', 'email'],
        nullSort: 'last',
        defaultSortBy: [['createdAt', 'DESC']],
        searchableColumns: ['username', 'email'],
        filterableColumns: {
          username: [FilterOperator.ILIKE, FilterOperator.EQ],
          email: [FilterOperator.EQ, FilterOperator.ILIKE],
        },
      });
    } catch (error) {
      this.logger.error(error.message, error.stack);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(error.message, error.stack);
      }
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const fieldsToUpdate = Object.entries(updateUserDto).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== user[key]) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Partial<UpdateUserDto>,
      );

      if (fieldsToUpdate.username) {
        const existingUser = await this.userRepository.findOne({
          where: { username: fieldsToUpdate.username },
        });

        if (existingUser && existingUser.id !== id) {
          throw new BadRequestException({
            code: 'USER_NAME_ALREDY_EXISTS',
            message: 'User name already exists',
          });
        }
      }

      const updatedUser = this.userRepository.merge(user, fieldsToUpdate);

      if (updateUserDto.password) {
        const hashedPassword = bcrypt.hashSync(updateUserDto.password, 10);
        updatedUser.password = hashedPassword;
      }

      const result = await this.userRepository.save(updatedUser);

      this.logger.log(`User "${result.email}" updated successfully`);
      return result;
    } catch (error) {
      if (
        !(
          error instanceof NotFoundException ||
          error instanceof BadRequestException
        )
      ) {
        this.logger.error(error.message, error.stack);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.userRepository.remove(user);

      return { message: 'User removed successfully' };
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(error.message, error.stack);
      }
      throw error;
    }
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    try {
      const { currentPassword, newPassword, repeatNewPassword } =
        updatePasswordDto;

      if (newPassword !== repeatNewPassword) {
        throw new BadRequestException('Passwords do not match');
      }

      const user = await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where({ id })
        .getOne();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        throw new BadRequestException({
          code: 'CURRENT_PASSWORD_INCORRECT',
          message: 'Current password is incorrect',
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      return this.userRepository.save(user);
    } catch (error) {
      if (
        !(
          error instanceof NotFoundException ||
          error instanceof BadRequestException
        )
      ) {
        this.logger.error(error.message, error.stack);
      }
      throw error;
    }
  }

  async createGroupOfColaborators(createCollaboratorGroupDto: CreateCollaboratorGroupDto) {
    try {
      const { name, users } = createCollaboratorGroupDto;

      const groupUsers = await this.userRepository.find({
        where: { id: In(users) },
      });

      if (groupUsers.length !== users.length) {
        throw new NotFoundException('Users or user not found');
      }

      const group = this.groupOfColaboratorsRepository.create({
        name,
        users: groupUsers,
      });
      return await this.groupOfColaboratorsRepository.save(group);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

    async findAllGroupOfColaborators(query: PaginateQuery): Promise<Paginated<GroupOfColaborators>> {
    try {
      return await paginate(query, this.groupOfColaboratorsRepository, {
        sortableColumns: ['id'],
        nullSort: 'last',
        defaultSortBy: [['createdAt', 'DESC']],
        searchableColumns: ['name'],
        filterableColumns: {
          name: [FilterOperator.ILIKE, FilterOperator.EQ],
        },
        relations: ['users', 'tasks']
      });
    } catch (error) {
      this.logger.error(error.message, error.stack);
    }
  }

    async findOneGroupOfColaborators(id: string) {
    try {
      const group = await this.groupOfColaboratorsRepository.findOne({
        where: { id },
        relations: ['users']
      });

      if (!group) {
        throw new NotFoundException('Group not found');
      }

      return group;
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(error.message, error.stack);
      }
      throw error;
    }
  }

  async updateGroupOfColaborators(id: string, updateCollaboratorGroupDto: UpdateCollaboratorGroupDto) {
    try {
      const group = await this.groupOfColaboratorsRepository.findOne({
        where: { id },
        relations: ['users'],
      });

      if (!group) {
        throw new NotFoundException('Group not found');
      }

      if (updateCollaboratorGroupDto.name) {
        group.name = updateCollaboratorGroupDto.name;
      }

      if (updateCollaboratorGroupDto.users && updateCollaboratorGroupDto.users.length > 0) {
        const users = await this.userRepository.find({
          where: { id: In(updateCollaboratorGroupDto.users) },
        });

        if (users.length !== updateCollaboratorGroupDto.users.length) {
          throw new NotFoundException('Users or user not found');
        }

        group.users = users;
      }

      return await this.groupOfColaboratorsRepository.save(group);
    } catch (error) {
      if (
        !(
          error instanceof NotFoundException ||
          error instanceof BadRequestException
        )
      ) {
        this.logger.error(error.message, error.stack);
      }
      throw error;
    }
  }


  async removeGroupOfColaborators(id: string) {
    try {
      const group = await this.groupOfColaboratorsRepository.findOneBy({ id });

      if (!group) {
        throw new NotFoundException('Group not found');
      }

      await this.groupOfColaboratorsRepository.remove(group);

      return { message: 'Group removed successfully' };
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(error.message, error.stack);
      }
      throw error;
    }
  }


}
