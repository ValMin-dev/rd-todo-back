import { TaskService } from './task.service'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { TaskDto } from './dto/task-dto'
import {
	Controller,
	Get,
	UsePipes,
	ValidationPipe,
	HttpCode,
	Post,
	Body,
	Put,
	Param,
	Delete
} from '@nestjs/common'

@Controller('user/tasks')
export class TaskController {
	constructor(private readonly taskService: TaskService) {}

	@Get()
	@Auth()
	async getAll(@CurrentUser('id') UserId: string) {
		return this.taskService.getAll(UserId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Post()
	async create(@Body() dto: TaskDto, @CurrentUser('id') UserId: string) {
		return this.taskService.create(dto, UserId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Put(':id')
	async update(
		@Body() dto: Partial<TaskDto>,
		@CurrentUser('id') UserId: string,
		@Param('id') taskId: string
	) {
		return this.taskService.update(dto, taskId, UserId)
	}

	@HttpCode(200)
	@Auth()
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.taskService.delete(id)
	}
}
