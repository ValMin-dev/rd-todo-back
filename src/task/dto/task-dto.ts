import { Transform } from 'class-transformer'
import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator'
import { Priority } from '@prisma/client'

export class TaskDto {
	@IsString()
	@IsOptional()
	name?: string
	@IsBoolean()
	@IsOptional()
	isCompleted?: boolean

	@IsString()
	@IsOptional()
	createdAt?: string

	@IsEnum(Priority)
	@IsOptional()
	@Transform(({ value }) => ('' + value).toLowerCase())
	priority?: Priority
}
