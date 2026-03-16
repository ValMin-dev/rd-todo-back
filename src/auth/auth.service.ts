import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthDto } from './dto/auth.dto'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwt: JwtService
	) {}

	async login(dto: AuthDto) {
		return dto
	}
}
