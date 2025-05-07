import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateApiKeyDto } from './dto/create-api-key.dto'
import { UpdateApiKeyDto } from './dto/update-api-key.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import * as crypto from 'crypto'
import { PublicApiKeyDto } from './dto/api-key.dto'

@Injectable()
export class ApiKeyService {
  constructor(private readonly prisma: PrismaService) {}

  private generateApiKey(): string {
    // Generar un string aleatorio de 32 bytes y convertirlo a hexadecimal
    return crypto.randomBytes(32).toString('hex')
  }

  async create(createApiKeyDto: CreateApiKeyDto): Promise<PublicApiKeyDto> {
    const apiKey = this.prisma.apikey.create({
      data: {
        name: createApiKeyDto.name,
        userId: createApiKeyDto.userId,
        key: this.generateApiKey(),
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return apiKey
  }

  findAllbyUserId(userId: string): Promise<PublicApiKeyDto[]> {
    const apikeys = this.prisma.apikey.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return apikeys
  }

  async findOne(id: string) {
    const apiKey = await this.prisma.apikey.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!apiKey) {
      throw new NotFoundException(`API key with ID ${id} not found`)
    }

    return apiKey
  }

  async update(id: string, updateApiKeyDto: UpdateApiKeyDto): Promise<PublicApiKeyDto> {
    const apikey = await this.prisma.apikey.update({
      where: { id },
      data: updateApiKeyDto,
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!apikey) {
      throw new NotFoundException(`API key with ID ${id} not found`)
    }

    return apikey
  }

  async remove(id: string): Promise<PublicApiKeyDto> {
    const apikey = await this.prisma.apikey.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    if (!apikey) {
      throw new NotFoundException(`API key with ID ${id} not found`)
    }
    return apikey
  }
}
