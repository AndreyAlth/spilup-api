import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { TokenType } from './constants'
import { InputJsonValue } from 'generated/prisma/runtime/library'

export class CreateTokenTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number

  @IsNotEmpty()
  type: TokenType

  description: string

  metadata: InputJsonValue | undefined

  @IsNotEmpty()
  @IsString()
  userId: string
}
