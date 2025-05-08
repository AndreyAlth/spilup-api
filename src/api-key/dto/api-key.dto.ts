import { IsDateString, IsNotEmpty, IsString } from 'class-validator'

export class PublicApiKeyDto {
  @IsNotEmpty()
  @IsString()
  id: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsDateString()
  createdAt: Date

  @IsDateString()
  updatedAt: Date
}
