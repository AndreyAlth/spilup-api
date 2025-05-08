import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { TokenType } from './constants'

export class TokenTransactionDto {
  @IsNotEmpty()
  @IsString()
  id: string

  @IsNotEmpty()
  @IsNumber()
  amount: Float32Array

  @IsNotEmpty()
  type: TokenType

  description: string

  metadata: JSON

  @IsNotEmpty()
  @IsString()
  userId: string

  @IsNotEmpty()
  @IsDateString()
  createdAt: Date

  @IsDateString()
  updatedAt: Date
}
