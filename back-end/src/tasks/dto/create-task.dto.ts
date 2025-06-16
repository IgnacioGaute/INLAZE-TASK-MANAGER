import { Type } from "class-transformer";
import { Allow, IsArray, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { STATUS_TYPE, StatusType } from "../entities/task.entity";

export class CreateTaskDto {

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    date: Date;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    users: string[];

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    groupOfColaborators: string[];

    @IsEnum(STATUS_TYPE)
    status: StatusType;
}

export class UpdateTaskStatusDto {
    
    @IsEnum(STATUS_TYPE)
    status: StatusType;
}


