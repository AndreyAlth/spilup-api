import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ApiKeyService } from './api-key.service'
import { CreateApiKeyDto } from './dto/create-api-key.dto'
import { UpdateApiKeyDto } from './dto/update-api-key.dto'

@Controller('api-keys')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  create(@Body() createApiKeyDto: CreateApiKeyDto) {
    return this.apiKeyService.create(createApiKeyDto)
  }

  @Get('users/:user_id')
  findAll(@Param('user_id') user_id: string) {
    return this.apiKeyService.findAllbyUserId(user_id)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apiKeyService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApiKeyDto: UpdateApiKeyDto) {
    return this.apiKeyService.update(+id, updateApiKeyDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apiKeyService.remove(+id)
  }
}
