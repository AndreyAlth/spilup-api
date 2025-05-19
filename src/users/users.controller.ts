import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common'
import { UsersService } from './users.service'
import { User } from 'generated/prisma'
import { AuthGuard } from 'src/auth/auth.guard'
import { Payload } from 'src/auth/auth.interface'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: User) {
    return this.usersService.create(createUserDto)
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  findProfile(@Request() req: { payload: Payload }) {
    const userId = req.payload.userId
    return this.usersService.findOne(userId)
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: User) {
    return this.usersService.update(id, updateUserDto)
  }
}
