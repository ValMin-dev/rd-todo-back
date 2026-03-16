import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { AuthDto } from 'src/auth/dto/auth.dto'
import { hash } from 'argon2'
@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	getById(id: string) {
		return this.prisma.user.findUniqueOrThrow({
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
}
