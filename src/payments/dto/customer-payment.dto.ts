import { IsNotEmpty, IsString } from 'class-validator'

export class Customer {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  email: string
}
