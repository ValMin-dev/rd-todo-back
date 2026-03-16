import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthDto } from './dto/auth.dto'
import { UserService } from '../user/user.service'
import { verify } from 'argon2'
import { Response } from 'express'

@Injectable()
export class AuthService {
	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)
		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			expires: expiresIn,
			domain: 'localhost',
			secure: true,
			sameSite: 'none'
		})
	}

	EXPIRE_DAY_REFRESH_TOKEN = 1
	REFRESH_TOKEN_NAME = 'refreshToken'

	constructor(
		private userService: UserService,
		private jwt: JwtService
	) {}

	async login(dto: AuthDto) {
		const { password, ...user } = await this.validateUser(dto)
		const tokens = this.issueTokens(user.id)
		return { user, ...tokens }
	}

	async register(dto: AuthDto) {
		const oldUser = await this.userService.getByEmail(dto.email)

		if (oldUser) throw new BadRequestException('Email already in use')

		const user = await this.userService.create(dto)
		const tokens = this.issueTokens(user.id)
		return { user, ...tokens }
	}

	private issueTokens(userId: string) {
		const data = { id: userId }
		const accessToken = this.jwt.sign(data, { expiresIn: '1h' })

		const refreshToken = this.jwt.sign(data, { expiresIn: '7d' })
		return { accessToken, refreshToken }
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) throw new UnauthorizedException('Invalid refresh token')

		const { password, ...user } = await this.userService.getById(result.id)
		const tokens = this.issueTokens(user.id)

		return {
			user,
			...tokens
		}
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getByEmail(dto.email)

		if (!user) throw new NotFoundException('User not found adwdawdawdawdwa')

		const isValid = await verify(user.password, dto.password)

		if (!isValid) throw new UnauthorizedException('Invalid password')

		return user
	}

	addRefreshToken(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)
		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			expires: expiresIn,
			domain: 'localhost',
			secure: true,
			sameSite: 'none'
		})
	}

	removeRefreshTokenFromResponse(res: Response) {
		res.clearCookie(this.REFRESH_TOKEN_NAME, {
			domain: 'localhost',
			secure: true,
			sameSite: 'none'
		})
	}
}
