import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class TokenBalanceDto {
  @IsNotEmpty()
  @IsString()
  id: string

  @IsNotEmpty()
  @IsNumber()
  amount: number

  @IsNotEmpty()
  @IsString()
  userId: string

  @IsNotEmpty()
  @IsDateString()
  createdAt: Date

  @IsDateString()
  updatedAt: Date
}
