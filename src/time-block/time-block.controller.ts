import { timeBlockService } from './time-block.service'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { TimeBlockDto } from './dto/time-block-dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import {
	Controller,
	Get,
	UsePipes,
	ValidationPipe,
	HttpCode,
	Post,
	Body,
	Put,
	Delete,
	Param
} from '@nestjs/common'

@Controller('user/time-blocks')
export class TimeBlockController {
	constructor(private readonly timeBlockService: timeBlockService) {}

	@Get()
	@Auth()
	async getAll(@CurrentUser('id') UserId: string) {
		return this.timeBlockService.getAll(UserId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Post()
	async create(@Body() dto: TimeBlockDto, @CurrentUser('id') UserId: string) {
		return this.timeBlockService.create(dto, UserId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Put('update-order')
	updateOrder(@Body() updateOrderDto: UpdateOrderDto) {
		return this.timeBlockService.updateOrder(updateOrderDto.ids)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth()
	async update(
		@Body() dto: TimeBlockDto,
		@CurrentUser('id') userId: string,
		@Param('id') id: string
	) {
		return this.timeBlockService.update(dto, id, userId)
	}

	@HttpCode(200)
	@Auth()
	@Delete(':id')
	async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
		return this.timeBlockService.delete(id, userId)
	}
}
