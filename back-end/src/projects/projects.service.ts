import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { FilterOperator, paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class ProjectsService {
    private readonly logger = new Logger(ProjectsService.name);

    constructor(
      @InjectRepository(Project)
      private readonly projectRepository: Repository<Project>,
    ) {}
  
 async create(createProjectDto: CreateProjectDto) {
      try {
        const project = this.projectRepository.create(createProjectDto);

        const savedProject = await this.projectRepository.save(project)
        
        return savedProject;
      } catch (error) {
        this.logger.error(error.message, error.stack);
        throw error;
      }
    }
    
  async findAll(query: PaginateQuery): Promise<Paginated<Project>> {
    try {
      return await paginate(query, this.projectRepository, {
        sortableColumns: ['id'],
        nullSort: 'last',
        defaultSortBy: [['createdAt', 'DESC']],
        searchableColumns: ['title'],
        filterableColumns: {
          title: [FilterOperator.ILIKE, FilterOperator.EQ],
        },
        relations: ['tasks']
      });
    } catch (error) {
      this.logger.error(error.message, error.stack);
    }
  }

  async findOne(id: string) {
    try {
      const project = await this.projectRepository.findOne({
        where: { id },
        relations: ['tasks', 'tasks.users', 'tasks.groupOfColaborators', 'tasks.groupOfColaborators.users', 'tasks.comments', 'tasks.comments.author']
      });
  
      if (!project) {
        throw new NotFoundException(`Project not found`);
      }
  
      return project;
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(error.message, error.stack);
      }
      throw error;
    }
  }
  

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    try {
      const project = await this.projectRepository.findOne({
        where: { id },
      });
  
      if (!project) {
        throw new NotFoundException(`Project not found`);
      }
      const updateProject = await this.projectRepository.merge(project, updateProjectDto);

      const savedProject = await this.projectRepository.save(updateProject);

      return savedProject
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(error.message, error.stack);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try{
      const project = await this.projectRepository.findOne({
        where: { id },
      });
  
      if (!project) {
        throw new NotFoundException(`Project not found`);
      }

      await this.projectRepository.remove(project);

      return {message: 'Project removed successfully'}
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(error.message, error.stack);
      }
      throw error;
    }
  }
}
