import { IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
    @IsOptional()
    @IsString()
    taskId: string;

    @IsOptional()
    @IsString()
    userId: string;

    @IsString()
    content: string;
}
