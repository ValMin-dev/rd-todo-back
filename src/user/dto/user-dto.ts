import {
	IsOptional,
	IsInt,
	Min,
	Max,
	IsEmail,
	IsString,
	MinLength
} from 'class-validator'

export class PomodoroSettingsDto {
	@IsOptional()
	@IsInt()
	@Min(1)
	workInterval?: number

	@IsOptional()
	@IsInt()
	@Min(1)
	breakInterval?: number

	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(10)
	intervalCount?: number
}

export class UserDto extends PomodoroSettingsDto {
	@IsEmail()
	@IsOptional()
	email?: string

	@IsString()
	@IsOptional()
	name?: string

	@IsString()
	@MinLength(6, { message: 'Password must be at least 6 characters long' })
	@IsOptional()
	password?: string
}
