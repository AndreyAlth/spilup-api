import { Module } from '@nestjs/common'
import { ApiKeyService } from './api-key.service'
import { ApiKeyController } from './api-key.controller'
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
  controllers: [ApiKeyController],
  providers: [ApiKeyService],
  imports: [PrismaModule],
})
export class ApiKeyModule {}
