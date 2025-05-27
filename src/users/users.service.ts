/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma, User } from 'generated/prisma'
import { PublicUser } from './dto/user'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUser: User, prismaClient?: Prisma.TransactionClient): Promise<User | undefined> {
    const client = prismaClient || this.prisma
    try {
      const res = await client.$queryRaw<User[]>`
    INSERT INTO "User" (id, name, "last_name", email, password, "createdAt", "updatedAt")
    VALUES (
      gen_random_uuid(), 
      ${createUser.name}, 
      ${createUser.last_name}, 
      ${createUser.email}, 
      crypt(${createUser.password}, gen_salt('md5')), 
      NOW(), 
      NOW()
    )
    RETURNING id, name, "last_name", email, password, "createdAt", "updatedAt"
  `
      return res[0]
    } catch (error: any) {
      if (error?.code === '23505') {
        throw new Error('Email already exists')
      }
    }
  }

  findAll(): Promise<PublicUser[]> {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        last_name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        phone: true,
        provider: true,
        emailVerified: true,
        lastLogin: true,
      },
    })
  }

  findOne(id: string): Promise<PublicUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        last_name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        phone: true,
        provider: true,
        emailVerified: true,
        lastLogin: true,
      },
    })
  }

  //check email vulnerability
  update(id: string, updateUser: User) {
    return this.prisma.user.update({
      where: { id },
      data: updateUser,
      select: {
        id: true,
        name: true,
        last_name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async validatePassword(
    email: string,
    password: string,
    prismaClient?: Prisma.TransactionClient,
  ): Promise<{ valid: boolean }> {
    const client = prismaClient || this.prisma
    const result = await client.$queryRaw<{ valid: boolean }[]>`
      SELECT COUNT(*) > 0 as valid
      FROM "User"
      WHERE email = ${email} AND password = crypt(${password}, password)
    `

    return result[0]
  }

  async findByEmail(email: string, prismaClient?: Prisma.TransactionClient): Promise<PublicUser | null> {
    const client = prismaClient || this.prisma
    const user = await client.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        last_name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        phone: true,
        provider: true,
        emailVerified: true,
        lastLogin: true,
      },
    })
    return user
  }

  async verifyUser(userId: string, prismaClient?: Prisma.TransactionClient): Promise<PublicUser | null> {
    const client = prismaClient || this.prisma
    const user = await client.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        last_name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        phone: true,
        provider: true,
        emailVerified: true,
        lastLogin: true,
      },
    })
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }
    return user
  }
}
