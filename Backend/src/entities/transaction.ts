import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Trip } from "./trip";
import { User } from "./user";

@ObjectType()
@Entity()
export class Transaction extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: string;

  @Field()
  @Column()
  status!: string;

  @Field()
  @Column()
  created_at!: Date;

  @Field()
  @Column()
  price!: number;

  @Field()
  @Column()
  method!: string;

  @Field(() => Trip)
  @ManyToOne(() => Trip, (trip) => trip.transactions)
  trip!: Trip;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.transaction_received)
  receiver!: User;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.transaction_sent)
  sender!: User;
}
