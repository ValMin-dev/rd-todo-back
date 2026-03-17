import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PomodoroService } from './pomodoro.service'
import { PomodoroController } from './pomodoro.controller'

@Module({
	controllers: [PomodoroController],
	providers: [PomodoroService, PrismaService],
	exports: [PomodoroService]
})
export class PomodoroModule {}
