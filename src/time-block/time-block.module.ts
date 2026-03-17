import { Module } from '@nestjs/common'
import { timeBlockService } from './time-block.service'
import { TimeBlockController } from './time-block.controller'
import { PrismaService } from '../prisma.service'

@Module({
	controllers: [TimeBlockController],
	providers: [timeBlockService, PrismaService],
	exports: [timeBlockService]
})
export class TimeBlockModule {}
