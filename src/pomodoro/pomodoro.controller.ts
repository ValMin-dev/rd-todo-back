import { PomodoroService } from './pomodoro.service'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { PomodoroSessionDto } from './dto/pomodoro-dto'
import { PomodoroRoundDto } from './dto/pomodoro-dto'
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

@Controller('user/timer')
export class PomodoroController {
	constructor(private readonly pomodoroService: PomodoroService) {}

	@Get('today')
	@Auth()
	async getTodaySession(@CurrentUser('id') userId: string) {
		return this.pomodoroService.getTodaySession(userId)
	}

	@HttpCode(200)
	@Auth()
	@Post()
	async create(@CurrentUser('id') userId: string) {
		return this.pomodoroService.create(userId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Put('round/:id')
	async updateRound(
		@Body() dto: Partial<PomodoroRoundDto>,
		@Param('id') id: string
	) {
		return this.pomodoroService.updateRound(dto, id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Put(':id')
	async update(
		@Body() dto: Partial<PomodoroSessionDto>,
		@Param('id') id: string,
		@CurrentUser('id') userId: string
	) {
		return this.pomodoroService.update(dto, id, userId)
	}

	@HttpCode(200)
	@Auth()
	@Delete(':id')
	async deleteSession(
		@Param('id') id: string,
		@CurrentUser('id') userId: string
	) {
		return this.pomodoroService.deleteSession(id, userId)
	}
}
