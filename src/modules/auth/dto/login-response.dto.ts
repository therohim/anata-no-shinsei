import { IsNotEmpty } from 'class-validator'
import { Tokens } from '../enum/tokens.enum'

export class LoginResponseDto {
	@IsNotEmpty()
	readonly id: string

	@IsNotEmpty()
	readonly name: string

	@IsNotEmpty()
	readonly username: string

	@IsNotEmpty()
	readonly email: string

	@IsNotEmpty()
	readonly phone: string
	
	@IsNotEmpty()
	readonly token: Tokens
}
