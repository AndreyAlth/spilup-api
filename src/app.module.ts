<<<<<<< Updated upstream
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { ApiKeyModule } from './api-key/api-key.module';
import { TokensModule } from './tokens/tokens.module';
=======
import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { PrismaModule } from './prisma/prisma.module'
import { AuthController } from './auth/auth.controller'
import { AuthService } from './auth/auth.service'
import { AuthModule } from './auth/auth.module'
import { ApiKeyModule } from './api-key/api-key.module'
import { TokensModule } from './tokens/tokens.module'
import { PaymentsModule } from './payments/payments.module'
>>>>>>> Stashed changes

@Module({
  imports: [UsersModule, PrismaModule, AuthModule, ApiKeyModule, TokensModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
