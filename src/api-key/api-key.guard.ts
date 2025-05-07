// import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
// import { Observable } from 'rxjs'
// import { ApiKeyService } from './api-key.service'

// @Injectable()
// export class ApiKeyGuard implements CanActivate {
//   constructor(private apiKeyService: ApiKeyService) {}

//   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
//     const request = context.switchToHttp().getRequest()
//     const apiKey = this.extractApiKey(request)

//     if (!apiKey) {
//       throw new UnauthorizedException('API key is required')
//     }

//     return this.validateApiKey(apiKey, request)
//   }

//   private extractApiKey(request: any): string | undefined {
//     // Intentar obtener la API key del header 'X-API-KEY'
//     const apiKey = request.headers['x-api-key']

//     // También se podría obtener de query params o de Authorization: Bearer
//     if (!apiKey && request.query.api_key) {
//       return request.query.api_key
//     }

//     return apiKey
//   }

//   private async validateApiKey(key: string, request: any): Promise<boolean> {
//     try {
//       const apiKey = await this.apiKeyService.validateApiKey(key)

//       // Añadir el usuario al request para que esté disponible en los controladores
//       request.user = apiKey.user

//       return true
//     } catch (error) {
//       throw new UnauthorizedException('Invalid API key')
//     }
//   }
// }
