import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @IsString()
  @IsNotEmpty({ message: 'Este campo não pode estar vazio' })
  @Field({ nullable: true })
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Este campo não pode estar vazio' })
  @Field({ nullable: true })
  @IsOptional()
  email?: string;
}
