import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user";

@ObjectType()
@Entity()
export class Profile extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: string;

  @Field({nullable: true})
  @Column({nullable: true})
  phoneNumber?: string;

  @Field({nullable: true})
  @Column({nullable: true})
  image?: string;

  @Field({nullable: true})
  @Column({nullable: true})
  description?: string;

  @Field(() => User, { nullable: true })
  @OneToOne(()=> User, (user) => user.profile) 
  user?: User;
}