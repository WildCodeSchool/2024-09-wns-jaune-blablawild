import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Trip

 } from "./trip";

@ObjectType()
@Entity()
export class Review extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: string;

  @Field()
  @Column()
  notation!: number;

  @Field()
  @Column()
  comment!: string;

  @Field()
  @Column()
  date!: Date;

  @Field()
  @ManyToOne(() => User, (user) => user.review)
  user!: User

  @Field()
  @ManyToOne(() => Trip, (trip) => trip.review)
  trip!: Trip


}