import { IsNotEmpty, IsString } from 'class-validator'

export class CreateApiKeyDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  userId: string
}
