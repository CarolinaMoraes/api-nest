import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { hasPasswordTransform } from 'src/common/helpers/crypto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({
    transformer: hasPasswordTransform,
  })
  @HideField()
  password: string;
}
