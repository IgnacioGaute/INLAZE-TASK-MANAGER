import { IsArray, IsString } from "class-validator";

  export class CreateCollaboratorGroupDto {
    @IsString()
    name: string;

    @IsArray()
    @IsString({ each: true })
    users: string[];
}
  