import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsString()
  @IsNotEmpty({ message: 'Este campo não pode estar vazio' })
  @Field()
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Este campo não pode estar vazio' })
  @Field()
  email: string;
}
