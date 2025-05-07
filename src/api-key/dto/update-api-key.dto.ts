import { IsOptional, IsString } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'
import { CreateApiKeyDto } from './create-api-key.dto'

export class UpdateApiKeyDto extends PartialType(CreateApiKeyDto) {
  @IsOptional()
  @IsString()
  name?: string
}
