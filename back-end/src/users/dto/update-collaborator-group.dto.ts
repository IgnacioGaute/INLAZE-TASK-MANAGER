import { PartialType } from '@nestjs/mapped-types';
import { CreateCollaboratorGroupDto } from './create-collaborator-group.dto';

export class UpdateCollaboratorGroupDto extends PartialType(CreateCollaboratorGroupDto) {}
