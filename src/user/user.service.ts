import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { AuthDto } from 'src/auth/dto/auth.dto'
import { hash } from 'argon2'
import { UserDto } from './dto/user-dto'
import { startOfDay, subDays } from 'date-fns'
@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	getById(id: string) {
		return this.prisma.user.findFirstOrThrow({
			where: { id },
			include: { tasks: true }
		})
	}

	getByEmail(email: string) {
		return this.prisma.user.findUnique({ where: { email } })
	}
	async create(dto: AuthDto) {
		const user = {
			email: dto.email,
			password: await hash(dto.password)
		}

		return this.prisma.user.create({ data: user })
	}

	async getProfile(id: string) {
		const profile = await this.getById(id)

		const totalTasks = profile?.tasks.length
		const completedTasks = await this.prisma.task.count({
			where: {
				userId: id,
				isCompleted: true
			}
		})
		const todayStart = startOfDay(new Date())
		const weekStart = subDays(todayStart, 7)

		const todayTasks = await this.prisma.task.count({
			where: {
				userId: id,
				createdAt: {
					gte: todayStart.toISOString()
				}
			}
		})

		const weekTasks = await this.prisma.task.count({
			where: {
				userId: id,
				createdAt: {
					gte: weekStart.toISOString()
				}
			}
		})

		const { password, ...rest } = profile

		return {
			user: rest,
			stats: [
				{ label: 'Total Tasks', value: totalTasks },
				{ label: 'Completed Tasks', value: completedTasks },
				{ label: 'Tasks Today', value: todayTasks },
				{ label: 'Tasks This Week', value: weekTasks }
			]
		}
	}

	async update(id: string, dto: UserDto) {
		let data: UserDto = dto
		if (dto.password) {
			data = {
				...dto,
				password: await hash(dto.password)
			}
		}
		return this.prisma.user.update({
			where: { id },
			data,
			select: {
				id: true,
				createdAt: true,
				updatedAt: true,
				tasks: true,
				email: true
			}
		})
	}
}
